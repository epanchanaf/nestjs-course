import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 3', title: 'Antes de guardar una solicitud, definimos su contrato.', statement: 'Sesión 5 · POST, DTOs y validación.', notes: 'La colección deja de ser solo lectura, pero aún vive en memoria.'},
  {kicker: 'Objetivo', title: 'POST /courses creará únicamente cursos válidos.', bullets: ['El DTO describe title y level.', 'ValidationPipe revisa el cuerpo.', 'El servicio asigna un id temporal.'], notes: 'Un DTO no es una entidad: hablamos del límite HTTP.'},
  {kicker: 'Contrato', title: 'CreateCourseDto declara qué puede cruzar el límite HTTP.', code: "export class CreateCourseDto {\n  @IsString() @IsNotEmpty()\n  title: string;\n\n  @IsIn(['beginner', 'intermediate', 'advanced'])\n  level: string;\n}", notes: 'Revisa cada regla con una solicitud que la incumpla.'},
  {kicker: 'Tubería', title: 'La validación ocurre antes del controlador.', diagram: 'JSON → ValidationPipe → Controller → Service', bullets: ['400 para un cuerpo inválido.', 'whitelist admite solo propiedades declaradas.', 'forbidNonWhitelisted hace visible un campo inesperado.'], notes: 'No dependas de validación del cliente: cualquiera puede llamar a la API.'},
  {kicker: 'Configuración global', title: 'Una sola decisión protege los endpoints que usan DTOs.', code: "app.useGlobalPipes(new ValidationPipe({\n  whitelist: true,\n  forbidNonWhitelisted: true,\n}));", notes: 'Esto se coloca en main.ts tras crear la aplicación.'},
  {kicker: 'Controlador', title: '@Body() entrega el cuerpo ya validado.', code: "@Post()\ncreate(@Body() dto: CreateCourseDto) {\n  return this.coursesService.create(dto);\n}", notes: 'El controlador no genera ids ni modifica el arreglo.'},
  {kicker: 'Servicio', title: 'Crear añade un recurso temporal y responde 201.', code: "create(dto: CreateCourseDto) {\n  const course = { id: this.nextId++, ...dto };\n  this.courses.push(course);\n  return course;\n}", notes: 'Nest asigna 201 por defecto a @Post si no se cambia explícitamente.'},
  {kicker: 'Proyecto integrador · 60 min', title: 'Crea, valida y documenta.', bullets: ['Instala class-validator y class-transformer.', 'Activa ValidationPipe global.', 'Prueba un 201 y dos errores 400.', 'Actualiza README y publica.'], notes: 'Criterio: entradas inválidas no llegan a la lógica de negocio.'}
];

export default function Semana03Sesion05() { return <SlideDeck slides={slides} session="Semana 3 · Sesión 5" />; }
