---
sidebar_position: 1
---

# Semana 2 · REST, routing y CRUD en memoria

## Resultado de aprendizaje

Al finalizar la semana podrás diseñar rutas HTTP para CourseHub API, recibir parámetros de ruta, parámetros de consulta y cuerpos de petición, y construir un CRUD básico de cursos usando almacenamiento temporal en memoria.

## Entregable semanal

El repositorio público `coursehub-api` incorporará un recurso `courses` con operaciones de lectura y escritura. Al finalizar la semana deberá ser posible listar cursos, consultar uno por identificador, filtrar el listado mediante query params, crear cursos, modificarlos y eliminarlos.

## Límites de esta semana

- Sí: rutas REST, `GET`, `POST`, `PATCH`, `DELETE`, `@Param()`, `@Query()`, `@Body()` y CRUD en memoria.
- Sí: separación entre `CoursesController` y `CoursesService`.
- No todavía: DTOs, Pipes, validación, excepciones HTTP personalizadas, persistencia, ORM o base de datos.
- Los datos se perderán al reiniciar la aplicación; esto es intencional para concentrarnos en HTTP y routing.
