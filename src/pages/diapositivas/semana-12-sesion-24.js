import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 12', title: 'Cobertura es una señal; una expectativa clara es evidencia.', statement: 'Sesión 24 · Controladores, cobertura y calidad de pruebas.', notes: 'No equiparar porcentaje alto con calidad automática.'},
  {kicker: 'Responsabilidad', title: 'El controlador traduce HTTP y delega.', bullets: ['Recibe parámetros ya transformados.', 'Entrega DTO e identidad al caso de uso.', 'Devuelve el resultado.', 'No repite reglas de propiedad.'], notes: 'Las reglas pertenecen al caso de uso probado en la sesión 23.'},
  {kicker: 'Doble correcto', title: 'En una prueba de controlador se simula el caso de uso.', code: "const updateCourse = { execute: jest.fn() };\n\nproviders: [\n  { provide: UpdateCourseUseCase, useValue: updateCourse },\n]", notes: 'No se simula la unidad que se está intentando comprobar.'},
  {kicker: 'Delegación', title: 'Comprueba que el puente HTTP conserva los argumentos.', code: "await expect(controller.update(7, dto, actor))\n  .resolves.toEqual({ id: 7, ...dto });\n\nexpect(updateCourse.execute)\n  .toHaveBeenCalledWith(7, dto, actor);", notes: 'Así se detecta un id perdido, DTO alterado o identidad omitida.'},
  {kicker: 'Error', title: 'Un error del caso de uso no se convierte en un falso 200.', code: "updateCourse.execute.mockRejectedValue(\n  new ForbiddenException(),\n);\n\nawait expect(controller.update(7, dto, actor))\n  .rejects.toThrow(ForbiddenException);", notes: 'Comprueba que la capa no oculta decisiones del caso de uso.'},
  {kicker: 'Cobertura', title: 'Ejecutar una línea no demuestra que esté bien comprobada.', code: 'npm test -- --coverage', notes: 'Revisa líneas, funciones y especialmente ramas relevantes.'},
  {kicker: 'Preguntas', title: 'Una prueba útil responde algo específico.', bullets: ['¿Se ejerció la rama de rechazo?', '¿La expectativa verifica el resultado?', '¿Es independiente del reloj, orden y base local?', '¿Su nombre explica el contrato?'], notes: 'Cobertura baja revela zonas sin ejercitar; cobertura alta no elimina la revisión.'},
  {kicker: 'Salida', title: 'Prueba el contrato de cada capa.', statement: 'Añade una prueba de delegación y otra de propagación de error antes de cambiar una regla.', notes: 'Cierre: ¿qué prueba agregarías antes de modificar la propiedad de un curso?'},
];

export default function Semana12Sesion24() { return <SlideDeck slides={slides} session="Semana 12 · Sesión 24" />; }
