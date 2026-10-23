---
id: spec-curso-nestjs-2026-2027
title: Especificación general del curso NestJS
status: fuente-de-verdad
version: 1.0
updated: 2026-10-06
academic_year: 2026-2027
language: es
---

# Especificación general del curso NestJS

## Propósito y uso

Este documento es la **fuente de verdad de los datos generales del curso**. Los demás chats deben consultarlo antes de crear o actualizar planificaciones, actividades, evaluaciones, requerimientos por etapas o material docente.

Una indicación posterior y explícita del docente tiene prioridad sobre este documento. Cuando se acuerde un cambio permanente de calendario, duración, hitos o estructura general, se debe actualizar primero esta especificación y después los materiales derivados.

Este archivo no sustituye las especificaciones particulares de una actividad o evaluación; estas deben ser coherentes con los datos registrados aquí.

> **Regla para el proyecto:** antes de elaborar, revisar o cambiar cualquier material docente, consulta esta especificación. No inventes ni contradigas el calendario, los temas, los hitos, la progresión técnica o las reglas globales aquí establecidas. Una instrucción posterior y explícita del docente prevalece; si el cambio es permanente, actualiza primero este documento.

## Período académico

| Dato | Valor |
| --- | --- |
| Curso | Desarrollo backend con NestJS |
| Año académico | 2026–2027 |
| Inicio de clases | 2026-08-31 |
| Fin de clases | 2026-12-20 |
| Duración | 16 semanas académicas |
| Organización semanal | Lunes a domingo |

## Distribución de semanas

| Semana | Inicio | Fin | Hito |
| --- | --- | --- | --- |
| 1 | 2026-08-31 | 2026-09-06 | — |
| 2 | 2026-09-07 | 2026-09-13 | — |
| 3 | 2026-09-14 | 2026-09-20 | — |
| 4 | 2026-09-21 | 2026-09-27 | Entrega de etapa 1 |
| 5 | 2026-09-28 | 2026-10-04 | — |
| 6 | 2026-10-05 | 2026-10-11 | — |
| 7 | 2026-10-12 | 2026-10-18 | Entrega de etapa 2 |
| 8 | 2026-10-19 | 2026-10-25 | — |
| 9 | 2026-10-26 | 2026-11-01 | — |
| 10 | 2026-11-02 | 2026-11-08 | — |
| 11 | 2026-11-09 | 2026-11-15 | Entrega de etapa 3 |
| 12 | 2026-11-16 | 2026-11-22 | — |
| 13 | 2026-11-23 | 2026-11-29 | — |
| 14 | 2026-11-30 | 2026-12-06 | — |
| 15 | 2026-12-07 | 2026-12-13 | Entrega de etapa 4 |
| 16 | 2026-12-14 | 2026-12-20 | Cierre del curso |

## Hitos de proyecto por etapas

El proyecto semestral se organiza en cuatro entregas incrementales. Cada etapa extiende el mismo proyecto; no corresponde a cuatro proyectos independientes.

| Etapa | Semana de entrega | Período de la semana |
| --- | --- | --- |
| Etapa 1 | 4 | 2026-09-21 a 2026-09-27 |
| Etapa 2 | 7 | 2026-10-12 a 2026-10-18 |
| Etapa 3 | 11 | 2026-11-09 a 2026-11-15 |
| Etapa 4 | 15 | 2026-12-07 a 2026-12-13 |

## Temas por semana

Esta es la secuencia técnica acordada. Los materiales, actividades y requerimientos de una semana solo deben exigir contenidos abordados hasta esa semana.

| Semana | Tema principal | Contenidos y alcance |
| --- | --- | --- |
| 1 | Fundamentos de NestJS | Estructura del proyecto, módulos, controladores, servicios e inyección de dependencias. Modelo asíncrono de Node.js, *event loop* y prevención de operaciones bloqueantes como fundamento de concurrencia en el servidor. |
| 2 | API REST y CRUD temporal | Rutas, parámetros de ruta, *query params* y operaciones CRUD con datos en memoria. |
| 3 | Validación y errores | DTOs, `class-validator`, `ValidationPipe`, respuestas HTTP y manejo de errores. |
| 4 | Persistencia con PostgreSQL | PostgreSQL, TypeORM, entidades, repositorios y CRUD persistente. |
| 5 | Relaciones entre entidades | Relaciones `OneToOne`, `OneToMany`, `ManyToOne` y `ManyToMany`; estados restringidos del dominio, integridad de datos y prevención de consultas N+1. |
| 6 | Consultas de datos | Filtros, búsqueda, paginación, ordenamiento y `QueryBuilder`; consultas parametrizadas y criterios para elegir persistencia relacional o NoSQL. |
| 7 | Configuración de la aplicación | Variables de entorno, configuración por ambientes y consolidación de la persistencia. |
| 8 | Autenticación inicial | Usuarios, hash de contraseñas e inicio de sesión. |
| 9 | Protección con JWT | JWT, *guards*, rutas protegidas y acceso al usuario autenticado. Configuración segura de secretos, vencimiento de tokens y distinción entre autenticación (`401`) y autorización (`403`). |
| 10 | Autorización y seguridad de acceso | Roles, permisos, propiedad del recurso, *decorators* personalizados y *guards*. CORS, limitación de peticiones, HTTPS/TLS como concepto y defensa en profundidad. |
| 11 | Arquitectura y componentes transversales | Manejo global de errores, *exceptions*, *filters*, *pipes*, *interceptors* y *middleware* de registro. SOLID, arquitectura en capas, casos de uso, adaptadores y repositorios. |
| 12 | Pruebas unitarias | Pruebas de servicios, controladores y casos de uso con Jest; *mocks* de repositorios, cobertura y criterios de calidad de pruebas. |
| 13 | Pruebas de integración y automatización | Pruebas de integración y end-to-end (e2e) con Jest y Supertest, base de datos de pruebas y validación de la API. Automatización con GitHub Actions, análisis estático y auditoría de dependencias. |
| 14 | Contrato e integración de API | Swagger / OpenAPI, versionado de API, documentación de errores y seguridad. Colección de pruebas e integración de la API con un cliente real. |
| 15 | Producción y extensión tecnológica | Docker con imagen multietapa, variables y base de datos en producción, despliegue, prueba de carga básica y nociones de escalabilidad. Implementación de una extensión: WebSocket, GraphQL o microservicio pequeño. |
| 16 | Cierre técnico | Revisión integral de arquitectura, seguridad y calidad; refactorización, demostración del despliegue, presentación y defensa técnica. |

## Progresión de las etapas

| Etapa | Semanas cubiertas | Salto técnico esperado |
| --- | --- | --- |
| 1 | 1–4 | La API funciona, aplica una arquitectura básica y persiste datos. |
| 2 | 5–7 | El modelo se relaciona, consulta datos de forma más completa y se configura por ambiente. |
| 3 | 8–11 | La API se autentica, protege recursos, autoriza acciones, aplica controles de seguridad y centraliza comportamientos transversales sobre una arquitectura mantenible. |
| 4 | 12–15 | La API se prueba, automatiza su calidad, documenta su contrato, se integra con un cliente y se prepara para producción y despliegue. |

La semana 16 está destinada al cierre y defensa técnica; no incorpora una nueva etapa de proyecto.

## Reglas globales ya definidas

- Los trabajos por etapas pueden realizarse en grupos de **hasta cuatro integrantes**.
- La temática del proyecto es libre, pero los requerimientos técnicos los define el docente.
- Cada etapa debe contar con su propia rúbrica.
- Los documentos de cada etapa deben plantear requisitos incrementales para el proyecto general.

## Información pendiente de definir

Los siguientes datos no se han establecido aún y no deben suponerse al elaborar materiales:

- Modalidad, frecuencia, días y duración de las sesiones.
- Nombre oficial de la asignatura, carrera y nivel de los estudiantes.
- Ponderación de las etapas y otras evaluaciones dentro de la calificación final.
- Fechas institucionales no lectivas, recuperaciones o cierres administrativos.

## Documentos derivados vigentes

- `SPEC_EVALUACION_PRACTICA.md`: especificación particular de la evaluación práctica de integración de cursos y estudiantes. No modifica los datos generales de este documento.
- `evaluaciones/Evaluación práctica Integración Cursos y Estudiantes.docx`: instrumento evaluativo derivado de esa especificación particular.
