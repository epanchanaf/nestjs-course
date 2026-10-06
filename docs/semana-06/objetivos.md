---
sidebar_position: 1
---

# Semana 6 · Consultas de datos

## Resultado de aprendizaje

Al finalizar la semana podrás diseñar consultas útiles y seguras para una API NestJS: filtrar, buscar, paginar y ordenar recursos persistentes usando repositorios de TypeORM y `QueryBuilder` cuando la consulta necesite composición.

## Entregable semanal

CourseHub API expondrá `GET /courses` y `GET /students` con filtros combinables, búsqueda textual, paginación y ordenamiento controlado. Las respuestas incluirán metadatos para que un cliente sepa cuántos resultados existen y cómo solicitar la siguiente página.

## Límites de esta semana

- Sí: parámetros de consulta validados, filtros opcionales, `ILIKE`, `skip`/`take`, ordenamiento por lista permitida, respuesta paginada y `QueryBuilder`.
- No todavía: autenticación, permisos por rol, caché, Elasticsearch, optimización avanzada de índices ni una interfaz web.

## Ruta de trabajo

1. **Sesión 11:** convertir parámetros de consulta en una consulta paginada, predecible y validada para cursos.
2. **Sesión 12:** buscar y combinar filtros en recursos relacionados con `QueryBuilder`, sin construir SQL a partir de texto no confiable.

La semana parte de cursos, estudiantes y matrículas persistentes de la Semana 5. No cambia el modelo ni sus reglas; mejora la forma de recuperar datos.
