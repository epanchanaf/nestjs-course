import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 9', title: 'Una ruta protegida no llega al controlador sin identidad válida.', statement: 'Sesión 18 · Passport JWT, guards y req.user.', notes: 'Demuestra primero la diferencia observable: GET /auth/me con y sin Authorization.' },
  { kicker: 'Objetivo', title: 'Verificaremos tokens antes de ejecutar rutas.', bullets: ['Extraer Bearer token.', 'Comprobar firma y expiración.', 'Aplicar JwtAuthGuard.', 'Leer identidad segura en req.user.'], notes: 'No vamos a decidir roles ni permisos en esta clase.' },
  { kicker: 'Encabezado', title: 'El token viaja en Authorization.', code: 'Authorization: Bearer <accessToken>', notes: 'Bearer es parte del esquema. "Token" o un valor sin prefijo no activan la extracción estándar.' },
  { kicker: 'Recorrido', title: 'Passport verifica antes del controlador.', diagram: 'Request\n  ↓\nJwtAuthGuard\n  ↓\nJwtStrategy\n  ↓\nvalidación de firma y exp\n  ↓\nreq.user\n  ↓\ncontroller', notes: 'Si no verifica, el controlador no se ejecuta.' },
  { kicker: 'Estrategia', title: 'Extrae, verifica y prepara una identidad segura.', code: 'super({\n  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),\n  ignoreExpiration: false,\n  secretOrKey: config.getOrThrow(\'JWT_SECRET\'),\n});\n\nvalidate(payload) {\n  return { id: payload.sub, email: payload.email };\n}', notes: 'El return de validate es lo que aparecerá en req.user.' },
  { kicker: 'Guard', title: 'Un guard reutilizable expresa una regla transversal.', code: '@Injectable()\nexport class JwtAuthGuard\n  extends AuthGuard(\'jwt\') {}', notes: 'No escribir comprobación manual del token en cada endpoint.' },
  { kicker: 'Perfil', title: 'La ruta protegida puede leer req.user.', code: '@Get(\'me\')\n@UseGuards(JwtAuthGuard)\nme(@Req() request: RequestWithUser) {\n  return request.user;\n}', notes: 'Usamos @Req explícito. Decoradores personalizados corresponden a la Semana 10.' },
  { kicker: '401 vs 403', title: 'La ausencia de identidad no es falta de permiso.', bullets: ['Sin token, alterado o expirado → 401.', 'Token válido pero rol insuficiente → 403.', 'Roles y permisos → Semana 10.'], notes: 'No introducir 403 sin una política explícita de autorización.' },
  { kicker: 'Matriz', title: 'Un guard se prueba con los casos que bloquea.', bullets: ['Bearer válido → 200.', 'Sin Authorization → 401.', 'Esquema incorrecto → 401.', 'Un carácter alterado → 401.', 'Token expirado → 401.'], notes: 'Además protege una ruta de negocio y comprueba que sin token no se modifica información.' },
  { kicker: 'Práctica · 40 min', title: 'Protege el perfil y una ruta de negocio.', bullets: ['Instala Passport JWT.', 'Registra JwtStrategy.', 'Crea JwtAuthGuard.', 'Protege /auth/me.', 'Protege una escritura y valida DTOs.'], notes: 'Registro y login deben seguir públicos, o nadie podrá conseguir token.' },
  { kicker: 'Salida', title: 'Autenticado no significa autorizado.', statement: 'JWT responde quién llega; la semana 10 definirá quién puede hacer cada acción.', notes: 'Cierre: con token válido, ¿puede cualquier cuenta borrar un curso? Aún no hay una regla que lo permita o prohíba por rol.' },
];

export default function Semana09Sesion18() { return <SlideDeck slides={slides} session="Semana 9 · Sesión 18" />; }
