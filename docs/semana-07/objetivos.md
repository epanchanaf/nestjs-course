---
sidebar_position: 1
---

# Semana 7 · Configuración por ambientes

## Resultado de aprendizaje

Al finalizar la semana podrás separar la configuración de una aplicación NestJS de su código, validar las variables de entorno al iniciar y ejecutar CourseHub API de forma coherente en desarrollo y producción.

## Entregable semanal

CourseHub API cargará su puerto y conexión PostgreSQL desde variables de entorno, verificará que las variables obligatorias existan y documentará una configuración reproducible mediante `.env.example`, sin publicar secretos.

## Límites de esta semana

- Sí: `@nestjs/config`, archivos `.env`, validación de configuración, configuración de TypeORM por ambiente y prácticas para secretos.
- No todavía: autenticación de usuarios, despliegue en un proveedor específico, un servicio de secretos externo, Docker obligatorio ni migraciones de producción completas.

## Ruta de trabajo

1. **Sesión 13:** mover valores de configuración fuera del código y validarlos al iniciar.
2. **Sesión 14:** adaptar TypeORM y el inicio de la aplicación para desarrollo y producción, comprobando que no se filtran credenciales.

Al cerrar la semana se entrega la **Etapa 2** del proyecto: relaciones, consultas y configuración por ambientes de las semanas 5 a 7.
