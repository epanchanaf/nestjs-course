---
sidebar_position: 4
---

# CourseHub API · Proyecto transversal

CourseHub API será la API de referencia del curso. El proyecto se construye por incrementos: cada entrega debe ser pública, ejecutable y coherente con el contenido de la semana.

## Repositorio obligatorio

- Plataforma: GitHub.
- Visibilidad: **pública**.
- Nombre exacto: **`coursehub-api`**.
- Contenido: todo el código realizado durante el curso, con historial de commits comprensible.

## Alcance al final de Semana 1

| Debe existir | Se pospone |
| --- | --- |
| Aplicación creada con Nest CLI | CRUD completo |
| `GET /` con mensaje de estado | DTOs y validaciones |
| `GET /welcome` con mensaje JSON | Base de datos y persistencia |
| Módulo raíz que registra controladores y servicios | Entidades, repositorios y autenticación |

## Lista de comprobación

- [ ] El repositorio `coursehub-api` es público y tiene el código de NestJS.
- [ ] `npm install` completa correctamente.
- [ ] `npm run start:dev` levanta el servidor.
- [ ] La raíz y `/welcome` responden como se acordó.
- [ ] El `README` explica cómo ejecutar el proyecto.

El objetivo no es anticipar funcionalidades, sino dominar la estructura que hará sostenible el proyecto cuando avance el curso.
