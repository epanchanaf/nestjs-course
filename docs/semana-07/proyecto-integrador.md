---
sidebar_position: 4
---

# Proyecto integrador · Etapa 2

## CourseHub API: relaciones, consultas y configuración

**Semana de entrega:** 7 (12–18 de octubre de 2026)  
**Modalidad:** grupos de hasta cuatro integrantes  
**Base:** Etapa 1 y contenidos de las semanas 5, 6 y 7

## Objetivo

Consolidar CourseHub API como una aplicación persistente y configurable. La entrega debe modelar relaciones entre recursos, permitir consultas útiles de datos y ejecutarse desde variables de entorno sin exponer secretos.

## Alcance obligatorio

### 1. Relaciones e integridad

- `Student`, `Course` y `Enrollment` se almacenan en PostgreSQL.
- Una matrícula vincula exactamente un estudiante y un curso mediante relaciones TypeORM.
- No se permite una matrícula duplicada para la misma pareja estudiante–curso.
- No se permite crear una matrícula para estudiante inexistente, curso inexistente o estudiante inactivo.

### 2. Consultas de datos

- `GET /courses` ofrece filtros, paginación y ordenamiento mediante parámetros validados.
- `GET /enrollments` admite filtros combinables por estudiante y curso, búsqueda textual y paginación.
- Las consultas relacionadas devuelven la información necesaria de estudiante y curso.
- Los textos de búsqueda se parametrizan; no se concatena texto de usuario en SQL.
- Las colecciones vacías responden `200` con una estructura válida.

### 3. Configuración por ambientes

- Puerto y conexión PostgreSQL provienen de variables de entorno.
- `ConfigModule` valida las variables requeridas al iniciar.
- `.env` está ignorado; `.env.example` documenta todas las variables con valores de ejemplo seguros.
- La conexión se construye con `ConfigService`.
- `synchronize` solo se activa en desarrollo y queda desactivado en producción.

### 4. Documentación y calidad

El README debe incluir requisitos, instalación, variables, forma de iniciar, tabla básica de endpoints y ejemplos de consultas. Los controladores permanecen delgados; DTOs validan la entrada y servicios contienen reglas de negocio.

## Demostración requerida

Presenta una secuencia reproducible de hasta diez minutos:

1. Copiar `.env.example` a `.env` y explicar qué valor local se debe completar, sin mostrar una contraseña real.
2. Iniciar la API y crear un curso y un estudiante activo.
3. Crear una matrícula; reiniciar y volver a consultarla.
4. Intentar una matrícula duplicada y una matrícula con estudiante inactivo.
5. Consultar cursos con `page`, `limit`, `sortBy` y `order`.
6. Buscar y filtrar matrículas con parámetros combinados.
7. Mostrar un parámetro inválido que responda `400`.
8. Señalar el comportamiento de `synchronize` para desarrollo y producción.

## Rúbrica

| Criterio | Excelente | Logrado | En desarrollo |
| --- | --- | --- | --- |
| Modelo persistente (25%) | Relaciones, restricciones y reglas completas; evidencia clara. | Persistencia y relaciones funcionales con detalles menores. | Faltan relaciones, restricciones o persistencia verificable. |
| Consultas (25%) | Filtros, búsqueda, páginas y ordenamiento seguros y documentados. | Consultas principales funcionan; faltan detalles de contrato o casos límite. | Listados sin paginación confiable o con parámetros sin validar. |
| Configuración (25%) | Esquema validado, archivos seguros y política por ambiente comprobada. | Variables y plantilla correctas con alguna mejora de documentación. | Credenciales o valores críticos permanecen en código o faltan variables. |
| Calidad y demostración (25%) | Código organizado, README reproducible y demostración de todos los casos. | Proyecto ejecutable y evidencia suficiente. | No se puede reproducir, faltan pruebas o la evidencia es insuficiente. |

## Entregables

- Repositorio con el código fuente y un commit descriptivo.
- `.env.example`, `.gitignore` y README actualizados.
- Colección HTTP/Postman o documento de evidencia de la demostración.
- Enlace o mecanismo definido por el docente para la entrega del grupo.

## Restricciones

- No incluir `.env`, contraseñas, tokens ni copias de bases de datos.
- No usar `synchronize: true` como política de producción.
- No añadir autenticación, roles, interfaz gráfica ni despliegue como sustituto del alcance anterior.
