---
sidebar_position: 3
---

# Sesión 6 · Completar el CRUD en memoria

**Duración:** 2 horas.  
**Meta:** actualizar parcialmente y eliminar cursos conservando respuestas y errores HTTP coherentes.

[Abrir presentación navegable de la Sesión 6](/diapositivas/semana-03-sesion-06)

## Antes de empezar

Esta sesión parte de un `POST /courses` validado con `CreateCourseDto`. Ten a mano un curso existente, por ejemplo el id `1`, porque actualizar y eliminar necesitan un recurso sobre el cual actuar. También debes conocer la diferencia entre parámetro de ruta (`:id`) y cuerpo de petición (`@Body()`).

## Introducción · 10 min

Crear no completa el ciclo de vida de un recurso. Hoy terminamos el contrato temporal de cursos y comprobamos que todas las operaciones compartan una misma búsqueda y manejo de ausencia.

No todas las acciones de una API significan lo mismo. Cambiar el nivel de un curso es diferente de reemplazar todos sus datos; borrar un curso es diferente de pedirlo. Elegir correctamente el método HTTP ayuda a cualquier persona que use la API a predecir cómo funciona.

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

### Qué significa cada operación en CourseHub API

| Petición | Intención | Body | Qué no debe ocurrir |
| --- | --- | --- | --- |
| `PATCH /courses/1` | Cambiar solo campos enviados | Parcial | Borrar campos que no fueron enviados. |
| `DELETE /courses/1` | Retirar un curso existente | No requiere | Inventar un éxito si el curso no existe. |
| `GET /courses/1` | Consultar un curso | No requiere | Modificar el curso durante la lectura. |

Un id viene de la URL y llega como texto. Por eso `findOne` lo convierte con `Number(id)` antes de compararlo con los ids numéricos del arreglo.

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

### Recorrido detallado de `PATCH /courses/1`

Para esta petición:

```http
PATCH http://localhost:3000/courses/1
Content-Type: application/json

{ "level": "advanced" }
```

1. Nest asocia la URL con `@Patch(':id')` y extrae `id` como el texto `"1"`.
2. Valida el JSON con `UpdateCourseDto`. Como usa `PartialType`, `title` puede omitirse; `level` aún debe estar permitido.
3. El controlador delega ambos valores al servicio.
4. `findOne` localiza el curso o arroja `NotFoundException`.
5. `Object.assign` cambia únicamente `level`; `title` permanece igual.
6. Nest devuelve el objeto resultante con estado `200`.

La misma secuencia con `id` `999` se detiene en el paso 4 y termina con `404`. Con `level: "expert"` se detiene antes del paso 3 con `400`.

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

### Lista de pruebas manuales

Ejecuta las pruebas en este orden. Cada una confirma una regla distinta.

1. `GET /courses/1`: anota el valor original de `title` y `level`.
2. `PATCH /courses/1` con `{ "level": "advanced" }`: comprueba que el título no cambió.
3. `PATCH /courses/1` con `{ "level": "expert" }`: comprueba el `400` y confirma que el curso conserva el nivel anterior.
4. `PATCH /courses/999` con un body válido: comprueba el `404`.
5. `DELETE /courses/1`: conserva la respuesta recibida.
6. `GET /courses/1` y un segundo `DELETE /courses/1`: ambos deben responder `404`.

### Errores frecuentes

- **`PartialType` no se encuentra:** instala `@nestjs/mapped-types` y verifica la ruta del import.
- **Una actualización borra valores:** no asignes un objeto nuevo que contenga propiedades `undefined`; usa el DTO parcial con `Object.assign` sobre la entidad encontrada.
- **DELETE responde 200 siempre:** asegúrate de llamar primero a `findOne`; no uses solo el índice sin comprobar si existe.
- **El cambio desaparece al reiniciar:** es el comportamiento esperado en esta semana. Todavía usamos un arreglo en memoria.

## Cierre · 10 min

Recorre el CRUD desde el cliente. ¿Dónde se valida el cuerpo? ¿Qué método decide el 404? ¿Por qué `PATCH` no usa el DTO de creación directamente?

## Proyecto integrador · 60 min (50%)

1. Instala `@nestjs/mapped-types` si aún no forma parte de tu proyecto.
2. Crea `UpdateCourseDto` con `PartialType`.
3. Implementa y verifica `PATCH /courses/:id` y `DELETE /courses/:id`.
4. Prueba un cambio válido, un cuerpo inválido y una operación sobre un id inexistente.
5. Actualiza el `README` con la tabla de endpoints y publica el commit.

**Criterio de salida:** CourseHub API ofrece CRUD completo en memoria, valida sus entradas y devuelve 400 o 404 cuando corresponde.

## Tarea opcional

Implementa una respuesta `204 No Content` para `DELETE /courses/:id`. Investiga el decorador `@HttpCode(204)`, decide si conservarías o no el curso eliminado en la respuesta y documenta la decisión. Lo importante no es una única respuesta “correcta”, sino que contrato y comportamiento coincidan.
