---
sidebar_position: 1
---

# Semana 3 · DTOs, validación y errores HTTP

## Resultado de aprendizaje

Al finalizar la semana podrás construir operaciones de escritura para CourseHub API, definir contratos con DTOs y rechazar entradas inválidas con respuestas HTTP comprensibles.

## Entregable semanal

La API aceptará `POST /courses`, `PATCH /courses/:id` y `DELETE /courses/:id` sobre la colección temporal. Las solicitudes de creación y actualización usarán DTOs validados globalmente.

## Límites de esta semana

- Sí: CRUD en memoria, `@Body()`, DTOs, `ValidationPipe`, errores 400 y 404.
- No todavía: guardar datos después de reiniciar, usuarios, autenticación o permisos.
