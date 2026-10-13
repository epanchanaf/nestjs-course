---
sidebar_position: 3
---

# Sesión 16 · Comprobar credenciales para iniciar sesión

**Duración:** 2 horas.  
**Meta:** validar correo y contraseña contra el hash persistido, responder de forma segura y diferenciar autenticación de autorización.

[Abrir presentación navegable de la Sesión 16](/diapositivas/semana-08-sesion-16)

## Prerrequisitos y materiales

Debes haber terminado la Sesión 15: existe la tabla `users`, `POST /auth/register` funciona y `passwordHash` no aparece en las respuestas. Registra al menos dos cuentas de práctica antes de comenzar. Necesitas un cliente HTTP y el registro de respuestas, pero no debes guardar contraseñas reales en una colección compartida.

Esta sesión **no** entrega un token. Su objetivo es comprobar correctamente las credenciales. La Semana 9 añadirá JWT para que una solicitud posterior pueda demostrar que ya superó esta comprobación.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Recuperación | Explicar por qué no se compara una contraseña con un hash usando `===`. |
| 10–30 | Marco conceptual | Separar autenticación, autorización y sesión. |
| 30–60 | Demostración guiada | Consultar el hash de forma controlada y usar `bcrypt.compare`. |
| 60–100 | Práctica guiada | Implementar `POST /auth/login` y probar su matriz de casos. |
| 100–110 | Actividad autónoma | Revisar mensajes de error y respuestas seguras. |
| 110–120 | Cierre | Defender por qué el error de login es genérico. |

## Introducción · 10 min

En la sesión anterior guardamos un hash. Hoy una persona entrega de nuevo su correo y contraseña; el servidor busca la cuenta y pregunta a `bcrypt` si ese texto produce una coincidencia con el hash almacenado. No se genera un hash nuevo y se compara con `===`: el salt hace que dos hashes de la misma contraseña puedan ser diferentes.

El flujo correcto es el siguiente:

```text
POST /auth/login
correo + contraseña
        ↓
buscar usuario, incluyendo passwordHash solo para esta operación
        ↓
bcrypt.compare(contraseña recibida, passwordHash almacenado)
        ↓
coincide → datos seguros del usuario
no coincide o no existe → 401 con mensaje genérico
```

## Marco conceptual · 20 min

### Tres conceptos que no son equivalentes

| Concepto | Pregunta que responde | Ejemplo en CourseHub |
| --- | --- | --- |
| Autenticación | «¿Quién es esta persona?» | Comprobar correo y contraseña. |
| Sesión | «¿Cómo demuestra en la siguiente petición que ya se autenticó?» | JWT, a partir de la Semana 9. |
| Autorización | «¿Puede esta persona realizar esta acción?» | Roles y permisos, en la Semana 10. |

Una contraseña correcta autentica a una persona, pero todavía no responde si puede eliminar cursos, ver datos de otros estudiantes o administrar matrículas. No adelantaremos esas reglas hasta que exista una identidad autenticada reutilizable.

### Errores que ayudan sin revelar demasiado

Para el inicio de sesión, tanto «correo inexistente» como «contraseña incorrecta» deben responder la misma idea:

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

Si la API respondiera «ese correo no existe», permitiría a alguien probar listas de direcciones y descubrir cuáles son cuentas registradas. En cambio, en el registro sí podemos informar que un correo ya está ocupado: es una decisión de experiencia de usuario del ejercicio. Los dos casos tienen amenazas distintas.

### Códigos que usaremos

| Situación | Código | ¿Por qué? |
| --- | --- | --- |
| Formato de correo o contraseña inválido | `400 Bad Request` | El cuerpo no cumple el DTO. |
| Credenciales que no coinciden | `401 Unauthorized` | No se pudo autenticar la solicitud. |
| Login correcto | `200 OK` | Se validaron las credenciales; aún no se crea JWT. |
| Registro con correo repetido | `409 Conflict` | Ya existe un recurso con esa identidad. |

## Demostración guiada · 30 min

### Paso 1 · Crear el DTO de inicio de sesión

`src/auth/dto/login.dto.ts`:

```ts
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
```

El DTO valida la forma de entrada; no consulta la base ni compara contraseñas. Mantener esas tareas fuera del DTO permite probar y cambiar la lógica de autenticación sin mezclar HTTP y persistencia.

### Paso 2 · Recuperar el hash solo cuando hace falta

Como `passwordHash` tiene `select: false`, una búsqueda normal no lo carga. Agrega un método específico en `UsersService`:

```ts
async findByEmailWithPassword(email: string): Promise<User | null> {
  return this.usersRepository
    .createQueryBuilder('user')
    .addSelect('user.passwordHash')
    .where('user.email = :email', { email })
    .getOne();
}
```

El parámetro `:email` evita concatenar texto de entrada en SQL. El nombre del método expresa que es excepcional: solo el flujo de autenticación necesita el hash. No reutilices este método para listados ni perfiles.

### Paso 3 · Comparar, no descifrar

Completa `AuthService`:

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const passwordMatches = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;

    if (!passwordMatches || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
```

Aunque el usuario no exista, el resultado público es el mismo. La variable `passwordMatches` deja claro que `bcrypt.compare` devuelve una decisión booleana; no devuelve ni recupera una contraseña.

### Paso 4 · Exponer la ruta con estado 200

```ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

`@HttpCode(HttpStatus.OK)` evita que un `POST` exitoso use el valor predeterminado `201`. En este caso no estamos creando un recurso nuevo: estamos validando una operación de acceso.

## Práctica guiada · 40 min

Trabaja con una cuenta de prueba creada durante la sesión anterior y llena esta matriz antes de ejecutar las peticiones:

| Caso | Cuerpo | Resultado esperado | ¿Debe revelar si existe el correo? |
| --- | --- | --- | --- |
| Correcto | correo registrado + contraseña correcta | `200` y usuario seguro | No es necesario. |
| Contraseña incorrecta | correo registrado + otra contraseña | `401` | No. |
| Correo inexistente | correo válido no registrado | `401` con el mismo mensaje | No. |
| Correo mal formado | `ana-at-example.com` | `400` | No llega al servicio. |
| Contraseña corta | siete caracteres | `400` | No llega al servicio. |

1. Implementa el DTO y la ruta `POST /auth/login`.
2. Comprueba con el depurador o una prueba temporal que la consulta de login sí carga el hash. Elimínala antes de compartir código o evidencias.
3. Ejecuta los cinco casos de la tabla.
4. Compara los dos cuerpos de respuesta `401`: deben ser equivalentes para correo inexistente y contraseña incorrecta.
5. Revisa que la respuesta `200` no incluya `password`, `passwordHash` ni el objeto entidad completo.

Petición correcta:

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "ana@example.com",
  "password": "aprendo-nest-2026"
}
```

**Criterio de éxito:** el login compara contra el hash únicamente dentro del servicio de autenticación, distingue errores de formato (`400`) de credenciales no válidas (`401`) y no filtra información sensible en ninguna respuesta.

## Diagnóstico de problemas frecuentes

| Síntoma | Causa probable | Corrección |
| --- | --- | --- |
| Toda contraseña correcta falla | Se hizo `bcrypt.hash` de nuevo o el hash no se seleccionó. | Usa `bcrypt.compare` y revisa `addSelect('user.passwordHash')`. |
| `passwordHash` es `undefined` | `select: false` funciona y la consulta usada es una búsqueda normal. | Usa solo `findByEmailWithPassword` en el flujo de login. |
| Se responde `404` para correo inexistente | El servicio reutiliza `findOne` que lanza error de recurso. | Para login, convierte ambos fallos en `UnauthorizedException`. |
| Login correcto responde `201` | Falta `@HttpCode(HttpStatus.OK)`. | Añade el decorador en el controlador. |
| El controlador contiene `bcrypt.compare` | La lógica de negocio se mezcló con HTTP. | Mueve la comparación a `AuthService`. |

## Actividad autónoma · 10 min

Revisa un mensaje de error de tu implementación desde el punto de vista de alguien que intenta averiguar si una cuenta existe. Cambia solo lo necesario para que los dos fallos de credenciales tengan el mismo código y mensaje. Anota por qué eso no impide que los errores de DTO sigan siendo claros.

## Cierre · 10 min

Responde estas tres preguntas:

1. ¿Por qué una contraseña no se descifra durante el login?
2. ¿Por qué `bcrypt.compare` necesita tanto la contraseña recibida como el hash persistido?
3. ¿Por qué `401` es más apropiado que `404` cuando las credenciales no permiten autenticar?

## Tarea opcional

Agrega un campo `lastLoginAt` que se actualice solo después de un login correcto. Indica qué columna usarías, por qué el servidor debe escribirla y por qué no debe actualizarse cuando el login falla. No expongas este cambio como requisito de la siguiente semana.
