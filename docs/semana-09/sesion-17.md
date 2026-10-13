---
sidebar_position: 2
---

# Sesión 17 · Emitir tokens JWT después del login

**Duración:** 2 horas.  
**Meta:** generar un token de acceso con una carga mínima y configurarlo de forma segura mediante variables de entorno.

[Abrir presentación navegable de la Sesión 17](/diapositivas/semana-09-sesion-17)

## Prerrequisitos y materiales

Debes tener `POST /auth/register` y `POST /auth/login` funcionando desde la Semana 8. El login debe comparar con `bcrypt`, responder `401` ante credenciales erróneas y no filtrar `passwordHash`. Necesitas acceso al `.env` local, pero no debes compartir su contenido ni pegar secretos en el aula, README o historial de Git.

Registra una cuenta de práctica y conserva una petición de login correcta. La reutilizaremos para comprobar que el token solo aparece después de que las credenciales sean válidas.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Problema inicial | Identificar por qué volver a enviar contraseña en cada ruta es una mala solución. |
| 10–30 | Marco conceptual | Leer estructura, firma, vencimiento y límites de un JWT. |
| 30–60 | Demostración guiada | Configurar `JwtModule` y convertir el login en emisor de token. |
| 60–100 | Práctica guiada | Emitir, revisar y probar tokens de acceso. |
| 100–110 | Actividad autónoma | Auditar carga útil y configuración secreta. |
| 110–120 | Cierre | Explicar qué prueba la firma y qué no protege un JWT. |

## Introducción · 10 min

En la Semana 8, el servidor puede comprobar una contraseña durante `POST /auth/login`. Pero si el cliente quiere consultar cinco rutas después, reenviar la contraseña en cada petición sería peligroso y difícil de controlar. Necesitamos una credencial temporal emitida por el servidor después del login: un token de acceso.

Un JSON Web Token (JWT) firmado permite al servidor verificar que el token no fue alterado y que no ha expirado. El cliente lo conservará y lo presentará como Bearer token en la Semana 9. Un JWT no reemplaza la validación inicial de contraseña: se emite **después** de validarla.

## Marco conceptual · 20 min

Material oficial: [autenticación de Nest](https://docs.nestjs.com/security/authentication), [módulo JWT de Nest](https://github.com/nestjs/jwt) y [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519).

### Anatomía de un JWT

```text
base64url(header).base64url(payload).base64url(signature)
```

| Parte | Contiene | Punto de seguridad |
| --- | --- | --- |
| Header | Algoritmo y tipo de token. | Describe cómo se firmó; no es secreto. |
| Payload | *Claims* como `sub`, correo y vencimiento. | Se puede decodificar; no es lugar para secretos. |
| Signature | Firma calculada con el secreto del servidor. | Permite detectar alteraciones. |

**JWT está firmado, no cifrado.** Cualquier persona que posea el token puede leer el payload al decodificarlo. Por eso nunca incluimos contraseña, `passwordHash`, datos bancarios, secretos de configuración ni información que no deba circular al cliente.

### Claims mínimas del curso

`src/auth/types/jwt-payload.type.ts`:

```ts
export type JwtPayload = {
  sub: number;
  email: string;
};
```

- `sub` (*subject*) identifica al usuario y usará el `id` de `User`.
- `email` sirve como dato de contexto para esta etapa; debe ser el correo normalizado.
- `iat` y `exp` los añade la biblioteca cuando se firma con expiración.

No agregamos roles todavía. Si se firmaran ahora, no existiría aún una política de autorización clara que los use.

### Secreto y vencimiento

| Variable | Propósito | Regla |
| --- | --- | --- |
| `JWT_SECRET` | Firma y permite verificar tokens. | Es secreto, aleatorio y no se versiona. |
| `JWT_EXPIRES_IN` | Limita la vida de un access token, por ejemplo `15m`. | Es configuración validada y puede documentarse en `.env.example`. |

El secreto no es una contraseña corta inventada para la clase. Genera uno largo con un gestor de secretos o un generador criptográficamente seguro y guárdalo solo en tu `.env` local. Si cambia el secreto, los tokens emitidos con el anterior dejan de ser válidos: esa propiedad será útil para diagnosticar pruebas.

## Demostración guiada · 30 min

### Paso 1 · Instalar JWT y ampliar la configuración

```bash
npm i @nestjs/jwt
```

Agrega las variables al esquema de configuración creado en la Semana 7:

```ts
JWT_SECRET: Joi.string().min(32).required(),
JWT_EXPIRES_IN: Joi.string().default('15m'),
```

En `.env.example` documenta nombres y valores de ejemplo seguros:

```dotenv
JWT_SECRET=replace-with-a-long-random-local-secret
JWT_EXPIRES_IN=15m
```

El valor real de `JWT_SECRET` solo vive en `.env` o en el entorno de despliegue. No uses el texto de `.env.example` como secreto efectivo.

### Paso 2 · Registrar `JwtModule` desde `ConfigService`

`src/auth/auth.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

La aplicación ya valida configuración antes de iniciar. Usar `ConfigService` evita dejar un segundo secreto fijo dentro de TypeScript y conserva una sola fuente de verdad para cada ambiente.

### Paso 3 · Separar validación de credenciales y emisión

Refactoriza el login de la Semana 8. Primero crea un método interno que valida y devuelve los datos seguros:

```ts
private async validateCredentials(email: string, password: string) {
  const user = await this.usersService.findByEmailWithPassword(email);
  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return { id: user.id, email: user.email, createdAt: user.createdAt };
}
```

Después, inyecta `JwtService`, importa el tipo anterior y firma una carga mínima:

```ts
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

constructor(
  private readonly usersService: UsersService,
  private readonly jwtService: JwtService,
) {}

async login(dto: LoginDto) {
  const user = await this.validateCredentials(dto.email, dto.password);
  const payload: JwtPayload = { sub: user.id, email: user.email };

  return {
    accessToken: await this.jwtService.signAsync(payload),
    user,
  };
}
```

`JwtService` se usa solo después de validar la contraseña. Firmar antes permitiría crear tokens para credenciales incorrectas, lo que destruye el propósito de la autenticación.

### Paso 4 · Leer una respuesta sin convertirla en evidencia sensible

Un login correcto tendrá esta forma general:

```json
{
  "accessToken": "eyJ...",
  "user": {
    "id": 1,
    "email": "ana@example.com",
    "createdAt": "2026-10-26T..."
  }
}
```

El token es una credencial. Aunque sea de práctica, evita pegarlo en un repositorio, una captura pública o el chat de un equipo. Si se expone, trátalo como expuesto: espera a que expire o cambia el secreto local para invalidarlo.

## Práctica guiada · 40 min

1. Instala `@nestjs/jwt`, agrega las dos variables y confirma que la aplicación falla al iniciar si `JWT_SECRET` falta.
2. Registra o reutiliza una cuenta de práctica e inicia sesión.
3. Confirma que ahora la respuesta contiene `accessToken` y que `user` no contiene hash ni contraseña.
4. Decodifica el payload localmente o inspecciónalo con una herramienta que no conserve el token. Verifica `sub`, `email`, `iat` y `exp`; no deberías encontrar secretos.
5. Espera el vencimiento configurado en una prueba corta temporal, o utiliza una variable de prueba local, y prepara la observación para la sesión siguiente. Restaura `15m` al terminar.
6. Repite el login con una contraseña equivocada: debe devolver `401` y **no** debe entregar token.

Matriz de verificación:

| Caso | Resultado esperado |
| --- | --- |
| Login válido | `200`, `accessToken` y usuario seguro. |
| Password incorrecta | `401`, sin `accessToken`. |
| `JWT_SECRET` ausente | La aplicación no inicia por validación de configuración. |
| Payload inspeccionado | Solo contiene identidad mínima y tiempos; no secretos. |
| Secreto cambiado y token anterior | El token anterior no deberá verificarse en la sesión 18. |

**Criterio de éxito:** solo una autenticación correcta produce un token firmado, el secreto no está codificado en la aplicación y el payload no expone ningún dato que no pueda ser público para quien tiene el token.

## Diagnóstico de problemas frecuentes

| Síntoma | Causa probable | Corrección |
| --- | --- | --- |
| La aplicación no inicia con un error de configuración | Falta `JWT_SECRET` o no cumple el mínimo. | Completa el `.env` local; no debilites la regla para usar una clave corta. |
| Todo token parece igual entre logins | Se revisa solo header/payload o se firmó en el mismo instante. | La firma y tiempos dependen de la emisión; lo importante es validar la carga y vencimiento. |
| El token contiene `passwordHash` | Se pasó la entidad completa a `signAsync`. | Construye `JwtPayload` explícitamente con `sub` y `email`. |
| Login erróneo devuelve token | La firma se ejecuta antes de validar. | Extrae `validateCredentials` y firma solo después de que no lance excepción. |
| Los tokens antiguos fallan después de editar `.env` | Cambió el secreto. | Es el comportamiento esperado; vuelve a iniciar sesión y conserva el secreto estable por ambiente. |

## Actividad autónoma · 10 min

Examina un payload de práctica y escribe una lista de tres campos que nunca incluirías allí, con una razón para cada uno. Luego compara esa lista con tu código y verifica que `signAsync` recibe un objeto explícito, no una entidad de TypeORM.

## Cierre · 10 min

Completa oralmente esta frase: «La firma de un JWT permite comprobar ___; no significa que el payload sea ___». Después explica por qué el token debe expirar incluso cuando su firma es válida.

## Tarea opcional

Documenta en el README el contrato de `POST /auth/login`: entrada, salida, caducidad aproximada y advertencia de no publicar tokens. No documentes el valor de `JWT_SECRET` ni uses un token real como ejemplo.
