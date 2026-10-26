---
sidebar_position: 1
---

# Semana 0 · Fundamentos de arquitecturas back-end y ejecución en servidor

## Propósito

Esta semana es propedéutica: prepara el vocabulario y los modelos mentales necesarios para iniciar el curso de NestJS. No modifica la secuencia de las 16 semanas, no inicia una etapa del proyecto y no exige entregar funcionalidades de CourseHub API.

## Resultado de aprendizaje

Al finalizar, podrás explicar cómo evolucionan las arquitecturas de servidor y escoger una responsabilidad adecuada para cada capa de una API. También podrás distinguir concurrencia de paralelismo, describir el recorrido de una petición HTTP y reconocer riesgos de estado compartido en un servidor.

Además, podrás modelar el paso de datos en memoria a persistencia, explicar relaciones y restricciones del dominio, y justificar una decisión inicial entre PostgreSQL y una base de datos NoSQL.

## Tecnologías y alcance

- **Tecnología principal del curso:** TypeScript, Node.js y NestJS. Relacionaremos el *event loop*, promesas y `async`/`await` con la atención concurrente de solicitudes.
- **Límites:** no se crea CRUD, base de datos, autenticación ni módulos de negocio. Es un espacio para comprender antes de construir.

## Evidencias de aprendizaje

- Un mapa de capas para una API de CourseHub.
- La explicación trazable de una petición `GET /welcome` en NestJS.
- El diagnóstico de una condición de carrera y una medida para evitarla.
- Un modelo inicial de entidades, estados y roles para el negocio elegido por cada pareja.
