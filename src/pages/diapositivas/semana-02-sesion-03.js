import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 2', title: 'Una API REST representa recursos mediante rutas.', statement: 'Sesión 3 · Routing, parámetros y consultas.', notes: 'Conecta con Semana 1: dejamos mensajes estáticos y empezamos a representar cursos.'},
  {kicker: 'Recurso courses', title: 'La misma colección admite distintas formas de lectura.', code: 'GET /courses\nGET /courses/2\nGET /courses?level=beginner', notes: 'Pregunta qué intención expresa cada URL antes de explicar decoradores.'},
  {kicker: 'Routing', title: 'Un parámetro de ruta identifica un elemento.', code: "@Get(':id')\nfindOne(@Param('id') id: string) {\n  return this.coursesService.findOne(Number(id));\n}", bullets: ['@Param lee segmentos dinámicos.', 'Los parámetros HTTP llegan inicialmente como texto.', 'En esta semana convertimos id con Number().'], notes: 'No introduzcas Pipes todavía; la conversión automática pertenece a una semana posterior.'},
  {kicker: 'Query params', title: 'Una consulta puede modificar la forma de listar sin cambiar el recurso.', code: "@Get()\nfindAll(@Query('level') level?: string) {\n  return this.coursesService.findAll(level);\n}", bullets: ['Sin query: devuelve toda la colección.', 'Con ?level=beginner: filtra el listado.'], notes: 'Diferencia identificación de recurso frente a filtrado de colección.'},
  {kicker: 'Responsabilidades', title: 'El controlador interpreta HTTP; el servicio trabaja con datos.', diagram: 'GET /courses?level=beginner  →  Controller  →  Service  →  JSON', notes: 'El filtrado debe vivir en CoursesService para conservar un controlador delgado.'},
  {kicker: 'Datos temporales', title: 'Un array es suficiente para aprender routing.', code: "private readonly courses = [\n  { id: 1, title: 'NestJS Fundamentals', level: 'beginner' },\n  { id: 2, title: 'REST APIs with NestJS', level: 'beginner' },\n  { id: 3, title: 'NestJS Architecture', level: 'intermediate' },\n];", notes: 'Recalca que reiniciar la aplicación restaura estos datos.'},
  {kicker: 'Servicio', title: 'findAll decide si devuelve o filtra.', code: "findAll(level?: string) {\n  if (!level) return this.courses;\n  return this.courses.filter(course => course.level === level);\n}", notes: 'Haz que el alumnado prediga el resultado con beginner, intermediate y sin query.'},
  {kicker: 'Servicio', title: 'findOne localiza un curso por id.', code: "findOne(id: number) {\n  return this.courses.find(course => course.id === id);\n}", statement: 'Todavía no tratamos formalmente el caso no encontrado.', notes: 'Evita introducir NotFoundException en esta sesión.'},
  {kicker: 'Prueba', title: 'Tres peticiones verifican tres comportamientos.', bullets: ['GET /courses', 'GET /courses/2', 'GET /courses?level=beginner'], notes: 'Ejecuta cada petición y pide que relacionen el resultado con el método del servicio.'},
  {kicker: 'Proyecto integrador', title: 'CourseHub API incorpora su primer recurso.', bullets: ['Genera módulo, controlador y servicio de courses.', 'Crea al menos tres cursos en memoria.', 'Implementa listado, detalle y filtro por level.', 'Publica los cambios en coursehub-api.'], notes: 'Límite: no agregar DTOs, Pipes, validación, excepciones ni persistencia.'},
  {kicker: 'Salida', title: 'Una URL comunica la intención del cliente.', statement: 'Colección, elemento y filtro son tres lecturas distintas del mismo recurso.', notes: 'Cierra pidiendo un ejemplo adicional de query param que podría existir en el futuro.'}
];

export default function Semana02Sesion03() {
  return <SlideDeck slides={slides} session="Semana 2 · Sesión 3" />;
}
