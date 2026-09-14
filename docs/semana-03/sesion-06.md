---
sidebar_position: 3
---

# Sesión 6 · Completar el CRUD en memoria

**Duración:** 2 horas.  
**Meta:** actualizar parcialmente y eliminar cursos conservando respuestas y errores HTTP coherentes.

[Abrir presentación navegable de la Sesión 6](/diapositivas/semana-03-sesion-06)

## Introducción · 10 min

Crear no completa el ciclo de vida de un recurso. Hoy terminamos el contrato temporal de cursos y comprobamos que todas las operaciones compartan una misma búsqueda y manejo de ausencia.

## Marco conceptual · 24 min (20%)

Material oficial: [métodos de ruta](https://docs.nestjs.com/controllers#routing), [mapped types](https://docs.nestjs.com/openapi/mapped-types) y [excepciones](https://docs.nestjs.com/exception-filters).

### Diapositiva 1 · Operaciones de una colección

| Acción | Método y ruta | Resultado esperado |
| --- | --- | --- |
| Consultar | `GET /courses/:id` | 200 o 404 |
| Crear | `POST /courses` | 201 o 400 |
| Actualizar parte | `PATCH /courses/:id` | 200, 400 o 404 |
| Eliminar | `DELETE /courses/:id` | 200 o 404 |

### Diapositiva 2 · PATCH no reemplaza todo

Una actualización parcial acepta únicamente los campos que cambian. `PartialType(CreateCourseDto)` mantiene las mismas reglas, pero vuelve opcionales sus propiedades.

### Diapositiva 3 · Una búsqueda, una decisión

El servicio ya sabe cómo encontrar un curso y cuándo lanzar 404. `update` y `remove` deben reutilizar `findOne` en vez de repetir una respuesta diferente.

## Desarrollo · ejemplo guiado · 36 min (30%)

### `src/courses/dto/update-course.dto.ts`

```ts
import { PartialType } from '@nestjs/mapped-types'; // 1
import { CreateCourseDto } from './create-course.dto'; // 2

export class UpdateCourseDto extends PartialType(CreateCourseDto) {} // 3
```

1. Importa el ayudante de tipos mapeados.
2. Reutiliza el contrato de creación.
3. Conserva reglas y hace opcionales `title` y `level`.

### `src/courses/courses.service.ts`

```ts
update(id: string, updateCourseDto: UpdateCourseDto): Course {
  const course = this.findOne(id); // 1
  Object.assign(course, updateCourseDto); // 2
  return course; // 3
}

remove(id: string): Course {
  const course = this.findOne(id); // 4
  const index = this.courses.indexOf(course); // 5
  this.courses.splice(index, 1); // 6
  return course; // 7
}
```

1 y 4. Reutiliza la búsqueda que puede responder 404.
2. Aplica solo las propiedades recibidas y validadas.
3. Devuelve el recurso actualizado.
5–6. Localiza y retira el mismo objeto del arreglo.
7. Devuelve evidencia útil de lo que se eliminó.

### `src/courses/courses.controller.ts`

```ts
@Patch(':id')
update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  return this.coursesService.update(id, updateCourseDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.coursesService.remove(id);
}
```

Importa `Patch`, `Delete` y `UpdateCourseDto`. Prueba `PATCH /courses/1` con `{ "level": "advanced" }`, después `DELETE /courses/1`; una segunda eliminación debe responder 404.

## Cierre · 10 min

Recorre el CRUD desde el cliente. ¿Dónde se valida el cuerpo? ¿Qué método decide el 404? ¿Por qué `PATCH` no usa el DTO de creación directamente?

## Proyecto integrador · 60 min (50%)

1. Instala `@nestjs/mapped-types` si aún no forma parte de tu proyecto.
2. Crea `UpdateCourseDto` con `PartialType`.
3. Implementa y verifica `PATCH /courses/:id` y `DELETE /courses/:id`.
4. Prueba un cambio válido, un cuerpo inválido y una operación sobre un id inexistente.
5. Actualiza el `README` con la tabla de endpoints y publica el commit.

**Criterio de salida:** CourseHub API ofrece CRUD completo en memoria, valida sus entradas y devuelve 400 o 404 cuando corresponde.
