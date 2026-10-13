---
sidebar_position: 4
---

# Avance de Etapa 3 · Semana 8

## CourseHub API · Cuentas y autenticación inicial

**Período de trabajo:** Semana 8 (19–25 de octubre de 2026)  
**Modalidad:** individual o grupos de hasta cuatro integrantes  
**Base:** entrega de la Etapa 2 y contenidos de la Semana 8

## Propósito

Este avance prepara la Etapa 3 mediante un módulo de acceso seguro. El objetivo no es proteger todavía todas las rutas, sino obtener una comprobación de credenciales sólida que pueda convertirse en JWT la próxima semana.

## Alcance obligatorio

### 1. Cuentas persistentes

- Existe una entidad `User` persistente con identificador, correo único, `passwordHash` y fecha de creación.
- El correo se normaliza antes de buscarse o guardarse.
- La columna del hash no se selecciona en consultas normales y no se envía como respuesta HTTP.
- `User` se mantiene separado de `Student` salvo que el equipo documente una relación explícita fuera del alcance de esta semana.

### 2. Registro

`POST /auth/register` acepta correo y contraseña mediante un DTO validado. Debe:

- responder `201 Created` cuando se crea una cuenta;
- aplicar `bcrypt.hash` antes de persistir;
- rechazar un correo duplicado con `409 Conflict`;
- rechazar cuerpos inválidos con `400 Bad Request`; y
- devolver únicamente datos seguros del usuario creado.

### 3. Inicio de sesión

`POST /auth/login` acepta el mismo par de credenciales. Debe:

- responder `200 OK` para credenciales correctas;
- recuperar el hash solo para la operación de login;
- usar `bcrypt.compare`, no comparaciones directas ni descifrado;
- responder `401 Unauthorized` con un mensaje genérico si el correo no existe o la contraseña no coincide; y
- no generar JWT, *guard* ni regla de rol todavía.

## Secuencia de demostración

En hasta ocho minutos, muestra:

1. Un registro válido y su respuesta sin hash.
2. La columna de hash en una base local, sin copiar la contraseña ni el hash a la evidencia pública.
3. Un segundo registro con el mismo correo en otra combinación de mayúsculas y su `409`.
4. Un login correcto con `200`.
5. Un login con contraseña incorrecta y uno con correo inexistente: ambos deben devolver el mismo `401` público.
6. Un cuerpo inválido que reciba `400` antes de consultar la base.

## Lista de comprobación antes del commit

| Pregunta | Debe cumplirse |
| --- | --- |
| ¿Hay una contraseña en texto dentro de la base, consola, README o colección compartida? | No. |
| ¿El hash puede aparecer por devolver la entidad completa? | No. |
| ¿Correo y contraseña se validan mediante DTO? | Sí. |
| ¿La base tiene unicidad para correo además de la comprobación del servicio? | Sí. |
| ¿Los fallos de credenciales revelan si existe el correo? | No. |
| ¿Las rutas de cursos, estudiantes y matrículas siguen funcionando? | Sí. |

## Criterios de éxito

| Criterio | Evidencia |
| --- | --- |
| Protección de contraseñas | Hash con bcrypt, columna no seleccionada y respuestas seguras. |
| Contrato HTTP | `201`, `200`, `400`, `401` y `409` usados de manera coherente. |
| Diseño modular | `AuthModule` coordina el acceso; `UsersModule` administra persistencia. |
| Casos límite | Duplicados, credenciales erróneas y DTO inválido están probados. |
| Preparación | No se adelantan tokens ni permisos; el login queda listo para JWT. |

## Extensión opcional

Maneja el error de restricción única de PostgreSQL que podría ocurrir si dos registros simultáneos intentan crear el mismo correo. Conserva la comprobación previa para un mensaje amable y traduce el conflicto de base a `409` sin exponer detalles del motor de datos.
