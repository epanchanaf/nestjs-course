import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 4', title: 'Cambiamos el almacenamiento sin cambiar las rutas.', statement: 'Sesión 8 · Repositorios TypeORM y CRUD persistente.', notes: 'El contrato creado en Semana 3 se mantiene; evoluciona la implementación del servicio.'},
  {kicker: 'Objetivo', title: 'CoursesService usará Repository<Course>.', bullets: ['CoursesModule registra la entidad.', 'El servicio recibe el repositorio inyectado.', 'El CRUD permanece disponible después del reinicio.'], notes: 'La meta es una sustitución focalizada, no una reescritura.'},
  {kicker: 'Registro local', title: 'El módulo expone el repositorio solo donde se necesita.', code: "@Module({\n  imports: [TypeOrmModule.forFeature([Course])],\n  controllers: [CoursesController],\n  providers: [CoursesService],\n})\nexport class CoursesModule {}", notes: 'forFeature establece el límite del repositorio en el módulo de cursos.'},
  {kicker: 'Inyección', title: 'Nest entrega un repositorio especializado en Course.', code: "constructor(\n  @InjectRepository(Course)\n  private readonly courses: Repository<Course>,\n) {}", notes: 'No creamos Repository con new; TypeORM y Nest lo configuran.'},
  {kicker: 'Consultar', title: 'find y findOneBy reemplazan las operaciones del arreglo.', code: "findAll(level?: string) {\n  return this.courses.find({ where: level ? { level } : {} });\n}\n\nconst course = await this.courses.findOneBy({ id: Number(id) });", notes: 'La búsqueda por id conserva NotFoundException si no hay resultado.'},
  {kicker: 'Guardar', title: 'create prepara una entidad; save la persiste.', code: "create(dto: CreateCourseDto) {\n  return this.courses.save(this.courses.create(dto));\n}\n\nreturn this.courses.save(Object.assign(course, dto));", notes: 'Separar create de save ayuda a entender qué objeto se prepara y cuándo se escribe.'},
  {kicker: 'Eliminar', title: 'La ausencia sigue siendo una decisión del servicio.', code: "const course = await this.findOne(id);\nawait this.courses.remove(course);\nreturn course;", notes: 'El controlador no aprende SQL ni cambia sus rutas.'},
  {kicker: 'Prueba decisiva', title: 'Crear, reiniciar y consultar demuestra persistencia.', bullets: ['POST /courses con un DTO válido.', 'Reinicia la API.', 'GET /courses/:id devuelve el mismo curso.', 'Comprueba PATCH y DELETE también.'], notes: 'Diferencia “la ruta responde” de “los datos permanecen”.'},
  {kicker: 'Proyecto integrador · 60 min', title: 'Haz persistente CourseHub API.', bullets: ['Registra e inyecta Repository<Course>.', 'Sustituye el arreglo en cada método.', 'Verifica todo el CRUD y reinicia.', 'Actualiza README y publica sin .env.'], notes: 'Criterio final: se conserva el contrato HTTP y los cursos persisten.'}
];

export default function Semana04Sesion08() { return <SlideDeck slides={slides} session="Semana 4 · Sesión 8" />; }
