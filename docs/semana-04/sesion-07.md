---
sidebar_position: 2
---

# Sesión 7 · Conectar una aplicación a PostgreSQL

**Duración:** 2 horas.  
**Meta:** preparar PostgreSQL y TypeORM para que `Course` tenga una tabla persistente, sin cambiar todavía el CRUD que vive en memoria.

[Abrir presentación navegable de la Sesión 7](/diapositivas/semana-04-sesion-07)

## Antes de empezar

Debes tener el CRUD validado de la Semana 3 y una instalación local de PostgreSQL en ejecución. Esta sesión no requiere conocer SQL avanzado, pero sí distinguir entre una aplicación, una base de datos y una tabla. Necesitarás acceso a una terminal para crear una base de desarrollo y editar variables de entorno.

Antes de tocar el código, ejecuta la API actual y crea un curso. Reinicia el servidor y observa que desaparece. El servicio todavía usa un arreglo temporal, por lo que esa pérdida es esperada. Esa evidencia concreta explica por qué introducimos persistencia.

## Introducción · 10 min

El CRUD en memoria ya nos permitió aprender rutas, DTOs, validación y errores HTTP. Su límite es que los datos desaparecen al reiniciar. Una base de datos resuelve esa necesidad solo si la conexión y el modelo se definen de forma explícita y segura.

PostgreSQL es el programa que conserva datos en disco. TypeORM es una biblioteca que relaciona nuestras clases con tablas. NestJS coordina las piezas: carga la configuración, abre la conexión y prepara las entidades. En la Sesión 8 conectaremos el servicio al repositorio de TypeORM y sustituiremos el arreglo temporal.

## Marco conceptual · 24 min (20%)

Material oficial: [técnicas de base de datos](https://docs.nestjs.com/techniques/database), [configuración](https://docs.nestjs.com/techniques/configuration) y [TypeORM](https://typeorm.io/).

### Diapositiva 1 · Del arreglo temporal a una tabla

```text
Hoy:      Controller → Service → arreglo en memoria
Al final: Controller → Service → repositorio TypeORM → PostgreSQL
```

Las rutas, los DTOs y las respuestas HTTP no cambian. Hoy preparamos la conexión y la tabla; el repositorio —la pieza que el servicio usará para leer y escribir— se presenta y se usa en la siguiente sesión.

### Diapositiva 2 · Configuración fuera del código

Credenciales y puertos cambian por equipo y entorno. `.env` los contiene localmente; `.env.example` documenta las claves sin publicar secretos.

### Vocabulario esencial

- **Base de datos:** contenedor de información relacionada, como `coursehub`.
- **Tabla:** conjunto estructurado de filas dentro de una base de datos, como `courses`.
- **Fila o registro:** una unidad guardada en la tabla; en este curso, un curso concreto.
- **Entidad:** clase TypeScript que TypeORM relaciona con una tabla.
- **Variable de entorno:** valor de configuración externo al código, por ejemplo el puerto o contraseña de PostgreSQL.
- **ORM:** herramienta que conecta objetos o clases con almacenamiento relacional. TypeORM es el ORM elegido aquí.
- **Repositorio:** objeto que permite consultar y guardar una entidad. Lo usaremos por primera vez en la Sesión 8.

### Diapositiva 3 · Entidad no es DTO

| DTO | Entidad |
| --- | --- |
| Entrada HTTP validada | Modelo que TypeORM guarda |
| `CreateCourseDto` | `Course` |
| No conoce la base de datos | Declara tabla, columnas y clave primaria |

La entidad no reemplaza al DTO. `CreateCourseDto` sigue protegiendo lo que llega por HTTP; `Course` describe cómo se organiza un curso una vez que se guarda. Por ahora el controlador seguirá enviando el DTO al servicio igual que en la Semana 3.

## Desarrollo · ejemplo guiado · 36 min (30%)

Instala dependencias:

```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg
```

### `.env.example`

```dotenv
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
```

Agrega `.env` a `.gitignore` y crea tu copia local a partir de estos valores. Crea la base de datos `coursehub` en tu instancia local de PostgreSQL.

Un modo común de crearla desde la terminal, si tienes las herramientas de PostgreSQL instaladas, es:

```bash
createdb coursehub
```

También puedes usar pgAdmin, DBeaver u otra interfaz gráfica. Lo importante es que el nombre coincida exactamente con `DATABASE_NAME`. Si usas otra cuenta, otro puerto o un contenedor Docker, ajusta solo tu `.env`; no modifiques valores personales dentro del código fuente.

### `src/courses/entities/course.entity.ts`

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; // 1

@Entity('courses') // 2
export class Course { // 3
  @PrimaryGeneratedColumn() // 4
  id: number;

  @Column() // 5
  title: string;

  @Column() // 6
  level: string;
}
```

1. Importa decoradores de TypeORM.
2. Define la tabla `courses`.
3. Declara el modelo persistente.
4. Genera el identificador primario.
5–6. Declara columnas obligatorias.

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', host: config.getOrThrow('DATABASE_HOST'),
        port: Number(config.getOrThrow('DATABASE_PORT')),
        username: config.getOrThrow('DATABASE_USER'),
        password: config.getOrThrow('DATABASE_PASSWORD'),
        database: config.getOrThrow('DATABASE_NAME'),
        entities: [Course],
        synchronize: true,
      }),
    }),
    CoursesModule,
  ],
})
export class AppModule {}
```

`synchronize: true` es útil únicamente en desarrollo: ajusta el esquema a las entidades y no debe usarse como estrategia de producción.

### Lee la configuración por capas

1. `ConfigModule.forRoot({ isGlobal: true })` busca y carga las variables de `.env` al iniciar la aplicación.
2. `TypeOrmModule.forRootAsync` espera a que `ConfigService` esté disponible antes de construir la conexión.
3. `config.getOrThrow('DATABASE_HOST')` detiene el arranque con un error claro si falta una clave importante.
4. `entities: [Course]` indica con claridad qué entidad debe conocer esta primera conexión; TypeORM puede crear la tabla `courses` a partir de ella.
5. `synchronize: true` crea o ajusta tablas durante el desarrollo local.

En esta sesión registramos `Course` en la conexión para crear su tabla. No inyectamos todavía un repositorio en `CoursesService`: el CRUD sigue usando el arreglo de la Semana 3. La Sesión 8 hará esa sustitución sin alterar las rutas ni los DTOs.

Si el servidor no inicia, no supongas que el código está mal. Primero revisa el mensaje de error: una contraseña incorrecta, PostgreSQL apagado o una variable ausente producen problemas distintos.

### Comprobación de la conexión

Después de crear la entidad y arrancar la API, confirma dos cosas: que TypeORM se conectó y que PostgreSQL contiene la tabla `courses`. Puedes verlo con tu cliente de base de datos (pgAdmin, DBeaver u otro). Es normal que la tabla esté vacía: todavía no hemos conectado el CRUD al repositorio.

| Mensaje o síntoma | Interpretación habitual | Primera revisión |
| --- | --- | --- |
| `ECONNREFUSED` | PostgreSQL no acepta conexiones en ese host/puerto | Confirma que el servicio esté iniciado y revisa `DATABASE_PORT`. |
| `password authentication failed` | Usuario o contraseña incorrectos | Revisa `.env`, sin compartir la contraseña. |
| `database "coursehub" does not exist` | Falta crear la base de datos | Crea la base o corrige `DATABASE_NAME`. |
| Falta una variable | `getOrThrow` detuvo el arranque a propósito | Compara `.env` con `.env.example`. |

### Decisión importante: desarrollo frente a producción

`synchronize: true` ahorra tiempo porque TypeORM puede crear la tabla automáticamente. Pero un sistema en producción no debe permitir cambios de esquema implícitos: allí usaremos migraciones, revisadas y aplicadas conscientemente. Anotar esta distinción desde ahora evita convertir una comodidad local en un riesgo futuro.

## Cierre · 10 min

¿Qué archivo puede publicarse y cuál no? ¿Por qué una entidad no reemplaza la validación del DTO? Explica qué permanece igual del CRUD de la Semana 3 y qué preparó esta sesión para la siguiente.

## Proyecto integrador · 60 min (50%)

1. Instala las dependencias y prepara PostgreSQL local.
2. Añade `.env.example` y protege `.env` con `.gitignore`.
3. Configura `ConfigModule` y `TypeOrmModule` en `AppModule`.
4. Crea la entidad `Course` con `id`, `title` y `level`, y regístrala en la conexión.
5. Arranca la API y confirma la conexión y la tabla vacía; publica solo los cambios seguros.

**Criterio de salida:** la aplicación arranca con su configuración local, PostgreSQL tiene la tabla `courses`, el CRUD aún funciona en memoria y ninguna credencial real entra al repositorio.

## Tarea opcional

Agrega `DATABASE_LOGGING=false` a `.env.example` y úsala para activar o desactivar el registro de consultas de TypeORM en desarrollo. Prueba el valor `true`, observa la salida de la terminal y después vuelve a `false`. Explica en el README por qué los logs de desarrollo ayudan a aprender, pero no deben exponer información sensible.
