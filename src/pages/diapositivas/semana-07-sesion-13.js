import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 7', title: 'La configuración no pertenece al código.', statement: 'Sesión 13 · Variables de entorno y validación al iniciar.', notes: 'No se mostrarán contraseñas reales durante la demostración.' },
  { kicker: 'Objetivo', title: 'Haremos la API configurable y reproducible.', bullets: ['Cargar PORT y conexión desde entorno.', 'Validar valores obligatorios.', 'Crear .env.example.', 'Evitar publicar secretos.'], notes: 'Separar el código de su entorno de ejecución.' },
  { kicker: 'Clasificación', title: 'No todo archivo se trata igual.', bullets: ['Código: se versiona.', 'Configuración: varía por entorno.', 'Secreto: jamás se versiona.', 'Plantilla: se comparte sin valores reales.'], notes: 'Usa DB_PASSWORD como ejemplo de secreto.' },
  { kicker: 'ConfigModule', title: 'La validación ocurre antes de conectarse.', code: "ConfigModule.forRoot({\n  isGlobal: true,\n  validationSchema: Joi.object({\n    PORT: Joi.number().port().default(3000),\n    DB_HOST: Joi.string().required(),\n    DB_NAME: Joi.string().required(),\n  }),\n});", notes: 'Una variable presente puede ser inválida: DB_PORT=hola.' },
  { kicker: 'Lectura', title: 'ConfigService centraliza las dependencias.', code: "const config = app.get(ConfigService);\nconst port = config.getOrThrow<number>('PORT');\nawait app.listen(port);", notes: 'Evita process.env distribuido por muchas capas.' },
  { kicker: '.env.example', title: 'Explica qué hace falta, sin entregar secretos.', code: 'NODE_ENV=development\nPORT=3000\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=coursehub\nDB_USER=postgres\nDB_PASSWORD=replace-with-your-local-password', notes: '.env está en gitignore; .env.example sí se comparte.' },
  { kicker: 'Fallar rápido', title: 'Una configuración defectuosa debe detener el arranque.', bullets: ['Quita DB_NAME temporalmente.', 'Inicia la API.', 'Lee el error de validación.', 'Restaura y comprueba GET /courses.'], notes: 'Es preferible a una falla confusa después de recibir tráfico.' },
  { kicker: 'Práctica · 40 min', title: 'Extrae y valida la configuración local.', bullets: ['Instala ConfigModule y Joi.', 'Define esquema.', 'Mueve PORT.', 'Crea plantilla.', 'Verifica que .env está ignorado.'], notes: 'No incluyas capturas que muestren claves reales.' },
  { kicker: 'Cierre', title: 'El mismo código puede ejecutarse en distintos entornos.', statement: 'Cambian las variables; no debe cambiar el código ni exponerse la configuración sensible.', notes: 'La sesión 14 conectará TypeORM con ConfigService.' },
];

export default function Semana07Sesion13() { return <SlideDeck slides={slides} session="Semana 7 · Sesión 13" />; }
