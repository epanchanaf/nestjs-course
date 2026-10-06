---
sidebar_position: 2
---

# Sesión 13 · Variables de entorno y configuración validada

**Duración:** 2 horas.  
**Meta:** cargar puerto y datos de conexión desde el entorno, validarlos al iniciar y dejar una guía reproducible sin secretos.

[Abrir presentación navegable de la Sesión 13](/diapositivas/semana-07-sesion-13)

## Prerrequisitos y materiales

Debes tener CourseHub API con PostgreSQL funcionando. Lleva un `.env` local con credenciales de desarrollo y verifica que está en `.gitignore`. Necesitas Node.js, PostgreSQL y un cliente HTTP. No compartas ni proyectes contraseñas reales.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Problema inicial | Identificar valores que no deben estar codificados. |
| 10–30 | Marco conceptual | Distinguir código, configuración y secreto. |
| 30–60 | Demostración guiada | `ConfigModule` y validación con Joi. |
| 60–100 | Práctica guiada | Aplicar configuración a `main.ts` y probar errores. |
| 100–110 | Actividad autónoma | Crear `.env.example` seguro. |
| 110–120 | Cierre | Explicar una configuración fallida y su mensaje. |

## Introducción · 10 min

Un puerto, nombre de base, host o contraseña cambian al mover la misma aplicación de una computadora a otra. Si esos valores se escriben en el código, cada cambio obliga a modificar archivos, revisar cambios y arriesgar publicar secretos. El código describe cómo funciona la aplicación; la configuración describe dónde y con qué valores se ejecuta.

Hoy reemplazaremos valores incrustados, como `port: 3000` o una contraseña en `TypeOrmModule.forRoot`, por variables de entorno. La aplicación debe detenerse temprano y explicar qué falta, en vez de arrancar con una configuración incompleta.

## Marco conceptual · 20 min

Material oficial: [configuración de Nest](https://docs.nestjs.com/techniques/configuration), [variables de entorno de Node.js](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) y [Joi](https://joi.dev/api/).

| Concepto | Ejemplo | ¿Se versiona? |
| --- | --- | --- |
| Código | `CoursesService` | Sí |
| Configuración no secreta | `PORT=3000`, `DB_HOST=localhost` | El ejemplo sí; el archivo local depende del equipo. |
| Secreto | `DB_PASSWORD` | No |
| Plantilla | `.env.example` con nombres y valores ficticios | Sí |

Una variable presente no necesariamente es válida. `DB_PORT=hola` existe, pero no puede abrir una conexión. La validación de esquema convierte el error en una falla clara durante el arranque.

## Demostración guiada · 30 min

### Paso 1 · Instalar e inicializar configuración

```ts
// app.module.ts
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().port().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow('').required(),
      }),
    }),
  ],
})
export class AppModule {}
```

`isGlobal: true` permite inyectar `ConfigService` sin repetir importaciones. La validación ocurre antes de que la aplicación intente conectarse a PostgreSQL. Ajusta la política de contraseña vacía a tu contexto: aquí se permite solo para desarrollo local si el servidor lo acepta; en producción se debe exigir una contraseña real.

### Paso 2 · Leer el puerto al iniciar

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
}
bootstrap();
```

`getOrThrow` hace explícita una dependencia obligatoria. Evita el patrón `process.env.PORT || 3000` distribuido por el código: centralizar la lectura facilita probar, revisar y cambiar valores.

### Paso 3 · Crear una plantilla segura

`.env.example`:

```dotenv
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coursehub
DB_USER=postgres
DB_PASSWORD=replace-with-your-local-password
```

El archivo `.env` real debe estar en `.gitignore`. `.env.example` sí se comparte para que otra persona conozca los nombres esperados sin recibir credenciales.

### Paso 4 · Probar fallas intencionales

Renombra temporalmente `DB_NAME` en tu `.env` o define `DB_PORT=not-a-number`. Al iniciar, la aplicación debe detenerse y nombrar la variable inválida. Restaura el archivo y confirma que `GET /courses` sigue respondiendo.

## Práctica guiada · 40 min

1. Instala `@nestjs/config` y `joi` si el proyecto aún no los tiene.
2. Añade `ConfigModule.forRoot` con el esquema mínimo anterior.
3. Mueve el puerto desde `main.ts` a `PORT`.
4. Crea `.env.example` y verifica que `.env` aparezca en `.gitignore`.
5. Provoca una variable ausente, observa el error y vuelve a iniciar correctamente.

**Criterio de éxito:** el puerto se puede cambiar sin editar TypeScript, una variable requerida ausente bloquea el arranque y no aparece ninguna credencial real en archivos versionados.

## Actividad autónoma · 10 min

Revisa los archivos modificados antes de preparar un commit. Anota qué archivo puede publicarse, cuál no y qué daño causaría que `DB_PASSWORD` aparezca en un repositorio público.

## Cierre · 10 min

Explica por qué una aplicación debe fallar rápido ante `DB_HOST` ausente. Muestra el contenido de `.env.example` sin contraseñas reales y un inicio exitoso con un puerto distinto al predeterminado.

## Tarea opcional

Define `LOG_LEVEL` con una lista permitida (`debug`, `log`, `warn`, `error`) y úsalo para configurar el registrador de Nest. Documenta su valor predeterminado.
