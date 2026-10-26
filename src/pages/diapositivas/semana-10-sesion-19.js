import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 10', title: 'Un token válido identifica; no concede permisos.', statement: 'Sesión 19 · Roles, permisos y propiedad de recursos.', notes: 'Parte de la diferencia entre identidad válida y acción permitida.'},
  {kicker: 'Objetivo', title: 'Autorizaremos cada acción de forma explícita.', bullets: ['Modelar roles cerrados.', 'Declarar políticas con @Roles().', 'Detener accesos con RolesGuard.', 'Comprobar propiedad en la regla de negocio.'], notes: 'JWT de la semana 9 es requisito.'},
  {kicker: 'Respuestas', title: '401 y 403 responden preguntas distintas.', diagram: '¿La identidad es válida?\n  No → 401 Unauthorized\n  Sí\n  ↓\n¿Tiene permiso?\n  No → 403 Forbidden\n  Sí → continúa', notes: 'Un 403 implica que la API ya conoce a quien hace la petición.'},
  {kicker: 'Modelo', title: 'Un enum evita privilegios escritos de maneras distintas.', code: "export enum UserRole {\n  ADMIN = 'admin',\n  TEACHER = 'teacher',\n  STUDENT = 'student',\n}\n\n@Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })\nrole: UserRole;", notes: 'El valor por defecto debe ser el de menor privilegio.'},
  {kicker: 'Política', title: 'El decorador expresa qué roles puede usar una ruta.', code: "export const ROLES_KEY = 'roles';\nexport const Roles = (...roles: UserRole[]) =>\n  SetMetadata(ROLES_KEY, roles);\n\n@Roles(UserRole.ADMIN)", notes: 'El decorador solo registra metadatos: no verifica permisos por sí mismo.'},
  {kicker: 'Guard', title: 'RolesGuard lee la política después de validar el JWT.', code: 'const roles = this.reflector.getAllAndOverride<UserRole[]>(\n  ROLES_KEY, [context.getHandler(), context.getClass()],\n);\nif (!roles) return true;\n\nconst { user } = context.switchToHttp().getRequest();\nreturn roles.includes(user.role);', notes: 'Primero JwtAuthGuard para obtener request.user; después RolesGuard.'},
  {kicker: 'Propiedad', title: 'Un rol no basta cuando importa quién creó el recurso.', bullets: ['Admin: puede modificar cualquier curso.', 'Docente: solo cursos creados por su cuenta.', 'Estudiante: no modifica cursos.', 'La comprobación vive en el caso de uso o servicio.'], notes: 'El guard no conoce el recurso sin consultarlo; la regla depende del caso concreto.'},
  {kicker: 'Salida', title: 'Autorización = identidad + política + contexto.', statement: 'Protege una ruta administrativa, una ruta de docente y prueba los casos 401, 403 y permitido.', notes: 'Pide que cada persona defienda una fila de su matriz de acceso.'},
];

export default function Semana10Sesion19() { return <SlideDeck slides={slides} session="Semana 10 · Sesión 19" />; }
