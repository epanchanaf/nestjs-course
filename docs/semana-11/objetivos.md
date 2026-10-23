---
sidebar_position: 1
---

# Semana 11 · Arquitectura y componentes transversales

## Resultado de aprendizaje

Al finalizar la semana podrás organizar una funcionalidad de NestJS para que las reglas de negocio no dependan de HTTP ni de TypeORM, y aplicar componentes transversales de forma centralizada.

## Entregable semanal

CourseHub API incorporará tratamiento global y consistente de errores, registro de solicitudes y un módulo refactorizado en capas: controlador, caso de uso, puerto o repositorio y adaptador de persistencia.

## Límites de esta semana

- Sí: middleware, filters, pipes, interceptors, SOLID, casos de uso, adaptadores y repositorios.
- Sí: una refactorización gradual de un módulo existente.
- No: reescribir toda la aplicación ni introducir una arquitectura compleja sin un problema que resolver.

La arquitectura no es la cantidad de carpetas. Es la decisión de mantener dependencias y responsabilidades en el lugar correcto para que el sistema pueda cambiar y probarse con menor riesgo.
