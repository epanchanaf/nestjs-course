---
sidebar_position: 2
---

# Sesión 0A · Arquitecturas back-end: características, pilares y evolución

**Duración sugerida:** 2 horas.
**Meta:** reconocer las decisiones arquitectónicas que mantienen una API entendible, segura y capaz de evolucionar.

[Abrir presentación navegable de la Sesión 0A](/diapositivas/semana-00-sesion-00a)

## Punto de partida · 10 min

Una aplicación back-end recibe solicitudes, aplica reglas del dominio, coordina datos y devuelve respuestas. La dificultad no es atender una ruta aislada: es lograr que decenas de rutas y reglas puedan cambiar sin volver el sistema frágil.

Pregunta de arranque: si CourseHub debe validar una inscripción, guardar un curso y responder HTTP, ¿qué parte debe saber de cada cosa?

## Características de una arquitectura back-end · 25 min

| Característica | Significado práctico en CourseHub API |
| --- | --- |
| Separación de responsabilidades | El controlador trata HTTP; un servicio o caso de uso aplica la regla; un repositorio accede a datos. |
| Cohesión | Las piezas de cursos viven juntas y no mezcladas con autenticación o estudiantes. |
| Bajo acoplamiento | Cambiar PostgreSQL o el transporte HTTP afecta adaptadores, no la regla de inscripción. |
| Observabilidad | Registros, métricas y trazas permiten saber qué ocurrió con una petición. |
| Seguridad | La validación, autenticación y autorización se aplican de forma consistente, no ruta por ruta improvisadamente. |
| Resiliencia y rendimiento | Límites, tiempos de espera y operaciones no bloqueantes evitan que una falla o tarea costosa detenga todo el servidor. |

## Pilares para decidir · 20 min

Una arquitectura no es una carpeta con nombres elegantes. Es una decisión sobre límites y dependencias.

```text
Cliente HTTP
     │
Controller / adaptador HTTP
     │
Caso de uso o servicio de aplicación
     │
Dominio: reglas y entidades
     │
Repositorio / adaptador de infraestructura ──> PostgreSQL, correo, API externa
```

- **Dominio primero:** la regla “un estudiante no se inscribe dos veces” debe poder entenderse sin conocer Express, TypeORM o una tabla concreta.
- **Dependencias hacia adentro:** las capas externas dependen de las reglas; las reglas no deberían depender del framework.
- **Contratos explícitos:** DTOs y tipos delimitan qué entra y qué sale. En el curso se trabajarán desde la Semana 3.
- **Transversalidad controlada:** registro, validación, manejo de errores y seguridad no se copian en cada controlador; NestJS ofrece *middleware*, *pipes*, *guards*, *interceptors* y *filters* para ello.

## Evolución: del script al sistema mantenible · 25 min

| Etapa | Aporta | Riesgo si se conserva demasiado tiempo |
| --- | --- | --- |
| Script o ruta única | Aprendizaje rápido y prueba de idea. | Lógica, HTTP y datos quedan mezclados. |
| Monolito modular | Un despliegue, módulos de negocio claros y transacciones simples. | Módulos acoplados si no se respetan límites. |
| Arquitectura en capas / puertos y adaptadores | Reglas más testeables y sustituibles. | Añadir abstracciones sin necesidad puede complicar un proyecto pequeño. |
| Servicios distribuidos | Escalado y despliegue independiente en dominios realmente autónomos. | Red, observabilidad, consistencia y operación se vuelven mucho más complejas. |

Para CourseHub empezamos con un **monolito modular NestJS**. Es suficiente para aprender estructura, persistencia, seguridad y pruebas. Los microservicios no son una mejora automática: son una decisión que se justifica cuando los límites del dominio, el equipo y la operación lo necesitan.

## Práctica guiada · 30 min

Diseña esta ruta sin escribir código:

```text
POST /courses/:courseId/enrollments
```

1. Lista los datos que recibe el adaptador HTTP y cuáles deben validarse.
2. Formula una regla de negocio: no repetir inscripción y no exceder cupos.
3. Indica qué operación pertenece al repositorio.
4. Señala dos comportamientos transversales: por ejemplo, autenticación y registro.
5. Explica qué respuesta HTTP devolverías si ya existe la inscripción y por qué.

## Cierre · 10 min

Una API sostenible no se mide por el número de carpetas. Se reconoce porque cada cambio tiene un lugar razonable y porque sus reglas se pueden probar y explicar. En la siguiente sesión veremos qué sucede cuando varias solicitudes llegan casi al mismo tiempo.
