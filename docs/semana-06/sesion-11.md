---
sidebar_position: 2
---

# Sesión 11 · Filtros, paginación y ordenamiento

**Duración:** 2 horas.  
**Meta:** implementar un listado de cursos paginado y ordenable, con filtros validados y una respuesta consistente.

[Abrir presentación navegable de la Sesión 11](/diapositivas/semana-06-sesion-11)

## Prerrequisitos y materiales

Debes tener `Course` persistente y un endpoint `GET /courses` que ya liste cursos. Necesitas PostgreSQL, el proyecto CourseHub API y un cliente HTTP. Antes de clase crea al menos ocho cursos con títulos y niveles distintos: una lista con uno o dos registros no permite comprobar una página real.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Problema y objetivo | Identificar por qué `GET /courses` no puede devolver una lista ilimitada. |
| 10–30 | Marco conceptual | Distinguir filtro, paginación y ordenamiento. |
| 30–60 | Demostración guiada | `CoursesQueryDto`, valores por defecto y repositorio. |
| 60–100 | Práctica guiada | Implementar y probar la consulta paginada. |
| 100–110 | Actividad autónoma | Añadir un filtro adicional y casos límite. |
| 110–120 | Cierre | Explicar una decisión de diseño y mostrar una evidencia. |

## Introducción · 10 min

Una lista que funciona con diez filas deja de ser útil cuando contiene miles: aumenta el tiempo de respuesta, transfiere datos que el cliente no mostrará y dificulta navegar. La solución no es entregar todos los datos y pedir al navegador que los oculte. La API debe aceptar una solicitud precisa y devolver solo la parte solicitada.

Trabajaremos con este contrato:

```http
GET /courses?level=beginner&page=2&limit=5&sortBy=title&order=ASC
```

Cada parámetro tiene una responsabilidad. `level` reduce el conjunto; `page` y `limit` seleccionan una ventana; `sortBy` y `order` hacen que esa ventana sea estable. Sin ordenamiento, una segunda página puede cambiar entre solicitudes.

## Marco conceptual · 20 min

Material oficial: [validación de Nest](https://docs.nestjs.com/techniques/validation), [opciones de búsqueda de TypeORM](https://typeorm.io/docs/working-with-entity-manager/find-options/) y [operadores de PostgreSQL](https://www.postgresql.org/docs/current/functions-comparison.html).

### Filtro no es búsqueda

| Operación | Pregunta que responde | Ejemplo |
| --- | --- | --- |
| Filtro | «¿Qué registros cumplen una condición exacta?» | `level=beginner` |
| Búsqueda | «¿Qué texto se parece al que escribí?» | `search=nest` |
| Paginación | «¿Qué tramo de resultados necesito?» | `page=2&limit=5` |
| Ordenamiento | «¿En qué secuencia debo verlos?» | `sortBy=title&order=ASC` |

### Regla de seguridad para ordenar

Los valores de un filtro se pasan como parámetros de la consulta. El nombre de una columna no puede parametrizarse de la misma manera, por lo que **nunca** se usa directamente `sortBy` recibido del cliente. En su lugar, se compara con una lista cerrada de campos admitidos. Si no está en la lista, la API devuelve `400 Bad Request`.

### Vocabulario esencial

- **Query string:** parte de una URL posterior a `?`, formada por pares `clave=valor`.
- **Paginación por desplazamiento:** técnica que omite un número de filas (`skip`) y toma un máximo (`take`).
- **Metadatos:** información sobre el resultado, como total, página y límite; no es un curso adicional.
- **Lista permitida:** conjunto explícito de valores aceptados, útil para reducir errores y riesgos.

## Demostración guiada · 30 min

### Paso 1 · Definir un DTO para la consulta

`src/courses/dto/courses-query.dto.ts`:

```ts
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CoursesQueryDto {
  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsIn(['id', 'title', 'level'])
  sortBy: 'id' | 'title' | 'level' = 'id';

  @IsOptional()
  @Transform(({ value }) => String(value).toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}
```

`@Type(() => Number)` transforma el texto de la URL antes de que `@IsInt()` lo compruebe. El límite máximo evita solicitudes que intenten cargar un volumen arbitrario. Los valores por defecto hacen que `GET /courses` siga funcionando sin parámetros.

### Paso 2 · Recibir el DTO en el controlador

```ts
@Get()
findAll(@Query() query: CoursesQueryDto) {
  return this.coursesService.findAll(query);
}
```

El controlador no decide cómo consultar la base. Solo recibe HTTP, deja que el `ValidationPipe` valide el DTO global y entrega una estructura tipada al servicio.

### Paso 3 · Componer `where`, `skip` y `take`

```ts
async findAll(query: CoursesQueryDto) {
  const { level, page, limit, sortBy, order } = query;
  const [items, total] = await this.coursesRepository.findAndCount({
    where: level ? { level } : {},
    order: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

`findAndCount` entrega los elementos de la página y el total que cumplen el filtro. La fórmula `skip = (page - 1) * limit` produce cero para la primera página, cinco para la segunda página con límite cinco, y así sucesivamente.

### Paso 4 · Probar el contrato, no solo el código

```http
GET http://localhost:3000/courses?level=beginner&page=1&limit=3&sortBy=title&order=ASC
```

Comprueba que la respuesta tiene `items` y `meta`; que recibe como máximo tres cursos; y que `total` puede ser mayor que el tamaño de `items`. Prueba también `page=0`, `limit=200`, `sortBy=createdAt` y `order=sideways`: los cuatro deben fallar con `400` si no son válidos.

## Práctica guiada · 40 min

1. Crea el DTO anterior y confirma que el `ValidationPipe` está activo con `transform: true`.
2. Cambia el listado de cursos para usar `findAndCount`.
3. Agrega el filtro opcional `level`; omítelo y comprueba que no limita los resultados.
4. Prueba dos páginas consecutivas con el mismo ordenamiento y verifica que no se repite un curso.
5. Anota en el README un ejemplo de petición y una respuesta resumida.

**Criterio de éxito:** una petición válida devuelve una forma estable `{ items, meta }`; parámetros inválidos no llegan al repositorio; y el límite no supera 50.

## Actividad autónoma · 10 min

Agrega `isPublished` como filtro opcional si tu entidad ya lo posee. Si no existe, agrega un filtro de igualdad que sí esté en tu contrato, como `category`. Explica en una frase por qué el filtro debe estar en el DTO y no aplicarse después de traer todos los cursos a memoria.

## Cierre · 10 min

Responde: ¿por qué el ordenamiento debe existir incluso cuando el usuario no lo especifica? ¿Qué diferencia hay entre `total` y `items.length`? Entrega una captura o colección HTTP con una petición válida y una inválida.

## Tarea opcional

Incluye enlaces de navegación `nextPage` y `previousPage` en los metadatos, solo cuando esas páginas existan. Conserva el resto de los parámetros de la consulta al construir cada enlace.
