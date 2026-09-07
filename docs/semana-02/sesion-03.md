---
sidebar_position: 2
---

# Sesión 3 · Routing, parámetros y consultas

**Duración:** 2 horas.  
**Meta:** exponer rutas de lectura para el recurso `courses` usando `GET`, parámetros de ruta y parámetros de consulta.

[Abrir presentación navegable de la Sesión 3](/diapositivas/semana-02-sesion-03)

La presentación cubre los tres bloques de esta sesión: introducción y marco conceptual, ejemplo guiado y propuesta del proyecto integrador. Usa ←/→ o Espacio para avanzar; `P` muestra las notas para quien expone.

## Introducción · 10 min

Hasta ahora CourseHub API responde mensajes estáticos. Una API útil necesita representar recursos y permitir que el cliente seleccione qué información quiere consultar.

Pregunta de arranque: ¿qué diferencia existe entre pedir todos los cursos, pedir el curso 3 y pedir solo cursos de nivel beginner?

## Marco conceptual · 24 min (20%)

Material oficial: [controllers](https://docs.nestjs.com/controllers).

### Diapositiva 1 · Un recurso, varias rutas

Usaremos el recurso `courses`:

```text
GET /courses
GET /courses/2
GET /courses?level=beginner
```

Cada ruta expresa una intención distinta sin cambiar el recurso principal.

### Diapositiva 2 · Parámetro de ruta

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return this.coursesService.findOne(Number(id));
}
```

`@Param('id')` extrae el segmento dinámico de la URL. Los parámetros HTTP llegan como texto, por eso en esta etapa hacemos la conversión con `Number(id)`.

### Diapositiva 3 · Parámetro de consulta

```ts
@Get()
findAll(@Query('level') level?: string) {
  return this.coursesService.findAll(level);
}
```

`@Query('level')` lee `?level=...`. Si no existe, el servicio devuelve toda la colección.

### Diapositiva 4 · Controller y Service

```text
GET /courses?level=beginner
        │
        ▼
CoursesController
        │
        ▼
CoursesService.findAll(level)
        │
        ▼
respuesta JSON
```

El controlador interpreta la petición HTTP. El servicio decide cómo obtener o filtrar los datos.

## Desarrollo · ejemplo guiado · 36 min (30%)

Genera el recurso inicial sin CRUD automático para observar cada pieza:

```bash
nest g module courses
nest g controller courses
nest g service courses
```

### `src/courses/courses.service.ts`

```ts
import { Injectable } from '@nestjs/common';

type Course = {
  id: number;
  title: string;
  level: string;
};

@Injectable()
export class CoursesService {
  private readonly courses: Course[] = [
    { id: 1, title: 'NestJS Fundamentals', level: 'beginner' },
    { id: 2, title: 'REST APIs with NestJS', level: 'beginner' },
    { id: 3, title: 'NestJS Architecture', level: 'intermediate' },
  ];

  findAll(level?: string): Course[] {
    if (!level) {
      return this.courses;
    }

    return this.courses.filter((course) => course.level === level);
  }

  findOne(id: number): Course | undefined {
    return this.courses.find((course) => course.id === id);
  }
}
```

Puntos clave:

1. La colección vive temporalmente en memoria.
2. `findAll()` devuelve todos los cursos cuando no existe filtro.
3. Si llega `level`, usa `filter()`.
4. `findOne()` busca por identificador.
5. Aún no tratamos formalmente el caso “no encontrado”; las excepciones llegarán después.

### `src/courses/courses.controller.ts`

```ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query('level') level?: string) {
    return this.coursesService.findAll(level);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(Number(id));
  }
}
```

Prueba las siguientes peticiones:

```text
GET http://localhost:3000/courses
GET http://localhost:3000/courses/2
GET http://localhost:3000/courses?level=beginner
GET http://localhost:3000/courses?level=intermediate
```

Observa que el orden de las rutas expresa dos tipos de lectura: colección y elemento individual.

## Cierre · 10 min

Explica con tus palabras:

- ¿Cuándo usarías un parámetro de ruta?
- ¿Cuándo usarías un query param?
- ¿Por qué el filtrado permanece en el servicio?
- ¿Qué tipo recibe inicialmente `@Param('id')`?

## Proyecto integrador · 60 min (50%)

En tu repositorio público `coursehub-api`:

1. Genera `CoursesModule`, `CoursesController` y `CoursesService`.
2. Crea una colección en memoria con al menos tres cursos.
3. Implementa `GET /courses`.
4. Implementa `GET /courses/:id`.
5. Permite `GET /courses?level=...`.
6. Prueba las tres variantes con navegador, curl o un cliente HTTP.
7. Haz commit y push, por ejemplo: `feat: add course read endpoints`.

**Criterio de salida:** CourseHub API puede listar cursos, consultar uno por id y filtrar por nivel. No agregues todavía DTOs, Pipes, validación, excepciones ni persistencia.
