---
sidebar_position: 4
---

# CourseHub API · Entrega de Semana 4

## Alcance al final de Semana 4

| Debe existir | Se pospone |
| --- | --- |
| PostgreSQL configurado por variables de entorno | Usuarios y roles |
| Entidad `Course` y repositorio TypeORM | Relaciones complejas |
| CRUD persistente de `/courses` | Migraciones de producción |
| `.env.example` sin secretos | Despliegue |

## Lista de comprobación

- [ ] `.env` está ignorado y `.env.example` documenta todas las claves.
- [ ] CourseHub API inicia cuando PostgreSQL está disponible.
- [ ] Crear, editar y eliminar modifican la tabla `courses`.
- [ ] Un reinicio mantiene los cursos creados.
- [ ] El contrato HTTP y las validaciones de la Semana 3 siguen activos.

`synchronize: true` es una ayuda de desarrollo. Antes de producción trabajaremos con migraciones y una estrategia de despliegue explícita.
