---
sidebar_position: 4
---

# Sesión 0C · De datos en memoria a persistencia relacional y NoSQL

**Duración sugerida:** 2 horas.
**Meta:** modelar datos del negocio, comprender cómo se persisten con NestJS y decidir con criterio entre una base relacional y NoSQL.

[Abrir presentación navegable de la Sesión 0C](/diapositivas/semana-00-sesion-00c)

## Punto de partida · 10 min

Una colección en memoria hace posible explicar un CRUD, pero desaparece al reiniciar la API, no protege la integridad entre procesos y no ofrece consultas confiables cuando los datos crecen. La persistencia desplaza la autoridad del dato a una base de datos.

```ts
// Útil para aprender rutas; no conserva datos al reiniciar.
private readonly courses = [{ id: 1, name: 'NestJS', capacity: 30 }];
```

En el curso, PostgreSQL y TypeORM se introducen formalmente en la Semana 4. Esta sesión prepara las decisiones de modelo; no adelanta la implementación de persistencia.

## Conexión y manipulación de datos en NestJS · 25 min

La aplicación usa configuración por ambiente para no incluir credenciales en el código. Un módulo de persistencia crea la conexión y los repositorios permiten trabajar con las entidades dentro de los servicios.

```text
Controller → Service / caso de uso → Repository (TypeORM) → PostgreSQL
```

| Responsabilidad | Decisión correcta |
| --- | --- |
| Conexión | Variables de entorno y configuración por ambiente. |
| Entidad | Representa el modelo persistente y su relación con tablas. |
| Repositorio | Guarda, busca y actualiza datos sin llevar HTTP al acceso a datos. |
| Servicio | Aplica reglas: cupos, transiciones de estado y permisos. |
| Migración | Versiona cambios del esquema que deben repetirse en otros ambientes. |

## ORM, QueryBuilder y SQL parametrizado · 25 min

TypeORM es el ORM que se trabajará en el curso: vincula clases TypeScript con tablas y relaciones, y ofrece repositorios para operaciones frecuentes. Es adecuado para el CRUD habitual y hace que el modelo sea explícito en el proyecto.

Para filtros, uniones, agregados o consultas que requieren control fino, TypeORM ofrece `QueryBuilder`. Sigue siendo TypeScript y permite parámetros seguros:

```ts
const courses = await this.courseRepository
  .createQueryBuilder('course')
  .where('course.status = :status', { status: CourseStatus.PUBLISHED })
  .andWhere('course.capacity >= :minimumCapacity', { minimumCapacity: 10 })
  .orderBy('course.name', 'ASC')
  .getMany();
```

Nunca se concatena entrada del usuario para formar SQL. Los parámetros separan el valor de la instrucción y previenen inyección SQL:

```ts
// Incorrecto: la entrada cambia la consulta.
`SELECT * FROM courses WHERE name = '${search}'`

// Correcto: el valor viaja como parámetro.
repository.query('SELECT * FROM courses WHERE name = $1', [search]);
```

Elegir ORM o una consulta más directa no es una competencia: el repositorio debe usar la alternativa más clara y segura para la necesidad, manteniendo las reglas de negocio fuera de la consulta.

## Migraciones y esquema · 15 min

Durante el desarrollo, una herramienta puede sincronizar un esquema local para acelerar la exploración. En ambientes compartidos, pruebas y producción, los cambios se representan mediante **migraciones versionadas**: crear una tabla, añadir una columna o un índice es un cambio revisable y repetible.

```text
Entidad / cambio de modelo → migración revisada → base de datos de cada ambiente
```

La creación automática del esquema no sustituye las migraciones en producción: puede producir cambios inesperados y no deja una historia controlada de la evolución de los datos.

## Relación uno a muchos y estados restringidos · 20 min

Un curso puede tener muchas inscripciones; cada inscripción pertenece a un curso. Esa es una relación **uno a muchos / muchos a uno**.

```text
Course 1 ───────── * Enrollment
 id                     id
 name                   course_id
 capacity               student_id
 status                 status
```

Las relaciones no son solo claves foráneas: expresan reglas. Por ejemplo, una inscripción puede transitar de `PENDING` a `CONFIRMED` o `CANCELLED`, pero nunca de `CANCELLED` a `CONFIRMED` sin una regla explícita. En TypeScript, un `enum` o una unión de literales limita los valores del código; en PostgreSQL, una restricción o un tipo apropiado protege también los datos.

## El problema N+1 · 15 min

Si primero consultas una lista de cursos (1 consulta) y luego consultas las inscripciones de cada curso (N consultas), el total es **N+1**. Con 50 cursos, son 51 viajes a la base de datos.

```text
1: SELECT cursos
N: SELECT inscripciones WHERE course_id = ...
```

Soluciones habituales:

- Cargar solo las relaciones necesarias con una consulta planificada.
- Usar `JOIN`, `relations` o `QueryBuilder` de TypeORM según la necesidad.
- Paginar y seleccionar solo columnas necesarias.
- Medir antes de optimizar: cargar todas las relaciones siempre también puede ser costoso.

## ¿Cuándo conviene NoSQL? · 15 min

PostgreSQL es el punto de partida del curso porque las entidades, relaciones, integridad y transacciones de CourseHub encajan naturalmente en un modelo relacional.

Una base NoSQL puede convenir cuando el problema tiene datos muy variables, acceso orientado a documentos, gran volumen de eventos o necesidades de escala y distribución que no se resuelven mejor con el modelo relacional. No se elige por moda ni para evitar diseñar relaciones.

| Pregunta | Suele favorecer |
| --- | --- |
| ¿Hay relaciones, reglas de integridad y transacciones? | PostgreSQL / relacional |
| ¿Los documentos tienen campos cambiantes y se consultan como unidad? | NoSQL documental |
| ¿Necesito consultas y agregados relacionales consistentes? | PostgreSQL / relacional |
| ¿Es un registro de eventos de alta escritura con patrón de acceso específico? | Evaluar una solución NoSQL según el caso |

## Revisión del negocio por parejas · 20 min

Cada pareja elige una idea de API y completa este lienzo antes de comenzar el proyecto:

1. **Entidades:** nombra entre tres y cinco entidades principales y un identificador para cada una.
2. **Relaciones:** dibuja al menos una relación uno a muchos y señala la clave que la representa.
3. **Estados restringidos:** elige una entidad con estado, enumera sus valores permitidos y dibuja transiciones válidas.
4. **Roles:** define quién usa la API y qué acción relevante puede realizar cada rol.
5. **Reglas:** escribe dos reglas que la base de datos y el servicio deban proteger.
6. **Persistencia:** justifica en tres líneas por qué empezarían con PostgreSQL o por qué el caso exige evaluar NoSQL.

## Cierre · 10 min

Un modelo de datos correcto no es una lista de tablas. Es una traducción verificable del negocio: sus entidades, relaciones, estados, roles y restricciones. Ese modelo será la base para introducir PostgreSQL y TypeORM en la Semana 4.
