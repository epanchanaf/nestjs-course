---
sidebar_position: 4
---

# CourseHub API · Entrega de Semana 2

La segunda semana convierte CourseHub API en una API REST básica. El recurso `courses` tendrá operaciones CRUD, pero los datos seguirán almacenados únicamente en memoria.

## Alcance al final de Semana 2

| Debe existir | Se pospone |
| --- | --- |
| `CoursesModule` | DTOs de NestJS |
| `CoursesController` | Pipes y transformación automática |
| `CoursesService` | Validación |
| `GET /courses` | Excepciones HTTP personalizadas |
| `GET /courses/:id` | Base de datos y ORM |
| Filtro `?level=...` | Autenticación |
| `POST /courses` | Persistencia real |
| `PATCH /courses/:id` |  |
| `DELETE /courses/:id` |  |

## Contrato mínimo de Course

Durante esta semana trabajaremos con una forma sencilla:

```ts
type Course = {
  id: number;
  title: string;
  level: string;
};
```

No conviertas todavía este tipo en DTO, entidad de base de datos ni esquema de validación.

## Flujo de comprobación

1. Ejecuta `npm run start:dev`.
2. Consulta `GET /courses`.
3. Crea un curso con `POST /courses`.
4. Comprueba que aparece en `GET /courses`.
5. Modifica uno de sus campos con `PATCH /courses/:id`.
6. Consulta el curso modificado.
7. Elimínalo con `DELETE /courses/:id`.
8. Comprueba que ya no aparece en la colección.
9. Reinicia la aplicación y observa que los datos vuelven al estado inicial.

## Lista de comprobación

- [ ] El repositorio público `coursehub-api` contiene el trabajo de las cuatro primeras sesiones.
- [ ] Existe una separación clara entre controlador y servicio.
- [ ] `GET /courses` lista la colección.
- [ ] `GET /courses/:id` busca por identificador.
- [ ] `GET /courses?level=...` filtra por nivel.
- [ ] `POST /courses` agrega un curso.
- [ ] `PATCH /courses/:id` modifica parcialmente un curso.
- [ ] `DELETE /courses/:id` elimina un curso.
- [ ] El `README` documenta las rutas disponibles.
- [ ] No se han adelantado DTOs, validación, excepciones ni persistencia.

El propósito de esta entrega es dominar el flujo HTTP y el routing de NestJS antes de introducir mecanismos de transformación, validación y manejo formal de errores.
