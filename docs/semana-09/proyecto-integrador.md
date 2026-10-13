---
sidebar_position: 4
---

# Avance de Etapa 3 · Semana 9

## CourseHub API · JWT y rutas autenticadas

**Período de trabajo:** Semana 9 (26 de octubre–1 de noviembre de 2026)  
**Modalidad:** individual o grupos de hasta cuatro integrantes  
**Base:** avance de usuarios y autenticación inicial de la Semana 8

## Propósito

El segundo avance de la Etapa 3 convierte un login validado en una identidad reutilizable entre solicitudes. El equipo debe poder demostrar que la API emite y verifica tokens, sin adelantar una política de roles o permisos.

## Alcance obligatorio

### 1. Emisión segura

- `POST /auth/login` verifica las credenciales con `bcrypt` antes de firmar.
- La respuesta exitosa contiene `accessToken` y una representación segura del usuario.
- El payload usa, como mínimo, `sub` y `email`; no contiene contraseña, hash ni secretos.
- `JWT_SECRET` y `JWT_EXPIRES_IN` provienen de configuración validada por ambiente.
- Un login incorrecto responde `401` sin emitir token.

### 2. Verificación y rutas

- Existe una estrategia JWT que extrae tokens desde `Authorization: Bearer <token>`.
- La caducidad se respeta; no se configura `ignoreExpiration: true`.
- `JwtAuthGuard` se reutiliza en `GET /auth/me` y en al menos una ruta de negocio.
- La estrategia deja una identidad segura en `req.user`.
- Registro y login continúan siendo rutas públicas.

### 3. Contrato de errores

| Situación | Respuesta mínima |
| --- | --- |
| Falta encabezado `Authorization` | `401 Unauthorized` |
| Esquema diferente de `Bearer` | `401 Unauthorized` |
| Token alterado, firmado con otro secreto o vencido | `401 Unauthorized` |
| Token válido y cuerpo inválido en una ruta protegida | `400 Bad Request` |
| Token válido y operación permitida en esta etapa | Código de éxito de la ruta |

No hay todavía `403` por rol: una vez autenticada, la persona puede usar la ruta protegida seleccionada. La Semana 10 añadirá esa diferencia.

## Demostración requerida

Presenta una secuencia reproducible de hasta diez minutos:

1. Iniciar la aplicación sin mostrar secretos; señalar los nombres de las variables JWT en `.env.example`.
2. Registrar una cuenta de práctica o usar una existente.
3. Hacer login y explicar qué devuelve el payload sin mostrar el token completo en evidencia pública.
4. Consultar `GET /auth/me` con el encabezado Bearer y mostrar `200`.
5. Repetir `/auth/me` sin encabezado y con token alterado; mostrar `401` en ambos casos.
6. Invocar una ruta de negocio protegida sin token y verificar que no modifica datos.
7. Repetirla con token válido y mostrar que aún se aplican sus DTOs y reglas de negocio.

## Lista de comprobación antes del commit

| Pregunta | Debe cumplirse |
| --- | --- |
| ¿`.env`, `JWT_SECRET` o un token real aparecen en el diff? | No. |
| ¿El payload se construye explícitamente y sin hash? | Sí. |
| ¿El token expira? | Sí, con valor configurado. |
| ¿`JwtStrategy` verifica firma y vencimiento? | Sí. |
| ¿Una ruta privada se puede alcanzar sin token? | No. |
| ¿Login y registro se pueden alcanzar sin token? | Sí. |
| ¿Se está usando `403` o roles antes de la Semana 10? | No. |

## Criterios de éxito

| Criterio | Evidencia |
| --- | --- |
| Configuración segura | Variables validadas, plantilla segura y ningún secreto en control de versiones. |
| Emisión correcta | Solo un login válido obtiene un token con payload mínimo. |
| Protección efectiva | Guard reutilizado, solicitudes inválidas detenidas con `401`. |
| Identidad disponible | `/auth/me` devuelve el usuario autenticado preparado por la estrategia. |
| Integración | La ruta de negocio protegida conserva DTOs y reglas previas. |

## Extensión opcional

Agrega pruebas automatizadas para el servicio de autenticación: una prueba de login correcto que confirma `accessToken`, y una de contraseña incorrecta que espera `UnauthorizedException`. Usa un secreto ficticio controlado por el entorno de pruebas; no uses el secreto local de desarrollo.
