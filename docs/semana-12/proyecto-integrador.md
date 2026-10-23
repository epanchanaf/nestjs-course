---
sidebar_position: 4
---

# Avance de Etapa 4 · Semana 12

## CourseHub API · Pruebas unitarias que protegen reglas

## Alcance obligatorio

- Hay pruebas unitarias para un caso de uso de negocio con repositorio simulado.
- El conjunto incluye éxito, recurso inexistente y una regla de autorización o integridad rechazada.
- Hay una prueba de controlador que verifica delegación de identificador, DTO e identidad autenticada.
- Las pruebas no usan PostgreSQL ni red; esas integraciones se trabajan en la Semana 13.
- El README indica el comando para ejecutar las pruebas.

## Demostración

Ejecuta la prueba completa y después muestra una expectativa que falla al cambiar temporalmente una regla. Restaura la regla y explica qué comportamiento quedaría desprotegido si se borrara esa prueba.

## Criterio de éxito

Las pruebas son rápidas, deterministas, legibles y verifican decisiones de negocio reales en vez de limitarse a ejecutar líneas de código.
