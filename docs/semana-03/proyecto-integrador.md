---
sidebar_position: 4
---

# CourseHub API · Entrega de Semana 3

## Alcance al final de Semana 3

| Debe existir | Se pospone |
| --- | --- |
| CRUD de `/courses` en memoria | Conservar datos al reiniciar |
| `CreateCourseDto` y `UpdateCourseDto` | Usuarios y autenticación |
| `ValidationPipe` global | Relaciones entre entidades |
| Respuestas 400 y 404 comprobables | Base de datos y repositorios |

## Lista de comprobación

- [ ] `POST`, `PATCH` y `DELETE` funcionan sobre `/courses`.
- [ ] El cuerpo inválido recibe 400 con información útil.
- [ ] Un id inexistente recibe 404 en lectura, edición y eliminación.
- [ ] No entran propiedades no declaradas por el DTO.
- [ ] El README registra ejemplos de los endpoints.

Reiniciar el servidor borra los cambios: esa limitación será el punto de partida de la próxima semana.
