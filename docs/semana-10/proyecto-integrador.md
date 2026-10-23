---
sidebar_position: 4
---

# Avance de Etapa 3 · Semana 10

## CourseHub API · Autorización y defensa en profundidad

El proyecto debe mantener las rutas públicas de registro e inicio de sesión y aplicar una política explícita a las rutas de negocio elegidas.

## Alcance obligatorio

- `User` tiene un rol controlado y el valor por defecto es el de menor privilegio.
- Existe una ruta exclusiva de administración protegida por JWT y rol; una identidad válida sin rol recibe `403`.
- Existe una regla de propiedad en una operación de actualización: un docente no modifica el curso de otro docente.
- CORS admite únicamente los orígenes documentados para el entorno.
- `POST /auth/login` tiene limitación de solicitudes y responde `429` cuando se excede.
- El README declara HTTPS/TLS como requisito de producción.

## Demostración

Muestra una misma ruta con cinco casos: sin token, token de estudiante, token de docente ajeno, token de docente propietario y token de administrador. Explica por qué cada código HTTP es `401`, `403` o exitoso.

## Criterio de éxito

Las reglas de seguridad se aplican en el servidor, están separadas de la interfaz de usuario y no exponen secretos, tokens ni detalles internos de la base de datos.
