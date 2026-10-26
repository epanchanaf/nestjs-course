import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 11', title: 'La regla de negocio no debe depender de HTTP ni TypeORM.', statement: 'Sesión 22 · Casos de uso, repositorios y adaptadores.', notes: 'La meta es hacer reglas legibles y probables sin infraestructura.'},
  {kicker: 'Problema', title: 'Un servicio grande acumula decisiones y detalles técnicos.', bullets: ['Controladores con HTTP.', 'Servicios con reglas de negocio.', 'Repositorios con consultas.', 'Infraestructura con TypeORM y PostgreSQL.'], notes: 'El problema no es TypeORM: es mezclar responsabilidades.'},
  {kicker: 'Capas', title: 'La dirección de dependencia protege la regla central.', diagram: 'HTTP Controller\n      ↓\nUpdateCourseUseCase\n      ↓\nCourseRepository (puerto)\n      ↓\nTypeOrmCourseRepository\n      ↓\nPostgreSQL', notes: 'El caso de uso conoce un contrato; el adaptador conoce la biblioteca.'},
  {kicker: 'Puerto', title: 'El contrato contiene solo lo que el caso de uso necesita.', code: "export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');\n\nexport interface CourseRepository {\n  findById(id: number): Promise<Course | null>;\n  save(course: Course): Promise<Course>;\n}", notes: 'Evita interfaces enormes creadas por costumbre.'},
  {kicker: 'Caso de uso', title: 'La política de propiedad queda en una unidad con nombre.', code: "const course = await this.courses.findById(id);\nif (!course) throw new NotFoundException('Course not found');\nif (actor.role !== UserRole.ADMIN && course.createdByUserId !== actor.id) {\n  throw new ForbiddenException('You cannot modify this course');\n}\nObject.assign(course, changes);\nreturn this.courses.save(course);", notes: 'Ahora el comportamiento es fácil de leer y probar.'},
  {kicker: 'Adaptador', title: 'TypeORM implementa el contrato, no define la regla.', code: "findById(id: number) {\n  return this.repository.findOneBy({ id });\n}\n\nsave(course: Course) {\n  return this.repository.save(course);\n}", notes: 'Cambiar almacenamiento debería afectar el adaptador, no cada controlador.'},
  {kicker: 'SOLID práctico', title: 'Haz preguntas que revelen acoplamiento.', bullets: ['¿Esta clase cambia por una razón clara?', '¿El contrato pide solo métodos usados?', '¿Una implementación puede sustituir a otra?', '¿La regla depende de un contrato y no de TypeORM?'], notes: 'Úsalas para revisar una operación existente.'},
  {kicker: 'Salida', title: 'Extrae una operación y deja su política visible.', statement: 'Elige actualizar un curso, crea su puerto, su caso de uso y su adaptador.', notes: 'La siguiente semana probará el caso de uso con un repositorio falso.'},
];

export default function Semana11Sesion22() { return <SlideDeck slides={slides} session="Semana 11 · Sesión 22" />; }
