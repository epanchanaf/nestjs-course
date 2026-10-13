import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 9', title: 'El login valida; JWT transporta una identidad temporal.', statement: 'Sesión 17 · Emisión de access tokens configurados por entorno.', notes: 'Recalca que la contraseña no se repite en cada ruta ni viaja dentro del token.' },
  { kicker: 'Objetivo', title: 'Emitiremos un token solo después de autenticar.', bullets: ['Configurar secreto y expiración.', 'Registrar JwtModule.', 'Firmar payload mínimo.', 'Devolver accessToken seguro.'], notes: 'La verificación y guard llegan en la sesión siguiente.' },
  { kicker: 'Necesidad', title: 'No vuelvas a enviar la contraseña en cada petición.', diagram: 'POST /auth/login\ncredenciales válidas\n       ↓\naccess token temporal\n       ↓\notras peticiones usan Bearer token', notes: 'Un token es una credencial: hay que conservarlo y transmitirlo con cuidado.' },
  { kicker: 'Estructura', title: 'JWT tiene tres partes; el payload no es secreto.', diagram: 'header.payload.signature\n\nfirmado ≠ cifrado', notes: 'Se puede decodificar header y payload. La firma detecta alteración.' },
  { kicker: 'Payload', title: 'Incluye solo lo necesario para identificar.', code: 'type JwtPayload = {\n  sub: number;\n  email: string;\n};', notes: 'No poner password, passwordHash, secretos ni datos que la persona no deba poder leer.' },
  { kicker: 'Configuración', title: 'El secreto vive fuera del código.', code: 'JWT_SECRET=long-random-local-secret\nJWT_EXPIRES_IN=15m', notes: 'JWT_SECRET real nunca se versiona. JWT_EXPIRES_IN limita cuánto dura una credencial expuesta.' },
  { kicker: 'Módulo', title: 'ConfigService entrega valores ya validados.', code: 'JwtModule.registerAsync({\n  inject: [ConfigService],\n  useFactory: (config) => ({\n    secret: config.getOrThrow(\'JWT_SECRET\'),\n    signOptions: { expiresIn: config.getOrThrow(\'JWT_EXPIRES_IN\') },\n  }),\n});', notes: 'No duplicar el secreto como string dentro del módulo.' },
  { kicker: 'Orden', title: 'Nunca firmes antes de validar las credenciales.', diagram: 'validateCredentials\n       ↓\nJwtPayload explícito\n       ↓\njwtService.signAsync(payload)\n       ↓\n{ accessToken, user }', notes: 'La función de login debe salir con 401 antes de llegar a signAsync si bcrypt no coincide.' },
  { kicker: 'Prueba', title: 'La emisión tiene casos de éxito y de rechazo.', bullets: ['Login válido → 200 + accessToken.', 'Login erróneo → 401 sin token.', 'Payload → sub, email, iat, exp.', 'Sin JWT_SECRET → la app no inicia.'], notes: 'No exponer el token íntegro en una captura o commit.' },
  { kicker: 'Práctica · 40 min', title: 'Configura y emite un token de práctica.', bullets: ['Instala @nestjs/jwt.', 'Actualiza .env y .env.example.', 'Refactoriza validateCredentials.', 'Firma un payload explícito.', 'Audita salida y expiración.'], notes: 'Pide restaurar 15m si usaron una expiración breve para probar.' },
  { kicker: 'Salida', title: 'Un token válido todavía no protege ninguna ruta.', statement: 'La siguiente sesión verificará firma y vencimiento antes de ejecutar un controlador.', notes: 'Pregunta: ¿qué podría leer una persona que tiene un token? Todo el payload, por eso debe ser mínimo.' },
];

export default function Semana09Sesion17() { return <SlideDeck slides={slides} session="Semana 9 · Sesión 17" />; }
