---
sidebar_position: 4
---

# Actividad diagnóstica · Pensar antes de construir

**Propósito:** comprobar los fundamentos de la Semana 0. No forma parte de las etapas del proyecto ni requiere un repositorio.

## Caso

CourseHub tiene un curso con un solo cupo disponible. Dos estudiantes envían `POST /courses/7/enrollments` casi al mismo tiempo.

## Entrega breve · arquitectura y concurrencia

Responde en una página o en tu cuaderno de trabajo:

1. Dibuja el recorrido de la petición desde el cliente hasta la base de datos en NestJS e identifica al menos cuatro responsabilidades.
2. Explica la diferencia entre concurrencia y paralelismo usando el caso de las dos solicitudes.
3. Muestra una posible secuencia que cause dos inscripciones para un solo cupo.
4. Propón una protección en PostgreSQL o una transacción y explica por qué un contador en memoria no es suficiente si hay varias instancias de la API.
5. Explica cómo `async`/`await` permite esperar una operación de base de datos sin bloquear la atención de otras solicitudes.

## Criterios de revisión

| Criterio | Logrado cuando… |
| --- | --- |
| Arquitectura | Distingue HTTP, regla de negocio y persistencia. |
| Ejecución | No confunde concurrencia con paralelismo. |
| Correctitud | Identifica lectura/escritura compartida y su efecto. |
| Decisión técnica | Propone una protección que tenga como autoridad a la base de datos. |
| Comunicación | Usa los conceptos de NestJS/Node.js con precisión. |

## Extensión · modelo de datos por pareja

Para la idea de API elegida, entrega un diagrama sencillo con entre tres y cinco entidades. Incluye una relación uno a muchos, un campo de estado con sus valores permitidos y los roles que podrán ejecutar las acciones principales. Escribe además dos reglas de integridad y una justificación breve para usar PostgreSQL o evaluar una alternativa NoSQL.
