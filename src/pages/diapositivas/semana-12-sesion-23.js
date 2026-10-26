import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 12', title: 'Una prueba unitaria protege una decisión pequeña.', statement: 'Sesión 23 · Reglas de negocio con Jest.', notes: 'Diferencia prueba manual de ruta y prueba aislada de una regla.'},
  {kicker: 'Objetivo', title: 'Probaremos un caso de uso sin HTTP ni PostgreSQL.', bullets: ['Preparar dependencias controladas.', 'Ejecutar una unidad concreta.', 'Verificar resultado, error o interacción.', 'Mantener cada escenario enfocado.'], notes: 'Esto permite fallos rápidos y diagnósticos claros.'},
  {kicker: 'AAA', title: 'Arrange, Act, Assert da estructura a cada prueba.', diagram: 'Arrange → entradas y dependencias\nAct → ejecutar el caso de uso\nAssert → comprobar resultado o efecto', notes: 'Evita combinar reglas no relacionadas en una sola prueba.'},
  {kicker: 'Doble de prueba', title: 'Un repositorio simulado reemplaza el adaptador técnico.', code: "const courses = {\n  findById: jest.fn(),\n  save: jest.fn(),\n};\n\n{ provide: COURSE_REPOSITORY, useValue: courses }", notes: 'El doble controla lo que devuelve findById y permite observar save.'},
  {kicker: 'Éxito', title: 'El nombre de la prueba explica la política.', code: "it('allows the owner teacher to update a course', async () => {\n  courses.findById.mockResolvedValue(course);\n  courses.save.mockImplementation(async (value) => value);\n\n  const result = await useCase.execute(7, changes, actor);\n\n  expect(result.title).toBe('NestJS avanzado');\n  expect(courses.save).toHaveBeenCalledWith(course);\n});", notes: 'No hace falta iniciar una aplicación ni conectar la base.'},
  {kicker: 'Rechazo', title: 'Una regla de seguridad también debe impedir guardar.', code: "await expect(useCase.execute(7, changes, otherTeacher))\n  .rejects.toThrow(ForbiddenException);\n\nexpect(courses.save).not.toHaveBeenCalled();", notes: 'Verificar solo el 403 sería insuficiente si los datos ya cambiaron.'},
  {kicker: 'Matriz mínima', title: 'Prueba éxito, ausencia y rechazo.', bullets: ['Docente propietario → actualiza.', 'Curso inexistente → 404.', 'Docente distinto → 403 y sin save.', 'Administrador → actualiza según la política.'], notes: 'Haz fallar una expectativa intencionalmente para comprobar que la prueba protege algo.'},
  {kicker: 'Salida', title: 'Prueba la regla, no la infraestructura.', statement: 'Ejecuta el conjunto de Jest y registra cómo correrlo en el README.', notes: 'Cierre: explica por qué PostgreSQL no es necesario para esta prueba.'},
];

export default function Semana12Sesion23() { return <SlideDeck slides={slides} session="Semana 12 · Sesión 23" />; }
