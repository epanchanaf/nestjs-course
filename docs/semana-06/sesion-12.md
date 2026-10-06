---
sidebar_position: 3
---

# Sesión 12 · Búsqueda y consultas relacionadas con QueryBuilder

**Duración:** 2 horas.  
**Meta:** construir una búsqueda textual y filtros combinables sobre matrículas usando `QueryBuilder`, parámetros seguros y datos relacionados.

[Abrir presentación navegable de la Sesión 12](/diapositivas/semana-06-sesion-12)

## Prerrequisitos y materiales

Completa la Sesión 11 y conserva las entidades `Course`, `Student` y `Enrollment`. Necesitas datos de prueba variados: al menos cuatro estudiantes, cuatro cursos y seis matrículas. Usa nombres y títulos que permitan probar coincidencias parciales, por ejemplo «Ana», «Anabel» y «Análisis de APIs».

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Recuperación | Distinguir una consulta simple de una compuesta. |
| 10–30 | Marco conceptual | Comprender alias, `JOIN` y parámetros. |
| 30–60 | Demostración guiada | Consulta de matrículas con `QueryBuilder`. |
| 60–100 | Práctica guiada | Combinar búsqueda, filtro y paginación. |
| 100–110 | Actividad autónoma | Diseñar un caso de prueba de seguridad. |
| 110–120 | Cierre | Defender una decisión de consulta. |

## Introducción · 10 min

`find` es excelente cuando basta con condiciones sencillas. Pero una pantalla administrativa puede pedir «matrículas del curso cuyo título contiene *nest*, de estudiantes activos, ordenadas por nombre». Esa consulta atraviesa relaciones y une condiciones opcionales. `QueryBuilder` permite expresar esa intención paso a paso sin abandonar TypeORM.

El objetivo no es memorizar SQL ni usar `QueryBuilder` para todo. Lo elegimos cuando mejora la claridad de una consulta compuesta.

## Marco conceptual · 20 min

Material oficial: [SelectQueryBuilder](https://typeorm.io/docs/query-builder/select-query-builder/) y [comparación de texto de PostgreSQL](https://www.postgresql.org/docs/current/functions-matching.html).

### La forma de una consulta relacionada

```text
Enrollment ──join──> Student
     │
     └──join──> Course
```

Un **alias** nombra cada tabla dentro de la consulta: `enrollment`, `student` y `course`. Los `JOIN` cargan relaciones necesarias. Cada filtro se añade solo si el cliente lo solicitó.

### Parámetros: datos, no instrucciones

```ts
.andWhere('course.title ILIKE :search', { search: `%${search}%` })
```

El marcador `:search` separa el valor introducido de la estructura SQL. No construyas el fragmento `ILIKE '%${search}%'`: aunque parezca funcionar, abre la puerta a inyección SQL y a errores con comillas. `ILIKE` busca sin distinguir mayúsculas de minúsculas en PostgreSQL.

### Vocabulario esencial

- **Join:** combinación de filas relacionadas mediante claves foráneas.
- **Alias:** nombre corto para referirse a una tabla en una consulta.
- **Consulta compuesta:** consulta con varias condiciones, relaciones o cálculos.
- **Inyección SQL:** alteración de una consulta mediante texto de entrada tratado erróneamente como código SQL.

## Demostración guiada · 30 min

### Paso 1 · DTO para la consulta de matrículas

```ts
export class EnrollmentsQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) studentId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) courseId?: number;
  @IsOptional() @IsBooleanString() activeOnly?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit = 10;
}
```

En esta versión `activeOnly` se conserva como texto validado porque llega desde la URL. En el servicio se interpreta explícitamente con `activeOnly === 'true'`; no se usa `Boolean(activeOnly)`, pues `Boolean('false')` es `true`.

### Paso 2 · Construir desde la entidad principal

```ts
const qb = this.enrollmentsRepository
  .createQueryBuilder('enrollment')
  .leftJoinAndSelect('enrollment.student', 'student')
  .leftJoinAndSelect('enrollment.course', 'course');

if (query.search) {
  qb.andWhere('(student.name ILIKE :search OR course.title ILIKE :search)', {
    search: `%${query.search.trim()}%`,
  });
}
if (query.studentId) qb.andWhere('student.id = :studentId', { studentId: query.studentId });
if (query.courseId) qb.andWhere('course.id = :courseId', { courseId: query.courseId });
if (query.activeOnly === 'true') qb.andWhere('student.isActive = :active', { active: true });
```

El paréntesis del primer `andWhere` importa: mantiene juntas las dos alternativas de búsqueda antes de combinarse con los demás filtros.

### Paso 3 · Orden estable y página

```ts
qb.orderBy('enrollment.id', 'ASC')
  .skip((query.page - 1) * query.limit)
  .take(query.limit);

const [items, total] = await qb.getManyAndCount();
return { items, meta: { total, page: query.page, limit: query.limit } };
```

Al igual que en la sesión anterior, el orden fijo hace reproducible el recorrido. En un producto real se puede permitir ordenar por una lista cerrada de campos; no se acepta un nombre de campo arbitrario.

### Paso 4 · Probar condiciones combinadas

```http
GET /enrollments?search=nest&activeOnly=true&page=1&limit=5
```

La respuesta debe incluir estudiantes y cursos porque se seleccionaron con `leftJoinAndSelect`. Prueba una búsqueda sin resultados: debe devolver `items: []`, `total: 0` y `200`, no `404`; el recurso «colección de matrículas» sí existe aunque ninguna fila coincida.

## Práctica guiada · 40 min

1. Implementa `EnrollmentsQueryDto` y conéctalo al endpoint `GET /enrollments`.
2. Empieza con los `JOIN` y verifica que la respuesta contiene datos relacionados.
3. Agrega un filtro a la vez y prueba su ausencia y su presencia.
4. Agrega la búsqueda con parámetro `:search`, nunca interpolación de texto.
5. Añade paginación, prueba dos páginas y verifica que cada matrícula aparece una sola vez.

**Criterio de éxito:** los filtros se combinan sin sobrescribirse; una búsqueda textual no distingue mayúsculas; y una entrada como `search=' OR 1=1 --` se trata como texto, no altera la consulta.

## Actividad autónoma · 10 min

Escribe tres peticiones de prueba: una por curso, una por estudiante activo y una con búsqueda sin resultados. Para cada una anota qué condición debería aparecer en la consulta y cuál debe ser el tamaño máximo de `items`.

## Cierre · 10 min

Explica por qué `GET /enrollments?search=inexistente` devuelve `200` y no `404`. Muestra una petición con filtros combinados y señala dónde se parametriza el texto de búsqueda.

## Tarea opcional

Investiga `EXPLAIN ANALYZE` y ejecuta el comando únicamente en una base local de desarrollo. Documenta qué índice considerarías si la búsqueda por título fuera lenta, sin agregarlo todavía.
