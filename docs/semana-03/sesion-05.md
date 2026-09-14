---
sidebar_position: 2
---

# Sesión 5 · Crear cursos con DTOs

**Duración:** 2 horas.  
**Meta:** recibir el cuerpo de una petición `POST` mediante un contrato de creación y validar sus datos.

[Abrir presentación navegable de la Sesión 5](/diapositivas/semana-03-sesion-05)

## Introducción · 10 min

Una API de lectura muestra datos; una API útil también recibe información. Antes de añadirla al arreglo, debemos decidir qué forma tiene una solicitud válida.

## Marco conceptual · 24 min (20%)

Material oficial: [DTOs](https://docs.nestjs.com/controllers#request-payloads), [validación](https://docs.nestjs.com/techniques/validation) y [pipes](https://docs.nestjs.com/pipes).

### Diapositiva 1 · Contrato de entrada

Un DTO (Data Transfer Object) describe los datos que cruzan el límite HTTP. `CreateCourseDto` no es una entidad ni una tabla: es el contrato para crear un curso.

### Diapositiva 2 · Validar cerca del borde

```text
cliente → JSON → ValidationPipe → controller → service
```

La tubería bloquea solicitudes mal formadas antes de que la lógica de negocio las procese.

### Diapositiva 3 · Semántica HTTP

Una creación correcta responde `201 Created`. Una solicitud que incumple el contrato responde `400 Bad Request` y explica qué campo falló.

## Desarrollo · ejemplo guiado · 36 min (30%)

Instala las dependencias una sola vez:

```bash
npm install class-validator class-transformer
```

### `src/courses/dto/create-course.dto.ts`

```ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator'; // 1

export class CreateCourseDto { // 2
  @IsString() // 3
  @IsNotEmpty() // 4
  title: string;

  @IsIn(['beginner', 'intermediate', 'advanced']) // 5
  level: string;
}
```

1. Importa reglas declarativas de validación.
2. Declara el contrato de creación.
3–4. Exige un título de texto no vacío.
5. Limita el nivel a valores acordados.

### `src/main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`whitelist` elimina propiedades no declaradas; `forbidNonWhitelisted` las convierte en un error claro. No aceptamos campos por accidente.

### Cambios en controlador y servicio

```ts
// courses.controller.ts
@Post()
create(@Body() createCourseDto: CreateCourseDto) {
  return this.coursesService.create(createCourseDto);
}

// courses.service.ts
create(createCourseDto: CreateCourseDto): Course {
  const course = { id: this.nextId++, ...createCourseDto };
  this.courses.push(course);
  return course;
}
```

Importa `Body` y `Post` en el controlador, y `CreateCourseDto` en ambos archivos. Declara `private nextId = 3;` acorde con los cursos iniciales. Prueba un cuerpo válido y otro sin `title`.

## Cierre · 10 min

¿Por qué validar solo en el navegador no protege la API? Distingue el tipo TypeScript del DTO: ¿cuál sigue aplicándose cuando llega una petición real?

## Proyecto integrador · 60 min (50%)

1. Instala las librerías de validación y activa la tubería global.
2. Crea `CreateCourseDto` con `title` y `level` validados.
3. Implementa `POST /courses` en controlador y servicio.
4. Prueba un `201` válido y dos `400` (título vacío y nivel no permitido).
5. Documenta los tres casos en el `README`, haz commit y push.

**Criterio de salida:** `POST /courses` crea un curso temporal con identificador y rechaza cuerpos inválidos antes de llegar al servicio.
