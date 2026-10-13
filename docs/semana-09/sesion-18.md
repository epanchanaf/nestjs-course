---
sidebar_position: 3
---

# Sesión 18 · Verificar JWT y proteger rutas

**Duración:** 2 horas.  
**Meta:** verificar Bearer tokens con una estrategia JWT, bloquear rutas sin identidad válida y acceder al usuario autenticado de forma controlada.

[Abrir presentación navegable de la Sesión 18](/diapositivas/semana-09-sesion-18)

## Prerrequisitos y materiales

Completa la Sesión 17: `POST /auth/login` debe emitir un `accessToken` firmado, `JWT_SECRET` debe estar validado desde el entorno y el payload debe contener `sub` y `email`. Conserva un token de práctica vigente solo durante la clase. Necesitas un cliente HTTP capaz de enviar encabezados.

Antes de comenzar, responde: ¿qué debe ocurrir si una persona intenta acceder a un perfil sin enviar token? La respuesta de esta sesión será `401 Unauthorized`. No usaremos aún `403 Forbidden`, porque los roles y permisos se trabajan en la Semana 10.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Recuperación | Identificar dónde viaja un Bearer token. |
| 10–30 | Marco conceptual | Comprender estrategia, guard, `req.user` y errores `401`. |
| 30–60 | Demostración guiada | Registrar Passport, estrategia JWT y guard reutilizable. |
| 60–100 | Práctica guiada | Proteger `/auth/me` y una ruta de negocio. |
| 100–110 | Actividad autónoma | Ejecutar matriz de tokens ausentes, inválidos y expirados. |
| 110–120 | Cierre | Diferenciar identidad autenticada de permiso. |

## Introducción · 10 min

El login de la Sesión 17 genera una credencial temporal. Esta credencial no sirve de nada si las demás rutas la ignoran. Hoy la API recibirá el encabezado `Authorization`, extraerá el token Bearer, verificará su firma y vencimiento, y permitirá continuar solo si es válido.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Un *guard* se ejecuta antes del método del controlador. Si la identidad no es válida, el guard termina la petición con `401`; el método protegido no llega a ejecutarse. Si es válida, la estrategia deja un usuario seguro en `req.user`.

## Marco conceptual · 20 min

Material oficial: [autenticación con Passport en Nest](https://docs.nestjs.com/recipes/passport), [guardias de Nest](https://docs.nestjs.com/guards) y [estrategia JWT de Passport](https://www.passportjs.org/packages/passport-jwt/).

### El recorrido de una solicitud protegida

```text
GET /auth/me + Authorization: Bearer <token>
                 ↓
JwtAuthGuard pide la estrategia "jwt"
                 ↓
JwtStrategy extrae, verifica firma y revisa exp
                 ↓
validate(payload) crea el usuario seguro de la petición
                 ↓
controlador recibe req.user y genera la respuesta
```

| Pieza | Responsabilidad | No debe hacer |
| --- | --- | --- |
| `JwtStrategy` | Extraer token, verificarlo y convertir payload en identidad de petición. | Decidir roles o reglas de negocio. |
| `JwtAuthGuard` | Aplicar la estrategia sobre una ruta. | Duplicar la lógica criptográfica. |
| Controlador | Declarar qué ruta requiere autenticación y usar la identidad. | Revalidar manualmente el token. |
| Servicio de negocio | Aplicar reglas propias del recurso. | Leer directamente el encabezado HTTP. |

### `401` no es `403`

| Respuesta | Significado en este curso | Ejemplo |
| --- | --- | --- |
| `401 Unauthorized` | No hay una identidad autenticada válida. | Token ausente, alterado, expirado o con firma incorrecta. |
| `403 Forbidden` | La identidad existe, pero no tiene permiso para esa acción. | Una regla de rol de la Semana 10. |

Una persona con JWT válido puede estar autenticada y aun así no tener autorización para administrar un recurso. No escribiremos esa condición todavía.

## Demostración guiada · 30 min

### Paso 1 · Instalar Passport

```bash
npm i @nestjs/passport passport passport-jwt
npm i -D @types/passport-jwt
```

`@nestjs/jwt` firma tokens; `passport-jwt` ayuda a extraerlos y validarlos en cada solicitud. Son piezas complementarias, no alternativas.

### Paso 2 · Crear tipos para una carga y una identidad seguras

`src/auth/types/jwt-payload.type.ts`:

```ts
export type JwtPayload = {
  sub: number;
  email: string;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
};
```

La carga firmada usa el nombre estándar `sub`; el resto de la aplicación puede trabajar con el nombre más claro `id`. Ninguno de los dos tipos incluye la contraseña ni el hash.

### Paso 3 · Registrar y definir la estrategia

`src/auth/strategies/jwt.strategy.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, email: payload.email };
  }
}
```

`fromAuthHeaderAsBearerToken()` acepta exactamente el esquema `Authorization: Bearer <token>`. `ignoreExpiration: false` mantiene activa la caducidad firmada por la Sesión 17. Si el token no se verifica, `validate` no se ejecuta.

En esta primera versión, `validate` devuelve la identidad contenida en el token. Una aplicación posterior podría consultar `UsersService` para comprobar que la cuenta sigue activa; eso requiere definir una política de estado y revocación que no forma parte aún de esta semana.

### Paso 4 · Declarar un guard reutilizable

`src/auth/guards/jwt-auth.guard.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Registra `JwtStrategy` en los `providers` de `AuthModule`, e importa `PassportModule` en sus `imports`:

```ts
@Module({
  imports: [UsersModule, PassportModule, JwtModule.registerAsync(/* ... */)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

No crees un guard diferente por cada controlador. Este guard expresa una regla transversal: "esta ruta requiere un JWT válido".

### Paso 5 · Proteger el perfil de la persona autenticada

Agrega una ruta que lea la identidad puesta por la estrategia:

```ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUser } from './types/jwt-payload.type';

type RequestWithUser = Request & { user: AuthenticatedUser };

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: RequestWithUser) {
    return request.user;
  }
}
```

La respuesta de `GET /auth/me` será la identidad segura, por ejemplo `{ "id": 1, "email": "ana@example.com" }`. Usamos `@Req()` de forma explícita. Los decoradores personalizados, como `@CurrentUser()`, pertenecen a la Semana 10 junto con las reglas de autorización.

### Paso 6 · Proteger una ruta de negocio elegida

Para comprobar que el guard no depende de `/auth`, protege también una ruta de negocio. Por ejemplo, si la política de esta etapa exige iniciar sesión para crear cursos:

```ts
@Post()
@UseGuards(JwtAuthGuard)
create(@Body() dto: CreateCourseDto) {
  return this.coursesService.create(dto);
}
```

Deja documentadas las rutas públicas y protegidas. En esta semana, cualquier usuario autenticado puede usar una ruta protegida; no se interpreta aún si es docente, administrador o estudiante. No confundas "requiere login" con "requiere rol".

## Práctica guiada · 40 min

### A. Preparar el token

1. Inicia sesión con una cuenta de práctica.
2. Copia el valor de `accessToken` en una variable temporal de tu cliente HTTP; no lo pegues dentro del código.
3. Comprueba que comienza como un JWT de tres secciones separadas por puntos.

### B. Probar el perfil protegido

```http
GET http://localhost:3000/auth/me
Authorization: Bearer {{accessToken}}
```

Debe devolver `200` con `id` y `email`. Ejecuta la matriz completa:

| Caso | Encabezado | Resultado esperado | ¿El método `me` debe ejecutarse? |
| --- | --- | --- | --- |
| Token vigente | `Bearer <token válido>` | `200` | Sí. |
| Sin encabezado | Ninguno | `401` | No. |
| Esquema erróneo | `Token <token>` | `401` | No. |
| Token alterado | Cambia un carácter | `401` | No. |
| Token expirado | Token que superó `exp` | `401` | No. |

### C. Probar una ruta de negocio protegida

Elige una ruta de escritura acordada por tu equipo, por ejemplo `POST /courses`.

1. Ejecuta la petición sin encabezado: debe recibir `401` y no crear un curso.
2. Ejecuta exactamente el mismo cuerpo con token válido: debe seguir pasando el DTO y crear el recurso con el código que ya establecía el contrato del curso.
3. Envía un cuerpo inválido con token válido: debe recibir `400`. Esto demuestra que autenticación y validación son capas distintas.

**Criterio de éxito:** al menos dos rutas usan el mismo `JwtAuthGuard`, las solicitudes no autenticadas se detienen antes del controlador y `req.user` contiene solo la identidad que la estrategia preparó.

## Diagnóstico de problemas frecuentes

| Síntoma | Causa probable | Corrección |
| --- | --- | --- |
| `Unknown authentication strategy "jwt"` | `JwtStrategy` no está declarada como provider o `AuthModule` no se carga. | Añade la estrategia a `providers` y confirma que `AppModule` importa `AuthModule`. |
| Todos los tokens reciben `401` | Encabezado mal formado, secreto distinto o token expirado. | Revisa `Bearer `, reinicia tras editar `.env` y genera un token nuevo. |
| `req.user` es `undefined` en una ruta | Falta el guard o se intentó usar la identidad antes de la estrategia. | Añade `@UseGuards(JwtAuthGuard)` y prueba primero `/auth/me`. |
| Token sin vencimiento efectivo | Se omitió `signOptions.expiresIn` o se usa otra configuración. | Lee `JWT_EXPIRES_IN` desde `ConfigService` y revisa el payload. |
| Una ruta pública deja de funcionar | Se aplicó el guard globalmente sin excluir login/registro. | Durante esta semana protege rutas de forma explícita con `@UseGuards`. |
| Respuesta `403` esperada para token ausente | Se mezcló autenticación con autorización. | Un token ausente o inválido es `401`; roles se implementan en la Semana 10. |

## Actividad autónoma · 10 min

Elabora una pequeña tabla de rutas del proyecto con una columna "pública" o "requiere JWT". Justifica dos decisiones. La tabla debe dejar claro que `POST /auth/register` y `POST /auth/login` permanecen públicas; de otro modo nadie podría obtener una cuenta o token.

## Cierre · 10 min

Explica qué ocurre, en orden, cuando se hace `GET /auth/me` con un token alterado. Luego responde: si una persona tiene un token válido, ¿eso prueba que puede borrar cualquier curso? Explica por qué la respuesta es no y qué semana definirá esa regla.

## Tarea opcional

Protege una ruta de lectura de matrículas y documenta qué cambia en su contrato: encabezado requerido, `401` posible y respuesta exitosa sin cambio. No añadas aún una condición basada en rol, propiedad del recurso ni `@CurrentUser()` personalizado.
