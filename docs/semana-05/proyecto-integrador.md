---
sidebar_position: 4
---

# Proyecto práctico · Semana 5

## CourseHub API persistente: estudiantes y matrículas

**Duración sugerida:** 4 horas (dos sesiones)

**Modalidad:** Individual o en parejas
**Base:** La API CourseHub desarrollada hasta la Semana 4

## Situación

La API ya guarda cursos en PostgreSQL, pero los módulos de estudiantes y matrículas aún se pierden al reiniciar. La institución necesita una primera versión persistente de CourseHub API para conservar sus inscripciones y consultar qué estudiantes pertenecen a cada curso.

Tu objetivo es extender el proyecto existente, sin rediseñar sus rutas públicas, para que los tres módulos trabajen contra la misma base de datos.

```text
Course 1 ──── * Enrollment * ──── 1 Student
```

## Alcance obligatorio

### 1. Persistencia del módulo de estudiantes

Crea la entidad `Student` y reemplaza el arreglo temporal del módulo por `Repository<Student>`. La entidad debe conservar estos datos:

- `id`
- `name`
- `email`
- `age`
- `career`
- `semester`
- `isActive`

Los endpoints existentes de estudiantes deben continuar permitiendo crear, consultar, filtrar, modificar y eliminar según las reglas ya trabajadas.

### 2. Integridad del correo

El correo debe ser único tanto en la lógica del servicio como en la base de datos. Si alguien intenta crear o actualizar un estudiante usando el correo de otro, la API debe devolver `409 Conflict` y un mensaje comprensible.

### 3. Persistencia del módulo de matrículas

Crea la entidad `Enrollment`, con un identificador propio y relaciones obligatorias hacia `Student` y `Course`. Registra una restricción única para que una pareja estudiante–curso no pueda aparecer dos veces.

No guardes `studentId` y `courseId` como números sin relación. La tabla debe tener claves foráneas generadas por las relaciones de TypeORM.

### 4. Reglas de matrícula

Al crear una matrícula, el servicio debe comprobar que:

1. El estudiante existe.
2. El curso existe.
3. El estudiante está activo.
4. No existe ya una matrícula para la misma pareja estudiante–curso.

Selecciona y documenta códigos HTTP coherentes para estas situaciones. Como referencia: recurso inexistente `404`, duplicado `409` y estudiante inactivo `400`.

### 5. Consultas y cancelación

Conserva o implementa las siguientes operaciones:

| Operación | Resultado mínimo |
| --- | --- |
| `POST /enrollments` | Crea una matrícula con `studentId` y `courseId` validados. |
| `GET /enrollments` | Lista matrículas, con filtros opcionales combinables `studentId` y `courseId`. |
| `GET /students/:studentId/enrollments` | Lista las matrículas de un estudiante. |
| `GET /courses/:courseId/enrollments` | Lista las matrículas de un curso. |
| `DELETE /enrollments/:id` | Cancela una matrícula existente y responde `404` si no existe. |

Las consultas de matrículas deben cargar y devolver información útil de `student` y `course`. No expongas campos sensibles si agregas alguno fuera de este enunciado.

## Restricciones de implementación

- Usa la conexión PostgreSQL configurada en la Semana 4 y no publiques `.env`.
- Registra las entidades en la conexión y usa `TypeOrmModule.forFeature` dentro de cada módulo.
- Mantén los controllers delgados: rutas, parámetros y DTOs; las reglas viven en los servicios.
- Conserva DTOs, `ValidationPipe` y Pipes para validar cuerpos, parámetros de ruta y filtros.
- No uses `synchronize: true` como estrategia de producción; en esta práctica se permite únicamente para desarrollo local.
- No incorpores autenticación, interfaz gráfica ni migraciones de producción: no son parte de esta entrega.

## Demostración requerida

Presenta una secuencia breve y reproducible:

1. Crear un curso y un estudiante activo.
2. Crear una matrícula válida.
3. Reiniciar la API y consultar la misma matrícula.
4. Intentar una matrícula duplicada y mostrar el `409`.
5. Intentar matricular un estudiante inactivo y mostrar el error correspondiente.
6. Filtrar las matrículas por estudiante o curso.
7. Cancelar la matrícula y comprobar que ya no se encuentra.

## Criterios de éxito

| Criterio | Evidencia |
| --- | --- |
| Persistencia de estudiantes | Un estudiante creado sigue disponible después del reinicio. |
| Correo único | La API y PostgreSQL impiden repetirlo. |
| Relaciones correctas | `enrollments` posee referencias válidas a `students` y `courses`. |
| Reglas de negocio | No se matricula un estudiante inexistente, inactivo ni duplicado. |
| Contrato HTTP | DTOs y respuestas `400`, `404` y `409` son coherentes. |
| Calidad técnica | No quedan arreglos temporales ni credenciales en el repositorio. |

## Entregables

- Código fuente actualizado y un commit descriptivo.
- `.env.example` actualizado sin valores reales.
- README con requisitos de PostgreSQL, variables necesarias y tabla de endpoints.
- Colección de pruebas o evidencia equivalente con los siete casos de la demostración.

## Extensión opcional

Agrega `createdAt` a las matrículas y permite ordenar el listado por fecha. Documenta por qué ese instante se genera en el servidor y no se acepta como un valor libre del cliente.
