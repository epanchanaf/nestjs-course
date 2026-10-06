---
sidebar_position: 4
---

# Proyecto práctico · Semana 6

## CourseHub API consultable

**Duración sugerida:** 4 horas (dos sesiones)  
**Modalidad:** individual o en parejas  
**Base:** CourseHub API persistente de la Semana 5

## Situación

El sistema ya conserva cursos, estudiantes y matrículas, pero sus listados devuelven todos los datos o solo admiten filtros elementales. El equipo académico necesita encontrar información y recorrer resultados sin descargar la base completa.

## Alcance obligatorio

### 1. Listado paginado de cursos

Implementa `GET /courses` con los parámetros opcionales `level`, `page`, `limit`, `sortBy` y `order`.

- `page` inicia en 1.
- `limit` admite de 1 a 50.
- `sortBy` solo permite `id`, `title` o `level`.
- `order` solo permite `ASC` o `DESC`.
- La respuesta siempre tiene `items` y `meta` con `total`, `page`, `limit` y `totalPages`.

### 2. Consulta de matrículas relacionadas

Extiende `GET /enrollments` para aceptar `search`, `studentId`, `courseId`, `activeOnly`, `page` y `limit`. La búsqueda debe coincidir sin distinguir mayúsculas en el nombre del estudiante o título del curso. La respuesta debe incluir los datos relacionados necesarios para identificar estudiante y curso.

### 3. Validación y seguridad

Usa DTOs para todos los parámetros. Una página, límite, id, campo de ordenamiento u orden inválidos debe responder `400`. La búsqueda debe usar parámetros del `QueryBuilder`; no se permite interpolar directamente texto introducido por el cliente en SQL.

### 4. Calidad del contrato

Mantén las rutas y las reglas de creación ya existentes. Una colección vacía por filtro o búsqueda responde `200` con `items: []`; no es un recurso inexistente. Documenta al menos cuatro ejemplos de URL en el README.

## Demostración requerida

1. Crea suficientes cursos para mostrar dos páginas de resultados.
2. Solicita dos páginas consecutivas, con el mismo ordenamiento, y demuestra que no se repiten elementos.
3. Filtra cursos por nivel y comprueba los metadatos.
4. Busca matrículas por una parte del nombre de estudiante o título de curso.
5. Combina búsqueda, estudiante activo y paginación.
6. Muestra una petición inválida que responda `400`.
7. Muestra una búsqueda que no encuentre resultados y responda correctamente con colección vacía.

## Criterios de éxito

| Criterio | Evidencia |
| --- | --- |
| Paginación | `skip`/`take` o equivalente produce páginas estables. |
| Ordenamiento seguro | Solo se usan campos y direcciones permitidos. |
| Consulta relacionada | `QueryBuilder` carga y filtra estudiante y curso. |
| Parámetros seguros | La búsqueda usa `:search` y valores asociados. |
| Contrato claro | Respuestas con `items`, `meta` y errores de validación coherentes. |

## Entregables

- Código fuente actualizado.
- DTOs de consulta y README con parámetros, valores por defecto y ejemplos.
- Colección HTTP, Postman o evidencia equivalente de la demostración requerida.

## Extensión opcional

Agrega un filtro por intervalo de fechas de creación de matrículas, validando formato ISO (`YYYY-MM-DD`) y documentando si los extremos son inclusivos.
