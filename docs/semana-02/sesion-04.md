---
sidebar_position: 3
---

# Sesión 4 · POST, PATCH, DELETE y CRUD en memoria

**Duración:** 2 horas.  
**Meta:** completar las operaciones CRUD del recurso `courses` recibiendo datos desde el cuerpo de la petición.

[Abrir presentación navegable de la Sesión 4](/diapositivas/semana-02-sesion-04)

La presentación cubre los tres bloques de esta sesión: introducción y marco conceptual, ejemplo guiado y propuesta del proyecto integrador. Usa ←/→ o Espacio para avanzar; `P` muestra las notas para quien expone.

## Introducción · 10 min

En la sesión anterior el cliente solo podía leer información. Hoy añadiremos operaciones que modifican el estado temporal de CourseHub API.

Pregunta de arranque: ¿qué método HTTP usarías para crear un curso, modificar solo su título y eliminarlo?

## Marco conceptual · 24 min (20%)

Material oficial: [controllers](https://docs.nestjs.com/controllers).

### Diapositiva 1 · CRUD y métodos HTTP

| Operación | Método | Ruta |
| --- | --- | --- |
| Crear | `POST` | `/courses` |
| Listar | `GET` | `/courses` |
| Consultar | `GET` | `/courses/:id` |
| Modificar parcialmente | `PATCH` | `/courses/:id` |
| Eliminar | `DELETE` | `/courses/:id` |

### Diapositiva 2 · El cuerpo de la petición

```ts
@Post()
create(@Body() body: { title: string; level: string }) {
  return this.coursesService.create(body);
}
```

`@Body()` entrega al controlador el JSON enviado por el cliente.

Ejemplo:

```json
{
  "title": "Testing NestJS",
  "level": "intermediate"
}
```

### Diapositiva 3 · PATCH modifica parcialmente

```json
{
  "title": "Testing APIs with NestJS"
}
```

No es necesario reenviar todos los campos si la intención es modificar solo una parte del recurso.

### Diapositiva 4 · Persistencia temporal

```text
Petición HTTP → Controller → Service → Array en memoria
```

El array nos permite practicar el ciclo CRUD completo. Al reiniciar el servidor volverá a su estado inicial.

## Desarrollo · ejemplo guiado · 36 min (30%)

Amplía el servicio de la sesión anterior.

### `src/courses/courses.service.ts`

```ts
import { Injectable } from '@nestjs/common';

type Course = {
  id: number;
  title: string;
  level: string;
};

type CreateCourseInput = {
  title: string;
  level: string;
};

type UpdateCourseInput = {
  title?: string;
  level?: string;
};

@Injectable()
export class CoursesService {
  private courses: Course[] = [
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

  create(input: CreateCourseInput): Course {
    const course: Course = {
      id: Math.max(0, ...this.courses.map((item) => item.id)) + 1,
      title: input.title,
      level: input.level,
    };

    this.courses.push(course);
    return course;
  }

  update(id: number, input: UpdateCourseInput): Course | undefined {
    const course = this.findOne(id);

    if (!course) {
      return undefined;
    }

    Object.assign(course, input);
    return course;
  }

  remove(id: number): Course | undefined {
    const index = this.courses.findIndex((course) => course.id === id);

    if (index === -1) {
      return undefined;
    }

    const [removedCourse] = this.courses.splice(index, 1);
    return removedCourse;
  }
}
```

Los tipos `CreateCourseInput` y `UpdateCourseInput` son tipos TypeScript locales para explicar la forma de los datos. **No son DTOs de NestJS** y no realizan validación.

### `src/courses/courses.controller.ts`

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

  @Post()
  create(@Body() body: { title: string; level: string }) {
    return this.coursesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; level?: string },
  ) {
    return this.coursesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(Number(id));
  }
}
```

Prueba el flujo completo en este orden:

```text
GET    /courses
POST   /courses
GET    /courses
PATCH  /courses/4
GET    /courses/4
DELETE /courses/4
GET    /courses
```

Ejemplo de creación:

```json
{
  "title": "Testing NestJS",
  "level": "intermediate"
}
```

Ejemplo de actualización parcial:

```json
{
  "title": "Testing APIs with NestJS"
}
```

## Cierre · 10 min

Responde sin mirar el código:

- ¿Qué diferencia práctica existe entre `POST` y `PATCH`?
- ¿Qué decorador lee el JSON de una petición?
- ¿Por qué `remove()` pertenece al servicio y no al controlador?
- ¿Qué ocurre con los cursos creados si reinicias la aplicación?

## Proyecto integrador · 60 min (50%)

En tu repositorio `coursehub-api`:

1. Conserva las rutas de lectura de la Sesión 3.
2. Implementa `POST /courses`.
3. Implementa `PATCH /courses/:id`.
4. Implementa `DELETE /courses/:id`.
5. Ejecuta un ciclo completo: crear → consultar → modificar → eliminar.
6. Documenta en el `README` los endpoints disponibles.
7. Haz commit y push, por ejemplo: `feat: complete in-memory courses CRUD`.

**Criterio de salida:** el recurso `courses` soporta CRUD completo en memoria y el controlador delega la manipulación de datos al servicio. No agregues todavía DTOs, Pipes, validación, excepciones, ORM ni base de datos.
