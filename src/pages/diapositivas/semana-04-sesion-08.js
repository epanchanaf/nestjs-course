import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 4', title: 'Cambiamos el almacenamiento sin cambiar las rutas.', statement: 'Sesión 8 · Repositorios TypeORM y CRUD persistente.', notes: 'La tabla courses ya existe desde la Sesión 7; hoy el servicio empezará a usarla.'},
  {kicker: 'Objetivo', title: 'CoursesService usará Repository<Course>.', bullets: ['La conexión y la tabla ya están listas.', 'El servicio recibe el repositorio inyectado.', 'El CRUD permanece disponible después del reinicio.'], notes: 'La meta es una sustitución focalizada, no una reescritura.'},
  {kicker: 'Registro local', title: 'El módulo expone un repositorio donde se necesita.', code: "@Module({\n  imports: [TypeOrmModule.forFeature([Course])],\n  controllers: [CoursesController],\n  providers: [CoursesService],\n})\nexport class CoursesModule {}", notes: 'Course ya pertenece a la conexión. forFeature no crea una nueva tabla ni una segunda conexión.'},
  {kicker: 'Inyección', title: 'Nest entrega un repositorio especializado en Course.', code: "constructor(\n  @InjectRepository(Course)\n  private readonly coursesRepository: Repository<Course>,\n) {}", notes: 'No creamos Repository con new; TypeORM y Nest lo configuran.'},
  {kicker: 'Retira lo temporal', title: 'El arreglo y nextId ya no son la fuente de datos.', bullets: ['Elimina private readonly courses: Course[].', 'Elimina el contador nextId.', 'Importa la entidad Course de la Sesión 7.', 'Los DTOs y rutas no cambian.'], notes: 'El id pasa a ser generado por PostgreSQL.'},
  {kicker: 'Consultar', title: 'find y findOneBy reemplazan las operaciones del arreglo.', code: "findAll(level?: string) {\n  return this.coursesRepository.find({\n    where: level ? { level } : {},\n  });\n}\n\nconst course = await this.coursesRepository.findOneBy({ id: Number(id) });", notes: 'La búsqueda por id conserva NotFoundException si no hay resultado.'},
  {kicker: 'Guardar', title: 'create prepara una entidad; save la persiste.', code: "const course = this.coursesRepository.create(dto);\nreturn this.coursesRepository.save(course);\n\nObject.assign(course, dto);\nreturn this.coursesRepository.save(course);", notes: 'Separar create de save ayuda a entender qué objeto se prepara y cuándo se escribe.'},
  {kicker: 'Eliminar', title: 'La ausencia sigue siendo una decisión del servicio.', code: "const course = await this.findOne(id);\nawait this.coursesRepository.remove(course);\nreturn course;", notes: 'El controlador no aprende SQL ni cambia sus rutas.'},
  {kicker: 'Prueba decisiva', title: 'Crear, reiniciar y consultar demuestra persistencia.', bullets: ['POST /courses con un DTO válido.', 'Reinicia la API.', 'GET /courses/:id devuelve el mismo curso.', 'Comprueba PATCH y DELETE también.'], notes: 'Diferencia “la ruta responde” de “los datos permanecen”.'},
  {kicker: 'Proyecto integrador · 60 min', title: 'Haz persistente CourseHub API.', bullets: ['Confirma la tabla de la Sesión 7.', 'Registra e inyecta Repository<Course>.', 'Sustituye el arreglo en cada método.', 'Verifica todo el CRUD y reinicia.'], notes: 'Criterio final: se conserva el contrato HTTP y los cursos persisten.'}
];

export default function Semana04Sesion08() { return <SlideDeck slides={slides} session="Semana 4 · Sesión 8" />; }
