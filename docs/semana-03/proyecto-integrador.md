---
sidebar_position: 4
---

# Trabajo práctico · Semana 3

## Gestión de estudiantes

**Duración:** 2 horas  
**Modalidad:** Trabajo práctico individual o en parejas  
**Base:** Proyecto NestJS utilizado durante el curso

## Enunciado

La institución necesita incorporar al sistema un módulo para la **gestión de estudiantes**. El objetivo de la práctica es implementar este módulo aplicando de manera integrada los conceptos de NestJS estudiados hasta la Semana 3.

Cada estudiante deberá tener como mínimo la siguiente información:

- `id`
- `name`
- `email`
- `age`
- `career`
- `semester`
- `isActive`

La API deberá permitir:

- Registrar estudiantes.
- Consultar todos los estudiantes.
- Consultar un estudiante mediante su identificador.
- Modificar parcialmente la información de un estudiante.
- Eliminar estudiantes.
- Cambiar exclusivamente el estado activo/inactivo de un estudiante.
- Filtrar el listado de estudiantes por `career`, `semester` e `isActive`. Los filtros deberán ser opcionales y podrán utilizarse de manera combinada.

## Reglas de negocio

La implementación deberá cumplir las siguientes reglas:

1. El correo electrónico de cada estudiante debe ser **único**. No se podrá registrar un nuevo estudiante utilizando un correo que ya pertenezca a otro estudiante.
2. El semestre deberá encontrarse dentro del rango de **1 a 10**.
3. No se podrá eliminar un estudiante que se encuentre **inactivo**.
4. Antes de consultar, modificar o eliminar un estudiante, el sistema deberá comprobar que el estudiante exista.
5. Los datos recibidos por la API deberán ser validados antes de ejecutar la lógica de negocio.
6. La modificación de un estudiante deberá ser parcial y **no deberá permitir modificar su identificador**.
7. Los parámetros recibidos mediante las rutas deberán ser transformados o validados cuando corresponda.
8. Se deberá implementar al menos un **Pipe personalizado** para resolver una necesidad de validación o transformación dentro del módulo.
9. La API deberá responder utilizando códigos y excepciones HTTP apropiados para datos inválidos, recursos inexistentes y conflictos de reglas de negocio.

## Restricciones de implementación

Para esta práctica **no se utilizará una base de datos**. La información deberá mantenerse en memoria mientras la aplicación se encuentre ejecutándose.

La solución deberá respetar la separación de responsabilidades trabajada durante el curso. En particular, **los Controllers no deberán contener lógica de negocio**.

No se especifica qué clases, DTOs, métodos, Pipes o excepciones concretas deben crearse. Cada equipo deberá decidir cómo organizar la solución utilizando exclusivamente los conceptos estudiados hasta la Semana 3.

## Resultado esperado

Al finalizar las dos horas, el proyecto deberá exponer una API REST funcional para la gestión de estudiantes.

El equipo deberá demostrar el funcionamiento de la solución utilizando Postman, Insomnia, Bruno o una herramienta equivalente, incluyendo tanto casos exitosos como casos en los que las reglas de negocio o las validaciones impidan realizar una operación.

Se evaluará especialmente la capacidad para integrar correctamente los conceptos estudiados hasta la Semana 3, la separación de responsabilidades, la organización del código y el cumplimiento de las reglas planteadas en este enunciado.
