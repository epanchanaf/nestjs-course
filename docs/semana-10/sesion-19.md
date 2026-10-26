---
sidebar_position: 2
---

# Sesión 19 · Roles permisos y propiedad de recursos

[Abrir presentación navegable de la Sesión 19](/diapositivas/semana-10-sesion-19)

**Duración:** 2 horas.  
**Meta:** autorizar acciones con roles y comprobar que una persona solo modifica recursos sobre los que tiene permiso.

## Prerrequisitos y materiales

Debes tener el JWT de la Semana 9 funcionando. Conserva tres cuentas de práctica: una administradora, una docente y una estudiante. Nunca reutilices contraseñas o tokens de servicios reales.

## Agenda

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–15 | Situación inicial | Distinguir `401` de `403`. |
| 15–35 | Marco conceptual | Comprender rol, permiso y propiedad. |
| 35–65 | Demostración guiada | Añadir rol a `User` y crear `@Roles()`. |
| 65–100 | Práctica guiada | Proteger rutas y comprobar propiedad. |
| 100–110 | Actividad autónoma | Diseñar una matriz de acceso. |
| 110–120 | Cierre | Defender una decisión de autorización. |

## Introducción

Un JWT válido prueba que la solicitud tiene una identidad. No demuestra que esa identidad pueda borrar un curso o cambiar la matrícula de otra persona. Si una ruta acepta cualquier token válido para realizar acciones administrativas, la API queda autenticada pero no autorizada.

| Respuesta | Significado | Ejemplo |
| --- | --- | --- |
| `401 Unauthorized` | No existe una identidad válida. | Falta el token o su firma no es válida. |
| `403 Forbidden` | La identidad existe, pero no tiene permiso. | Un estudiante intenta borrar un curso. |

## Marco conceptual

### Rol permiso y propiedad

- Un **rol** agrupa responsabilidades generales: `admin`, `teacher` o `student`.
- Un **permiso** representa una acción concreta: crear, actualizar o eliminar un curso.
- La **propiedad** responde si el recurso pertenece a la identidad actual. Un docente puede tener permiso para editar cursos, pero solo los que creó.

En un sistema pequeño, un rol puede bastar. Cuando una regla depende del recurso concreto, se añade una comprobación de propiedad dentro del caso de uso o servicio. Un `RolesGuard` no puede saber por sí solo quién creó un curso si no consulta ese curso.

### Paso 1 · Modelar roles de forma cerrada

```ts
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
role: UserRole;
```

Una enumeración evita valores ambiguos como `administrator`, `Admin` y `admin`. El valor por defecto debe ser el de menor privilegio: una cuenta nueva no recibe permisos administrativos por accidente.

### Paso 2 · Declarar la intención con un decorador

```ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

`@Roles(UserRole.ADMIN)` no concede nada todavía. Solo deja escrita la política junto a la ruta. El guard será quien lea esa información y detenga la solicitud cuando corresponda.

### Paso 3 · Crear un guard de roles

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!roles) return true;

    const request = context.switchToHttp().getRequest<{ user: { role: UserRole } }>();
    return roles.includes(request.user.role);
  }
}
```

Este guard supone que `JwtAuthGuard` ya verificó el token y dejó `request.user`. Por ello el orden importa: primero identidad; después permiso.

### Paso 4 · Aplicar la política a una ruta

```ts
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
remove(@Param('id', ParseIntPipe) id: number) {
  return this.coursesService.remove(id);
}
```

Un token ausente obtiene `401`. Un token de estudiante válido obtiene `403`. Un token de administrador válido continúa hacia el servicio.

### Propiedad en el servicio

```ts
async update(id: number, dto: UpdateCourseDto, actor: AuthenticatedUser) {
  const course = await this.findOneOrFail(id);
  const canManageAny = actor.role === UserRole.ADMIN;
  const isOwner = course.createdByUserId === actor.id;

  if (!canManageAny && !isOwner) {
    throw new ForbiddenException('You cannot modify this course');
  }
  Object.assign(course, dto);
  return this.coursesRepository.save(course);
}
```

La comprobación de propiedad vive cerca de la regla de negocio y no se confía en un `ownerId` que el cliente pueda enviar en el cuerpo HTTP.

## Práctica guiada

1. Añade el rol con valor por defecto `student` y asigna roles de práctica de forma controlada en tu base local.
2. Protege `DELETE /courses/:id` para administradores.
3. Protege `PATCH /courses/:id` para administradores o para el docente propietario.
4. Prueba la matriz: sin token (`401`), estudiante (`403`), docente ajeno (`403`), docente propietario (`200`) y administrador (`200`).
5. Documenta qué información mínima debe incorporar la identidad autenticada para evaluar estas reglas.

## Cierre

Explica por qué un token válido no basta para borrar un curso. ¿Qué riesgo aparece si el identificador del propietario se toma del cuerpo de la solicitud en vez del usuario autenticado?
