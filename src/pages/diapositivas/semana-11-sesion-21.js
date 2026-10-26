import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 11', title: 'Las preocupaciones transversales no pertenecen a cada controlador.', statement: 'Sesión 21 · Middleware, pipes, filters e interceptors.', notes: 'Introduce el recorrido de la solicitud antes de definir cada pieza.'},
  {kicker: 'Recorrido', title: 'Cada componente interviene en un momento distinto.', diagram: 'Solicitud → middleware → guard → pipe → controlador → interceptor → respuesta\n                                      ↓\n                              filter ante excepción', notes: 'El orden ayuda a elegir la herramienta correcta.'},
  {kicker: 'Elección', title: 'Una responsabilidad clara evita código repetido.', bullets: ['Middleware: trabajo HTTP general.', 'Guard: permitir o negar la continuación.', 'Pipe: transformar o validar datos.', 'Interceptor: envolver resultado o medir tiempo.', 'Filter: traducir excepciones a HTTP.'], notes: 'No todo error debe terminar en un try/catch dentro del controlador.'},
  {kicker: 'Registro', title: 'Un log útil contiene contexto sin secretos.', code: "res.on('finish', () => {\n  console.log({\n    method: req.method,\n    path: req.originalUrl,\n    status: res.statusCode,\n    durationMs: Date.now() - startedAt,\n  });\n});", notes: 'Nunca registrar Authorization, contraseñas, tokens ni cuerpos completos por defecto.'},
  {kicker: 'Pipes', title: 'Los datos inválidos se detienen antes de la regla de negocio.', code: "@Get(':id')\nfindOne(@Param('id', ParseIntPipe) id: number) {\n  return this.coursesService.findOne(id);\n}", notes: 'Mantén ValidationPipe global para DTOs y usa ParseIntPipe donde corresponda.'},
  {kicker: 'Filter', title: 'La API expone errores coherentes y oculta detalles internos.', code: "response.status(status).json({\n  statusCode: status,\n  path: request.url,\n  timestamp: new Date().toISOString(),\n  message: status === 500 ? 'Internal server error' : message,\n});", notes: 'Nunca devolver trazas, SQL ni variables de entorno a quien consume la API.'},
  {kicker: 'Interceptor', title: 'Mide la operación antes y después de que se ejecute.', code: "const started = Date.now();\nreturn next.handle().pipe(tap(() => {\n  console.log({ durationMs: Date.now() - started });\n}));", notes: 'Un interceptor mide o transforma; no reemplaza reglas de negocio.'},
  {kicker: 'Salida', title: 'Asigna cada situación al componente adecuado.', bullets: ['Token inválido → guard.', 'id no numérico → pipe.', 'Recurso inexistente → filter.', 'Operación lenta → interceptor.', 'Registro de petición → middleware.'], notes: 'Pide justificar por qué las otras alternativas son menos adecuadas.'},
];

export default function Semana11Sesion21() { return <SlideDeck slides={slides} session="Semana 11 · Sesión 21" />; }
