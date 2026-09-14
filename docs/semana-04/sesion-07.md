---
sidebar_position: 2
---

# Sesión 7 · Conectar una aplicación a PostgreSQL

**Duración:** 2 horas.  
**Meta:** separar la configuración del código y crear una entidad de curso que TypeORM pueda persistir.

[Abrir presentación navegable de la Sesión 7](/diapositivas/semana-04-sesion-07)

## Introducción · 10 min

El CRUD en memoria se entiende, pero desaparece al reiniciar. Una base de datos resuelve esa necesidad solo si la conexión y el modelo se definen de forma explícita y segura.

## Marco conceptual · 24 min (20%)

Material oficial: [técnicas de base de datos](https://docs.nestjs.com/techniques/database), [configuración](https://docs.nestjs.com/techniques/configuration) y [TypeORM](https://typeorm.io/).

### Diapositiva 1 · Qué añade persistencia

```text
Controller → Service → Repository → PostgreSQL
```

El controlador conserva el contrato HTTP. El servicio conserva las reglas. El repositorio traduce operaciones del dominio a almacenamiento.

### Diapositiva 2 · Configuración fuera del código

Credenciales y puertos cambian por equipo y entorno. `.env` los contiene localmente; `.env.example` documenta las claves sin publicar secretos.

### Diapositiva 3 · Entidad no es DTO

| DTO | Entidad |
| --- | --- |
| Entrada HTTP validada | Modelo que TypeORM guarda |
| `CreateCourseDto` | `Course` |
| No conoce la base de datos | Declara columnas y clave primaria |

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
        autoLoadEntities: true, synchronize: true,
      }),
    }),
    CoursesModule,
  ],
})
export class AppModule {}
```

`synchronize: true` es útil únicamente en desarrollo: ajusta el esquema a las entidades y no debe usarse como estrategia de producción.

## Cierre · 10 min

¿Qué archivo puede publicarse y cuál no? ¿Por qué una entidad no reemplaza la validación del DTO? Explica el nuevo recorrido de una operación hasta PostgreSQL.

## Proyecto integrador · 60 min (50%)

1. Instala las dependencias y prepara PostgreSQL local.
2. Añade `.env.example` y protege `.env` con `.gitignore`.
3. Configura `ConfigModule` y `TypeOrmModule` en `AppModule`.
4. Crea la entidad `Course` con `id`, `title` y `level`.
5. Arranca la API y confirma que conecta; publica solo los cambios seguros.

**Criterio de salida:** la aplicación arranca con su configuración local, TypeORM descubre `Course` y ninguna credencial real entra al repositorio.
