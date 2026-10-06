import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 6', title: 'Buscar datos relacionados exige una consulta compuesta.', statement: 'Sesión 12 · QueryBuilder, JOIN y búsqueda segura.', notes: 'Parte de matrículas, estudiantes y cursos persistentes.' },
  { kicker: 'Objetivo', title: 'Consultaremos matrículas con contexto.', bullets: ['Cargar Student y Course.', 'Buscar por nombre o título.', 'Combinar filtros opcionales.', 'Paginar sin construir SQL inseguro.'], notes: 'QueryBuilder es una herramienta para consultas más expresivas, no un reemplazo automático de find.' },
  { kicker: 'Modelo', title: 'Enrollment conecta dos recursos.', diagram: 'Enrollment ──join──> Student\n     │\n     └──join──> Course', notes: 'Cada alias nombra una tabla dentro de la consulta.' },
  { kicker: 'QueryBuilder', title: 'Partimos de la entidad que listamos.', code: "const qb = repository\n  .createQueryBuilder('enrollment')\n  .leftJoinAndSelect('enrollment.student', 'student')\n  .leftJoinAndSelect('enrollment.course', 'course');", notes: 'leftJoinAndSelect carga la información que la respuesta necesita.' },
  { kicker: 'Búsqueda segura', title: 'El texto es un valor, nunca una instrucción SQL.', code: "qb.andWhere(\n  '(student.name ILIKE :search OR course.title ILIKE :search)',\n  { search: `%${query.search.trim()}%` },\n);", notes: 'El placeholder protege también comillas y valores maliciosos.' },
  { kicker: 'Filtros', title: 'Cada condición se agrega solo si llegó.', code: "if (query.studentId)\n  qb.andWhere('student.id = :studentId', { studentId });\nif (query.activeOnly === 'true')\n  qb.andWhere('student.isActive = :active', { active: true });", notes: 'Boolean("false") sería true: interpreta el texto explícitamente.' },
  { kicker: 'Página', title: 'La consulta relacionada conserva el mismo contrato.', code: "qb.orderBy('enrollment.id', 'ASC')\n  .skip((page - 1) * limit)\n  .take(limit);\nconst [items, total] = await qb.getManyAndCount();", notes: 'Un orden fijo sigue siendo indispensable.' },
  { kicker: 'Resultado vacío', title: 'Una búsqueda sin coincidencias no es un 404.', bullets: ['GET /enrollments existe.', 'La colección puede estar vacía.', 'Responde 200.', 'items: [] y total: 0.'], notes: '404 se reserva para un recurso individual inexistente.' },
  { kicker: 'Práctica · 40 min', title: 'Combina relaciones y condiciones.', bullets: ['Crea EnrollmentsQueryDto.', 'Añade JOINs.', 'Incluye búsqueda parametrizada.', 'Agrega filtros y página.', 'Prueba una entrada parecida a SQL.'], notes: 'Criterio: condiciones combinables y búsqueda segura.' },
  { kicker: 'Cierre', title: 'QueryBuilder expresa intención sin abandonar TypeORM.', statement: 'Cuando la consulta crece, alias, JOIN y parámetros mantienen el código legible y seguro.', notes: 'La siguiente semana separa esta configuración del código.' },
];

export default function Semana06Sesion12() { return <SlideDeck slides={slides} session="Semana 6 · Sesión 12" />; }
