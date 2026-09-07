import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 1', title: 'CourseHub API comienza con una estructura que puede crecer.', statement: 'Sesión 1 · Introducción a NestJS y primer proyecto.', notes: 'Presenta el proyecto transversal. Aclara que hoy no se construirá CRUD ni se conectará una base de datos.'},
  {kicker: 'Idea clave', title: 'NestJS organiza una aplicación de servidor con TypeScript.', bullets: ['Construimos una API HTTP sobre Node.js.', 'Los decoradores expresan la intención del código.', 'La estructura evita que las rutas se conviertan en lógica desordenada.'], notes: 'Relaciona NestJS con la necesidad de mantener orden cuando la aplicación crece.'},
  {kicker: 'Preparación', title: 'El CLI crea una aplicación lista para ejecutar.', code: 'npm i -g @nestjs/cli\nnest new coursehub-api\ncd coursehub-api\nnpm run start:dev', notes: 'Explica que start:dev reinicia el servidor al guardar cambios. Verifica la ruta raíz en el puerto 3000.'},
  {kicker: 'Recorrido HTTP', title: 'Cada petición viaja por responsabilidades claras.', diagram: 'Cliente  →  Controller  →  Service  →  respuesta HTTP', statement: 'El controlador recibe la petición; el servicio conserva la lógica de la aplicación.', notes: 'No presentes el servicio como una base de datos. En esta sesión devuelve una respuesta estática.'},
  {kicker: 'Código guiado', title: 'El controlador asocia GET / con un método.', code: "@Controller()\nexport class AppController {\n  constructor(private readonly appService: AppService) {}\n\n  @Get()\n  getHello(): string {\n    return this.appService.getHello();\n  }\n}", notes: 'Lee el constructor, luego el decorador @Get y finalmente la delegación al servicio.'},
  {kicker: 'Práctica · 60 min', title: 'El primer entregable debe estar publicado en GitHub.', bullets: ['Crea un repositorio público llamado coursehub-api.', 'Cambia el mensaje de la raíz a “CourseHub API está en línea”.', 'Prueba GET / y publica el commit.'], notes: 'Cierra con el criterio de salida: repositorio público, proyecto arrancable y ruta raíz funcional.'}
];

export default function Semana01Sesion01() { return <SlideDeck slides={slides} session="Semana 1 · Sesión 1" />; }
