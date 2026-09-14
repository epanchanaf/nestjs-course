import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 3', title: 'Un recurso también cambia y puede desaparecer.', statement: 'Sesión 6 · PATCH, DELETE y CRUD completo.', notes: 'Conecta con POST: conservamos los mismos contratos y decisiones de error.'},
  {kicker: 'Mapa CRUD', title: 'Cada operación tiene una ruta y un resultado esperado.', bullets: ['GET /courses/:id → 200 o 404.', 'POST /courses → 201 o 400.', 'PATCH /courses/:id → 200, 400 o 404.', 'DELETE /courses/:id → 200 o 404.'], notes: 'No memorizar por siglas: recorre la vida de un curso.'},
  {kicker: 'PATCH', title: 'Actualizar parcialmente no exige repetir todos los campos.', code: "export class UpdateCourseDto extends PartialType(CreateCourseDto) {}", bullets: ['Mantiene las reglas del DTO de creación.', 'Hace opcionales title y level.', 'Evita duplicar el contrato.'], notes: 'Instala @nestjs/mapped-types si todavía no está instalado.'},
  {kicker: 'Actualizar', title: 'Primero encontramos; luego aplicamos el cambio.', code: "const course = this.findOne(id);\nObject.assign(course, updateCourseDto);\nreturn course;", notes: 'findOne ya sabe lanzar 404. No dupliques la búsqueda.'},
  {kicker: 'Eliminar', title: 'Eliminar también debe confirmar qué recurso existía.', code: "const course = this.findOne(id);\nthis.courses.splice(this.courses.indexOf(course), 1);\nreturn course;", notes: 'Después de eliminar, una consulta o eliminación repetida debe responder 404.'},
  {kicker: 'Controlador', title: 'Los métodos HTTP expresan la intención.', code: "@Patch(':id')\nupdate(@Param('id') id: string, @Body() dto: UpdateCourseDto) {\n  return this.coursesService.update(id, dto);\n}\n\n@Delete(':id')\nremove(@Param('id') id: string) {\n  return this.coursesService.remove(id);\n}", notes: 'El controlador mantiene una forma simétrica y pequeña.'},
  {kicker: 'Pruebas manuales', title: 'Comprueba cambios, validación y ausencias.', bullets: ['PATCH /courses/1 con level válido.', 'PATCH con level no permitido → 400.', 'DELETE /courses/1 → 200.', 'DELETE /courses/1 otra vez → 404.'], notes: 'Pide evidencia de todos los casos en el README.'},
  {kicker: 'Proyecto integrador · 60 min', title: 'Completa el CRUD temporal sin romper lo anterior.', bullets: ['Crea UpdateCourseDto.', 'Implementa PATCH y DELETE.', 'Verifica 200, 400 y 404.', 'Publica tabla de endpoints y commit.'], notes: 'El próximo problema intencional es que los datos se pierden al reiniciar.'}
];

export default function Semana03Sesion06() { return <SlideDeck slides={slides} session="Semana 3 · Sesión 6" />; }
