---
sidebar_position: 3
---

# Sesión 22 · Casos de uso repositorios y adaptadores

[Abrir presentación navegable de la Sesión 22](/diapositivas/semana-11-sesion-22)

**Duración:** 2 horas.  
**Meta:** separar una regla de negocio de HTTP y TypeORM para que sea comprensible, reutilizable y comprobable con pruebas.

## Introducción

En un proyecto pequeño, un servicio de NestJS puede llamar directamente a un repositorio TypeORM. Al crecer, ese servicio suele acumular autorización, reglas, consultas y detalles de infraestructura. El problema no es TypeORM; el problema aparece cuando una regla importante no puede entenderse ni probarse sin levantar HTTP y PostgreSQL.

## Marco conceptual

### Arquitectura en capas aplicada a CourseHub

```text
HTTP Controller
      ↓
UpdateCourseUseCase        ← regla de negocio
      ↓
CourseRepository (puerto)  ← contrato que necesita la regla
      ↓
TypeOrmCourseRepository    ← adaptador técnico
      ↓
PostgreSQL
```

El controlador conoce HTTP. El caso de uso conoce la decisión de negocio. El adaptador conoce TypeORM. La dirección evita que la regla central dependa del detalle técnico.

### SOLID en lenguaje práctico

| Principio | Pregunta útil |
| --- | --- |
| Responsabilidad única | ¿Esta clase cambia por una sola razón clara? |
| Abierto/cerrado | ¿Puedo añadir una variante sin romper casos existentes? |
| Sustitución | ¿Una implementación del contrato puede reemplazar a otra? |
| Segregación | ¿El contrato pide solo los métodos que realmente necesita? |
| Inversión de dependencias | ¿La regla depende de un contrato en vez de TypeORM directamente? |

### Paso 1 · Definir el puerto

```ts
export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseRepository {
  findById(id: number): Promise<Course | null>;
  save(course: Course): Promise<Course>;
}
```

El puerto es pequeño porque el caso de uso solo necesita encontrar y guardar. No se crea una interfaz enorme por costumbre.

### Paso 2 · Escribir el caso de uso

```ts
@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
  ) {}

  async execute(id: number, changes: UpdateCourseDto, actor: AuthenticatedUser) {
    const course = await this.courses.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    if (actor.role !== UserRole.ADMIN && course.createdByUserId !== actor.id) {
      throw new ForbiddenException('You cannot modify this course');
    }
    Object.assign(course, changes);
    return this.courses.save(course);
  }
}
```

Ahora la política de propiedad queda en una unidad con un nombre claro. En la Semana 12 podrá probarse con un repositorio falso, sin una base real.

### Paso 3 · Adaptar TypeORM

```ts
@Injectable()
export class TypeOrmCourseRepository implements CourseRepository {
  constructor(@InjectRepository(Course) private readonly repository: Repository<Course>) {}

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  save(course: Course) {
    return this.repository.save(course);
  }
}
```

El adaptador traduce el contrato a la biblioteca. Si el almacenamiento cambia, se modifica el adaptador y no cada controlador ni cada regla.

## Práctica guiada

1. Elige una operación existente, preferiblemente actualizar un curso.
2. Mueve su regla de propiedad a un caso de uso.
3. Define solo los métodos de repositorio que necesita ese caso.
4. Implementa el adaptador TypeORM y regístralo con `provide` y `useClass`.
5. Conserva el contrato HTTP del controlador: la refactorización no debe cambiar la API por accidente.

## Cierre

Explica qué clase cambiaría si se reemplaza TypeORM y cuál si cambia la regla «solo el propietario puede editar». Si ambas respuestas son la misma clase, la separación todavía necesita revisión.
