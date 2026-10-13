---
sidebar_position: 1
---

# Semana 8 · Usuarios y autenticación inicial

## Resultado de aprendizaje

Al finalizar la semana podrás registrar usuarios, almacenar contraseñas de forma segura mediante *hashing* y comprobar credenciales para iniciar sesión sin exponer información sensible.

## Entregable semanal

CourseHub API incorporará los módulos `users` y `auth`. Una persona podrá crear una cuenta con correo y contraseña, y posteriormente iniciar sesión. La base de datos almacenará únicamente un hash de la contraseña y ninguna respuesta de la API revelará ese hash ni la contraseña original.

## Límites de esta semana

- Sí: entidad `User`, correo único, DTOs, normalización de correo, `bcrypt`, registro y comprobación de credenciales.
- Sí: respuestas HTTP coherentes y pruebas manuales de casos válidos e inválidos.
- No todavía: JWT, encabezado `Authorization`, *guards*, roles, permisos, recuperación de contraseña o confirmación por correo.

La sesión 16 valida quién es la persona que inicia sesión. La semana 9 decidirá cómo conservar esa autenticación entre peticiones mediante un token JWT.

## Vocabulario esencial

| Término | Significado en esta semana |
| --- | --- |
| Autenticación | Comprobar la identidad de una persona a partir de sus credenciales. |
| Credenciales | Datos que prueban identidad: aquí, correo y contraseña. |
| Hash | Resultado unidireccional de transformar una contraseña; no se puede recuperar la contraseña a partir de él. |
| Salt | Valor aleatorio que `bcrypt` incorpora para que dos contraseñas iguales no generen el mismo hash. |
| Usuario | Cuenta técnica de acceso a la API; no es necesariamente equivalente a la entidad académica `Student`. |

## Evidencia de salida

Antes de cerrar la semana, cada equipo debe poder demostrar lo siguiente:

1. `POST /auth/register` crea una cuenta sin devolver `passwordHash`.
2. PostgreSQL contiene un hash de `bcrypt`, nunca la contraseña escrita por la persona.
3. El mismo correo, incluso con mayúsculas distintas, no puede registrarse dos veces.
4. `POST /auth/login` acepta una contraseña correcta y rechaza una incorrecta con un mensaje genérico.
5. Los cuerpos inválidos reciben `400` y no crean filas parciales.
