---
sidebar_position: 2
---

# Sesión 21 · Middleware pipes filters e interceptors

[Abrir presentación navegable de la Sesión 21](/diapositivas/semana-11-sesion-21)

**Duración:** 2 horas.  
**Meta:** elegir el componente transversal correcto para registrar, validar, transformar y manejar errores sin duplicar código en los controladores.

## Introducción

Una operación HTTP cruza varias etapas antes de responder. NestJS ofrece componentes para intervenir en etapas distintas. Elegirlos bien evita repetir `try/catch`, validar manualmente cada cuerpo o registrar solicitudes en cada ruta.

```text
Solicitud → middleware → guard → pipe → controlador → interceptor → respuesta
                           ↓
                         filter ante excepción
```

## Marco conceptual

| Componente | Momento | Responsabilidad adecuada | Ejemplo |
| --- | --- | --- | --- |
| Middleware | Antes del enrutamiento final | Trabajo HTTP general | Identificador y registro de solicitud. |
| Guard | Antes del controlador | Decidir si continúa | JWT, rol o propiedad. |
| Pipe | Antes del método | Transformar o validar datos | Convertir `id` a número. |
| Interceptor | Antes y después del método | Envolver resultado o medir tiempo | Añadir tiempo de respuesta. |
| Filter | Cuando ocurre una excepción | Traducir un error a HTTP | Respuesta uniforme de error. |

### Middleware de registro seguro

```ts
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    res.on('finish', () => {
      console.log({ method: req.method, path: req.originalUrl,
        status: res.statusCode, durationMs: Date.now() - startedAt });
    });
    next();
  }
}
```

Nunca registres `Authorization`, contraseñas, tokens ni el cuerpo completo de una petición por defecto. Un log útil contiene contexto operativo sin convertirse en una filtración de datos.

### Filter global de errores

```ts
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: status === 500 ? 'Internal server error' : exception instanceof HttpException
        ? exception.getResponse() : 'Internal server error',
    });
  }
}
```

La respuesta de producción no entrega traza, consulta SQL ni variables de entorno. Esos detalles se reservan para registros internos controlados.

### Interceptor de tiempo de respuesta

```ts
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const started = Date.now();
    return next.handle().pipe(tap(() => {
      console.log({ durationMs: Date.now() - started });
    }));
  }
}
```

El interceptor no debe ocultar errores ni reemplazar una regla de negocio. Mide una preocupación transversal: cuánto tarda una operación.

## Práctica guiada

1. Registra un middleware para rutas de API y verifica método, ruta, estado y duración.
2. Mantén `ValidationPipe` global y usa `ParseIntPipe` donde un parámetro debe ser numérico.
3. Instala un filter global con una forma de error coherente.
4. Añade un interceptor de tiempo sin registrar cuerpos sensibles.
5. Provoca un `400`, un `404` y un error inesperado de práctica; compara las respuestas públicas y los registros internos.

## Cierre

Para cada situación —token inválido, `id` no numérico, recurso inexistente y operación lenta— identifica el componente adecuado y justifica por qué no usarías otro.
