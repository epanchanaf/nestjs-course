import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 2', title: 'Leer recursos es solo una parte de una API REST.', statement: 'Sesión 4 · POST, PATCH, DELETE y CRUD en memoria.', notes: 'Recuerda las rutas GET de la sesión anterior y anuncia que hoy modificaremos el estado temporal.'},
  {kicker: 'CRUD', title: 'Cada intención se expresa con un método HTTP.', bullets: ['POST /courses · crear', 'GET /courses · listar', 'GET /courses/:id · consultar', 'PATCH /courses/:id · modificar parcialmente', 'DELETE /courses/:id · eliminar'], notes: 'Relaciona Create, Read, Update, Delete con los métodos HTTP.'},
  {kicker: 'Body', title: 'El cliente envía datos en el cuerpo de la petición.', code: "@Post()\ncreate(@Body() body: { title: string; level: string }) {\n  return this.coursesService.create(body);\n}", notes: 'Muestra un JSON de ejemplo desde el cliente HTTP.'},
  {kicker: 'Crear', title: 'El servicio asigna un id y agrega el curso al array.', code: "create(input) {\n  const course = {\n    id: Math.max(0, ...this.courses.map(item => item.id)) + 1,\n    ...input,\n  };\n  this.courses.push(course);\n  return course;\n}", notes: 'El id es una estrategia didáctica temporal, no un diseño de persistencia definitivo.'},
  {kicker: 'PATCH', title: 'Una actualización parcial cambia solo los campos enviados.', code: 'PATCH /courses/4\n\n{\n  "title": "Testing APIs with NestJS"\n}', notes: 'Compara con la creación, que necesita la información inicial del recurso.'},
  {kicker: 'Actualizar', title: 'El servicio combina el objeto existente con los cambios.', code: "update(id, input) {\n  const course = this.findOne(id);\n  if (!course) return undefined;\n  Object.assign(course, input);\n  return course;\n}", notes: 'Todavía no uses excepciones HTTP; solo observa el comportamiento cuando no existe.'},
  {kicker: 'DELETE', title: 'Eliminar modifica la colección en memoria.', code: "remove(id) {\n  const index = this.courses.findIndex(course => course.id === id);\n  if (index === -1) return undefined;\n  const [removed] = this.courses.splice(index, 1);\n  return removed;\n}", notes: 'Explica findIndex y splice únicamente lo necesario para comprender la operación.'},
  {kicker: 'Flujo de prueba', title: 'Un CRUD se comprueba como una secuencia.', code: 'GET /courses\nPOST /courses\nGET /courses\nPATCH /courses/4\nGET /courses/4\nDELETE /courses/4\nGET /courses', notes: 'Haz que el alumnado prediga el estado del array después de cada paso.'},
  {kicker: 'Persistencia temporal', title: 'Reiniciar el servidor borra los cambios.', diagram: 'HTTP → Controller → Service → Array en memoria', statement: 'Esto es deliberado: hoy estudiamos HTTP, no base de datos.', notes: 'Evita desviar la sesión hacia ORM o persistencia.'},
  {kicker: 'Proyecto integrador', title: 'CourseHub API completa su primer CRUD.', bullets: ['Conserva las rutas GET.', 'Añade POST, PATCH y DELETE.', 'Prueba crear → consultar → modificar → eliminar.', 'Documenta endpoints y publica el commit.'], notes: 'No agregar DTOs, validación, Pipes, excepciones ni ORM.'},
  {kicker: 'Salida', title: 'Controller recibe HTTP; Service modifica el recurso.', statement: 'Al terminar, courses soporta CRUD completo en memoria.', notes: 'Cierra conectando con la próxima progresión: hacer las entradas más seguras y predecibles.'}
];

export default function Semana02Sesion04() {
  return <SlideDeck slides={slides} session="Semana 2 · Sesión 4" />;
}
