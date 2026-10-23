---
sidebar_position: 1
---

# Semana 10 · Autorización y seguridad de acceso

## Resultado de aprendizaje

Al finalizar la semana podrás decidir y aplicar quién puede ejecutar una acción dentro de CourseHub API. Usarás roles, permisos y propiedad de recursos sin confundirlos con la autenticación JWT ya resuelta en la semana anterior.

## Entregable semanal

La API tendrá rutas protegidas por JWT y una política de autorización explícita. Un usuario con rol `admin` podrá administrar recursos; un usuario con rol `teacher` podrá modificar únicamente los cursos que le pertenecen; una identidad autenticada sin el permiso necesario recibirá `403 Forbidden`.

## Límites de esta semana

- Sí: roles, permisos, propiedad de recursos, *guards*, decoradores personalizados, CORS, limitación de solicitudes y nociones de HTTPS/TLS.
- Sí: pruebas manuales de `401`, `403` y acceso autorizado.
- No todavía: OAuth, refresh tokens, revocación distribuida, MFA ni un proveedor externo de identidad.

La autenticación responde «¿quién eres?». La autorización responde «¿puedes realizar esta acción aquí y ahora?». Ambas se aplican en el servidor; ocultar un botón en un cliente nunca sustituye una autorización.
