import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 8', title: 'Iniciar sesión es comprobar, no descifrar.', statement: 'Sesión 16 · Validación de credenciales con bcrypt.compare.', notes: 'Parte de User y passwordHash ya persistidos. Aún no se crea un token.' },
  { kicker: 'Objetivo', title: 'Separaremos formato, identidad y acceso futuro.', bullets: ['Validar LoginDto.', 'Recuperar hash solo para login.', 'Usar bcrypt.compare.', 'Devolver 200 o 401 seguro.'], notes: 'El token JWT corresponde a la Semana 9.' },
  { kicker: 'Tres preguntas', title: 'Autenticación no es autorización.', diagram: '¿Quién eres? → autenticación\n¿Cómo lo demuestras después? → sesión\n¿Qué puedes hacer? → autorización', notes: 'En esta clase respondemos solo la primera. JWT responde la segunda. Roles llegarán en Semana 10.' },
  { kicker: 'Flujo', title: 'Comparar usa dos entradas distintas.', diagram: 'correo + contraseña\n       ↓\nbuscar user + passwordHash\n       ↓\nbcrypt.compare(password, hash)\n       ↓\n200 seguro  |  401 genérico', notes: 'No crear un hash nuevo y compararlo con ===: el salt lo hace incorrecto.' },
  { kicker: 'Consulta limitada', title: 'El hash se carga solo para una operación explícita.', code: 'createQueryBuilder(\'user\')\n  .addSelect(\'user.passwordHash\')\n  .where(\'user.email = :email\', { email })\n  .getOne();', notes: 'Los parámetros evitan concatenar valores de entrada. El método no debe reutilizarse para perfiles.' },
  { kicker: 'Comparación', title: 'El mismo fallo público para dos causas privadas.', code: 'const matches = user\n  ? await bcrypt.compare(dto.password, user.passwordHash)\n  : false;\n\nif (!user || !matches) {\n  throw new UnauthorizedException(\n    \'Invalid credentials\',\n  );\n}', notes: 'Correo inexistente y password incorrecta no revelan cuál dato falló.' },
  { kicker: 'Códigos', title: '400 no significa lo mismo que 401.', bullets: ['DTO inválido → 400, no consulta base.', 'Credenciales no válidas → 401.', 'Login correcto → 200.', 'Registro duplicado → 409.'], notes: '403 se reserva para una identidad válida sin permiso, contenido de Semana 10.' },
  { kicker: 'Respuesta', title: 'El login no crea un recurso nuevo.', code: '@Post(\'login\')\n@HttpCode(HttpStatus.OK)\nlogin(@Body() dto: LoginDto) {\n  return this.authService.login(dto);\n}', notes: 'El POST tiene 201 por defecto en Nest; aquí declaramos 200 de manera explícita.' },
  { kicker: 'Matriz', title: 'Cinco pruebas explican el contrato.', bullets: ['Correcto → 200.', 'Password errónea → 401.', 'Correo inexistente → mismo 401.', 'Correo mal formado → 400.', 'Password corta → 400.'], notes: 'Comparar los dos cuerpos 401 es una forma simple de detectar enumeración de cuentas.' },
  { kicker: 'Práctica · 40 min', title: 'Implementa y prueba el login completo.', bullets: ['Crea LoginDto.', 'Añade búsqueda con hash.', 'Usa bcrypt.compare en AuthService.', 'Marca la ruta como 200.', 'Revisa que no hay hash en respuesta.'], notes: 'El controlador debe delegar; no colocar bcrypt.compare dentro de una ruta.' },
  { kicker: 'Salida', title: 'La identidad fue validada; falta conservarla.', statement: 'En la Semana 9, solo un login válido emitirá un token de acceso JWT.', notes: 'Cierre: explica por qué no hay forma de recuperar password desde el hash.' },
];

export default function Semana08Sesion16() { return <SlideDeck slides={slides} session="Semana 8 · Sesión 16" />; }
