---
sidebar_position: 3
---

# Sesión 20 · Controles de seguridad para una API pública

[Abrir presentación navegable de la Sesión 20](/diapositivas/semana-10-sesion-20)

**Duración:** 2 horas.  
**Meta:** configurar controles básicos de consumo y comprender qué protege CORS, qué limita la tasa de solicitudes y por qué HTTPS es obligatorio fuera del entorno local.

## Introducción

Una API segura no depende de una sola barrera. JWT protege la identidad; validación protege la entrada; autorización protege las acciones; y los controles de esta sesión reducen abusos desde clientes y navegadores. Este conjunto de capas se denomina **defensa en profundidad**.

## Marco conceptual

### CORS no es autorización

CORS indica qué orígenes web pueden leer una respuesta desde un navegador. No impide que Postman, un script o un servidor externo llamen a la API. Por eso no reemplaza JWT ni un guard de roles.

```ts
app.enableCors({
  origin: ['https://coursehub.example.edu'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

En desarrollo puede usarse un origen local explícito. `origin: '*'` no es una decisión apropiada cuando la API utiliza credenciales o cuando se conoce el cliente autorizado.

### Limitar solicitudes

Una limitación de tasa reduce solicitudes repetidas en una ventana de tiempo. No elimina todos los ataques, pero hace más costoso probar miles de contraseñas o saturar una ruta pública.

```ts
// app.module.ts
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]);

// auth.controller.ts
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Post('login')
login(@Body() dto: LoginDto) { /* ... */ }
```

El límite del login es más estricto porque recibe credenciales. Una respuesta `429 Too Many Requests` comunica que el cliente debe esperar; no revela si el correo o la contraseña eran correctos.

### HTTPS y TLS

HTTPS usa TLS para cifrar el tráfico entre cliente y servidor. Sin HTTPS, un token Bearer puede ser interceptado en una red no confiable. Durante el desarrollo local puede usarse `http://localhost`; en producción la terminación TLS suele estar en un proxy, balanceador o plataforma de despliegue. La API debe documentar ese requisito y no asumir que el cliente lo resolverá.

### Matriz de capas

| Riesgo | Control principal | Control complementario |
| --- | --- | --- |
| Cuerpo malformado | DTO y `ValidationPipe` | límite de tamaño de petición |
| Token robado en tránsito | HTTPS/TLS | vencimiento corto de JWT |
| Fuerza bruta de login | rate limit | mensaje genérico y hash bcrypt |
| Acción sin permiso | roles y propiedad | registro de auditoría |
| Sitio web no autorizado | CORS | JWT y autorización en el servidor |

## Práctica guiada

1. Configura CORS para el origen local de tu cliente; prueba un origen permitido y uno no permitido desde el navegador.
2. Instala y configura `@nestjs/throttler`; limita `POST /auth/login` a cinco intentos por minuto en desarrollo.
3. Ejecuta seis intentos controlados y verifica que el último recibe `429`.
4. Revisa que las rutas protegidas siguen requiriendo JWT incluso con CORS permitido.
5. Añade al README la regla: producción requiere HTTPS y los secretos viven solo en el entorno.

## Cierre

Responde: ¿por qué CORS no protege una API de Postman? ¿Qué información no debe aparecer en la respuesta de un rate limit? ¿Por qué un token en HTTP es un riesgo aun si su firma es correcta?
