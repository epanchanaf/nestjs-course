---
sidebar_position: 2
---

# Sesión 15 · Registrar usuarios sin guardar contraseñas

**Duración:** 2 horas.  
**Meta:** crear una cuenta de usuario persistente y transformar la contraseña en un hash antes de guardarla.

[Abrir presentación navegable de la Sesión 15](/diapositivas/semana-08-sesion-15)

## Prerrequisitos y materiales

Debes tener la configuración de la Semana 7 funcionando: PostgreSQL accesible, `ConfigModule` validando el entorno y las entidades registradas mediante `autoLoadEntities` o de forma explícita. Necesitas un cliente HTTP y una base local desechable. No uses la contraseña que empleas en servicios reales para hacer esta práctica.

Ten presente una distinción importante: `Student` representa a una persona dentro del dominio académico de CourseHub; `User` representa una cuenta que puede autenticarse ante la API. En esta semana no se relacionan automáticamente. Esa decisión evita suponer que todo estudiante tiene cuenta o que toda cuenta corresponde a un estudiante.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Situación inicial | Explicar por qué una contraseña no es una columna común. |
| 10–30 | Marco conceptual | Diferenciar texto plano, cifrado y hash. |
| 30–60 | Demostración guiada | Crear `User`, DTO y registro con `bcrypt`. |
| 60–100 | Práctica guiada | Implementar, probar y revisar que no hay filtraciones. |
| 100–110 | Actividad autónoma | Probar duplicados y entradas inválidas. |
| 110–120 | Cierre | Defender el recorrido seguro de una contraseña. |

## Introducción · 10 min

Una contraseña permite demostrar que alguien conoce un secreto. Eso no significa que el servidor deba conservar el secreto. Si una tabla guarda `password = "clave123"`, una filtración de la base de datos expone de inmediato esa contraseña y puede afectar otras cuentas donde alguien la reutilizó.

El servidor debe realizar este recorrido:

```text
cliente envía contraseña por HTTPS
             ↓
DTO valida su forma
             ↓
servicio calcula hash con bcrypt
             ↓
PostgreSQL guarda solo passwordHash
             ↓
respuesta omite contraseña y hash
```

La contraseña original vive solo durante el procesamiento de la solicitud. No se registra en la consola, no se añade a un mensaje de error y no aparece en una respuesta.

## Marco conceptual · 20 min

Material oficial: [autenticación en Nest](https://docs.nestjs.com/security/authentication), [buenas prácticas de contraseñas de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) y [documentación de bcrypt](https://www.npmjs.com/package/bcrypt).

### Hash no es cifrado

| Técnica | ¿Se puede recuperar el texto original con una clave? | Uso típico |
| --- | --- | --- |
| Texto plano | No hace falta recuperar: ya está expuesto | Nunca para contraseñas. |
| Cifrado | Sí, con la clave adecuada | Datos que la aplicación necesita leer después. |
| Hash de contraseña | No; se compara calculando/verificando | Comprobación de contraseñas. |

`bcrypt` incorpora un *salt* y un costo de trabajo. Por eso el resultado cambia aunque dos personas elijan la misma contraseña. El costo hace más caro probar muchas claves por fuerza bruta. En este curso usaremos 12 rondas; no se debe reducir para "hacerlo más rápido" en un sistema real.

### Decisiones de contrato

| Decisión | Regla |
| --- | --- |
| Correo | Se limpia y pasa a minúsculas antes de guardar y buscar. |
| Contraseña | Se valida al llegar, se hashea en el servicio y no se persiste como texto. |
| Correo repetido | La base y el servicio lo rechazan; la API responde `409 Conflict`. |
| Respuesta de registro | Devuelve datos seguros del usuario, nunca el hash. |
| Entidad | La columna se llama `passwordHash`, para que sea difícil confundirla con una contraseña. |

La unicidad en la base de datos es imprescindible. La comprobación previa en el servicio hace que el error sea más comprensible, pero dos solicitudes simultáneas podrían superar esa comprobación al mismo tiempo. La restricción `unique` de PostgreSQL es la protección definitiva.

## Demostración guiada · 30 min

### Paso 1 · Instalar la dependencia y crear la estructura

Desde el proyecto NestJS de CourseHub, instala `bcrypt` y sus tipos. Después genera o crea manualmente los módulos `users` y `auth`.

```bash
npm i bcrypt
npm i -D @types/bcrypt
nest g module users
nest g service users
nest g module auth
nest g controller auth
nest g service auth
```

La separación tendrá esta responsabilidad:

| Pieza | Responsabilidad |
| --- | --- |
| `UsersModule` | Posee la entidad y el repositorio de `User`. |
| `UsersService` | Busca y crea usuarios; no conoce rutas HTTP. |
| `AuthModule` | Coordina el registro y, después, el inicio de sesión. |
| `AuthController` | Recibe `POST /auth/...`, valida DTOs y delega. |

### Paso 2 · Modelar una cuenta segura

`src/users/entities/user.entity.ts`:

```ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

`select: false` evita que una consulta normal incluya el hash por accidente. Es una barrera adicional, no una razón para devolver entidades sin pensar: la respuesta debe construirse deliberadamente con campos seguros.

`src/users/users.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

`exports` permite que `AuthModule` use el servicio sin crear un segundo repositorio ni duplicar la lógica de usuarios.

### Paso 3 · Definir qué puede llegar desde HTTP

`src/auth/dto/register.dto.ts`:

```ts
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
```

El límite de 72 caracteres responde a cómo `bcrypt` procesa la entrada. No se transforma la contraseña con `trim()` ni `toLowerCase()`: modificarla silenciosamente cambiaría el secreto que la persona eligió. La validación global debe conservar `transform: true` para aplicar la normalización del correo.

### Paso 4 · Crear usuario con hash

`src/users/users.service.ts`:

```ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const user = this.usersRepository.create({ email, passwordHash });
    return this.usersRepository.save(user);
  }
}
```

`src/auth/auth.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create(dto.email, passwordHash);

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
```

El hash se calcula dentro de `AuthService`, donde se toma la decisión de autenticación. `UsersService` recibe un hash listo para persistir; así no existe un método tentador llamado `create(email, password)` que podría guardar una contraseña por error.

### Paso 5 · Exponer el registro

`src/auth/auth.controller.ts`:

```ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
```

El registro debe responder `201 Created`. Asegúrate de que `AuthModule` importe `UsersModule`, declare controlador y servicio, y que `AppModule` importe `AuthModule`.

## Práctica guiada · 40 min

Sigue esta secuencia sin saltarte las comprobaciones intermedias:

1. Crea la entidad y ejecuta la aplicación. Confirma que aparece la tabla `users` en tu base local de desarrollo.
2. Registra `ana@example.com` con una contraseña de práctica de al menos ocho caracteres.
3. Observa la respuesta: debe incluir `id`, `email` y `createdAt`, pero no `password` ni `passwordHash`.
4. En tu cliente de PostgreSQL, verifica solo como práctica local que `password_hash` es una cadena de bcrypt que empieza normalmente por `$2`. No copies ese valor en capturas públicas.
5. Envía `ANA@EXAMPLE.COM` con otra contraseña. Debe normalizarse al mismo correo y recibir `409 Conflict`.
6. Envía un correo mal formado y una contraseña de siete caracteres. Ambos deben devolver `400 Bad Request` y no crear usuarios.

Petición válida:

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "ana@example.com",
  "password": "aprendo-nest-2026"
}
```

Respuesta mínima esperada:

```json
{
  "id": 1,
  "email": "ana@example.com",
  "createdAt": "2026-10-19T..."
}
```

**Criterio de éxito:** un registro válido persiste una cuenta segura; ningún camino de éxito o error muestra el secreto; y los DTOs, el servicio y la base de datos colaboran para impedir datos inconsistentes.

## Diagnóstico de problemas frecuentes

| Síntoma | Causa probable | Cómo comprobarlo y corregirlo |
| --- | --- | --- |
| `Nest can't resolve dependencies of AuthService` | `UsersModule` no se importó o no exporta `UsersService`. | Revisa `imports: [UsersModule]` y `exports: [UsersService]`. |
| La tabla no aparece | La entidad no está registrada en la conexión activa. | Comprueba `forFeature([User])` y la estrategia de registro de entidades de la Semana 7. |
| La respuesta contiene `passwordHash` | Se está devolviendo la entidad completa o falta `select: false`. | Devuelve explícitamente solo los campos seguros y conserva ambas barreras. |
| Se aceptan correos repetidos con mayúsculas | No se normaliza antes de guardar y buscar. | Aplica la transformación del DTO y verifica que el valor persistido esté en minúsculas. |
| `bcrypt` no tiene tipos | Falta el paquete de desarrollo. | Instala `@types/bcrypt` y reinicia el servidor de TypeScript. |

## Actividad autónoma · 10 min

Escribe una tabla de tres pruebas adicionales para tu colección HTTP: cuerpo sin `email`, cuerpo sin `password` y correo duplicado. Para cada una indica el código esperado, si debe crear una fila y por qué. Ejecuta las tres y conserva únicamente evidencia sin secretos.

## Cierre · 10 min

Explica, sin mostrar una contraseña real, por qué `passwordHash` debe estar en la base pero fuera de las respuestas. Dibuja el recorrido de una contraseña desde el cuerpo HTTP hasta PostgreSQL e identifica el único punto donde el texto original existe.

## Tarea opcional

Agrega una validación de complejidad acorde con una política explícita del curso, por ejemplo exigir letras y números. Antes de implementarla, escribe tres contraseñas aceptadas y tres rechazadas para que la regla sea verificable y no sorprenda a quien usa la API.
