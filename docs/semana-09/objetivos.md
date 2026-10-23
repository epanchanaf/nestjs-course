---
sidebar_position: 1
---

# Semana 9 · Protección de rutas con JWT

## Resultado de aprendizaje

Al finalizar la semana podrás emitir un token de acceso JWT después de un inicio de sesión válido, verificarlo en solicitudes posteriores y proteger rutas con un *guard* de NestJS.

## Entregable semanal

CourseHub API devolverá un `accessToken` tras un login correcto. El cliente lo enviará como `Authorization: Bearer <token>` para acceder a `GET /auth/me` y, al menos, otra ruta protegida. Las solicitudes sin token, con token inválido o expirado recibirán `401`.

## Límites de esta semana

- Sí: `@nestjs/jwt`, secreto y expiración configurados por entorno, carga útil mínima, estrategia JWT, `AuthGuard('jwt')` y `req.user`.
- Sí: rutas públicas y protegidas, encabezado Bearer, secretos y vencimiento configurados de forma segura, errores `401` y pruebas de tokens inválidos.
- No todavía: roles, permisos, decoradores personalizados, *refresh tokens*, cierre de sesión con lista de revocación, recuperación de cuenta ni OAuth.

JWT resuelve cómo una persona ya autenticada se identifica en otra solicitud. Una identidad ausente o inválida produce `401`; una identidad válida sin el permiso requerido produciría `403`, escenario que se implementará en la Semana 10. JWT no decide todavía qué puede hacer una persona dentro de CourseHub.

## Evidencia de salida

1. Un login correcto devuelve `accessToken` y datos seguros del usuario.
2. El token tiene una carga mínima con `sub` y correo; nunca incluye contraseña o hash.
3. `GET /auth/me` responde `200` con un token válido y `401` en los demás casos.
4. Una ruta de negocio seleccionada está protegida mediante el mismo guard.
5. `JWT_SECRET` y su vencimiento viven en `.env`/variables de entorno, están validados y no aparecen en el repositorio.
