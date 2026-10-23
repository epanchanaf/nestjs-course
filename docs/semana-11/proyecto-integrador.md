---
sidebar_position: 4
---

# Avance de Etapa 3 · Semana 11

## CourseHub API · Arquitectura mantenible y comportamiento transversal

## Alcance obligatorio

- Existe un middleware de registro que no guarda secretos ni cuerpos sensibles.
- La API devuelve errores con una forma consistente y no expone trazas internas.
- Un módulo de negocio incorpora un caso de uso separado de su controlador.
- Ese caso usa un contrato de repositorio pequeño y un adaptador TypeORM.
- La autorización de propiedad permanece junto a la regla de negocio.

## Demostración

En hasta ocho minutos, muestra una solicitud correcta, una con identificador inválido, una de recurso inexistente y una prohibida. Después, señala en el código dónde viven HTTP, regla de negocio y persistencia.

## Criterio de éxito

La estructura permite leer y probar la regla sin conocer detalles de rutas o de TypeORM, mientras los componentes transversales se aplican una sola vez de forma controlada.
