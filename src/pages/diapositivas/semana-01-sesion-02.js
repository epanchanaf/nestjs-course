import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 1', title: 'Una ruta pequeña enseña las piezas principales de NestJS.', statement: 'Sesión 2 · Módulos, controladores, servicios e inyección de dependencias.', notes: 'Conecta esta sesión con la anterior: ahora separaremos las responsabilidades con intención.'},
  {kicker: 'Responsabilidades', title: 'Cada pieza resuelve un problema distinto.', bullets: ['Módulo: agrupa y registra elementos relacionados.', 'Controlador: recibe peticiones y define rutas.', 'Servicio: conserva lógica reutilizable.'], notes: 'Pide ejemplos de responsabilidades que no deban estar dentro de un controlador.'},
  {kicker: 'Inyección de dependencias', title: 'Nest entrega al controlador la dependencia que declara.', diagram: 'WelcomeController  ←  Nest  →  WelcomeService', statement: 'El controlador no construye el servicio con new.', notes: 'Señala que providers debe registrar el servicio para que Nest pueda entregarlo.'},
  {kicker: 'Código guiado', title: 'Una ruta con prefijo produce GET /welcome.', code: "@Controller('welcome')\nexport class WelcomeController {\n  constructor(private readonly welcomeService: WelcomeService) {}\n\n  @Get()\n  getWelcome() {\n    return this.welcomeService.getMessage();\n  }\n}", notes: 'Distingue el prefijo del controlador y el decorador del método.'},
  {kicker: 'Código guiado', title: 'El servicio devuelve una respuesta sin persistencia.', code: "@Injectable()\nexport class WelcomeService {\n  getMessage(): { message: string } {\n    return { message: 'Bienvenido a CourseHub API' };\n  }\n}", notes: 'Recalca que el objeto es estático: no hay entidades, repositorios, DTOs ni base de datos.'},
  {kicker: 'Práctica · 60 min', title: 'CourseHub API tendrá dos rutas funcionales.', bullets: ['Registra WelcomeController y WelcomeService en AppModule.', 'Verifica GET /welcome.', 'Documenta la evidencia en README y publica el código.'], notes: 'Criterio de salida: la raíz y /welcome responden. El alcance se mantiene deliberadamente pequeño.'}
];

export default function Semana01Sesion02() { return <SlideDeck slides={slides} session="Semana 1 · Sesión 2" />; }
