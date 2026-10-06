import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 6', title: 'Una lista útil no devuelve todo.', statement: 'Sesión 11 · Filtros, paginación y ordenamiento para cursos.', notes: 'Conecta con la base persistente: el problema ahora es recuperar datos de forma útil.' },
  { kicker: 'Objetivo', title: 'Construiremos un GET /courses predecible.', bullets: ['Filtrar por nivel.', 'Paginar con page y limit.', 'Ordenar por una lista permitida.', 'Devolver items y metadatos.'], notes: 'El mismo patrón podrá reutilizarse en otros recursos.' },
  { kicker: 'Contrato', title: 'Cada parámetro tiene una responsabilidad.', code: 'GET /courses?level=beginner&page=2&limit=5&sortBy=title&order=ASC', notes: 'Filtro reduce resultados; paginación toma una ventana; orden fija el recorrido.' },
  { kicker: 'DTO', title: 'La URL también se valida.', code: '@Type(() => Number) @IsInt() @Min(1)\npage = 1;\n\n@Max(50)\nlimit = 10;\n\n@IsIn([\'id\', \'title\', \'level\'])\nsortBy = \'id\';', notes: 'Los query params son texto: Type los transforma antes de validar.' },
  { kicker: 'Seguridad', title: 'Nunca ordenes por un campo arbitrario.', bullets: ['Los valores se pueden parametrizar.', 'Los nombres de columna no.', 'Usa IsIn con una lista cerrada.', 'Rechaza un campo no permitido con 400.'], notes: 'No aceptes sortBy tal como llega desde el cliente.' },
  { kicker: 'Repositorio', title: 'findAndCount entrega página y total.', code: 'const [items, total] = await repository.findAndCount({\n  where: level ? { level } : {},\n  order: { [sortBy]: order },\n  skip: (page - 1) * limit,\n  take: limit,\n});', notes: 'Explica la fórmula con page 1 y 2, limit 5.' },
  { kicker: 'Respuesta', title: 'La colección incluye contexto para navegar.', code: '{\n  items: [...],\n  meta: { total, page, limit, totalPages }\n}', notes: 'total no es necesariamente igual a items.length.' },
  { kicker: 'Prueba', title: 'Los casos límite son parte del contrato.', bullets: ['page=0 → 400', 'limit=200 → 400', 'sortBy=createdAt → 400', 'Sin parámetros → primera página ordenada.', 'Dos páginas → sin repeticiones.'], notes: 'Pide que prueben tanto una respuesta válida como una inválida.' },
  { kicker: 'Práctica · 40 min', title: 'Haz navegable el listado de cursos.', bullets: ['Crea CoursesQueryDto.', 'Conecta Query al controller.', 'Usa findAndCount.', 'Prueba filtros y páginas.', 'Documenta una URL en README.'], notes: 'Criterio: items + meta, límite máximo 50 y orden estable.' },
  { kicker: 'Cierre', title: '¿Por qué ordenar aun sin que lo pidan?', statement: 'Porque una página sin orden estable puede cambiar y repetir u ocultar resultados.', notes: 'Enlaza con la sesión 12: búsqueda y relaciones.' },
];

export default function Semana06Sesion11() { return <SlideDeck slides={slides} session="Semana 6 · Sesión 11" />; }
