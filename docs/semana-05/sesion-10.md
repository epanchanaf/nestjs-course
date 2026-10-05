---
sidebar_position: 3
---

# Sesión 10 · Matrículas como relaciones persistentes

**Duración:** 2 horas.
**Meta:** representar cada matrícula en PostgreSQL como una relación entre un estudiante y un curso, evitando duplicados y devolviendo datos relacionados en las consultas.

[Abrir presentación navegable de la Sesión 10](/diapositivas/semana-05-sesion-10)

## Antes de empezar

Completa la Sesión 9: deben existir las entidades y repositorios persistentes de `Course` y `Student`. También debes conservar el módulo `enrollments` construido en la práctica de integración: hasta ahora administraba un arreglo con `studentId` y `courseId`, comprobaba que ambos recursos existieran, impedía duplicados y rechazaba estudiantes inactivos.

## Introducción · 10 min

Una matrícula no es solo un objeto con dos números: expresa que un estudiante concreto se inscribió en un curso concreto. Una base relacional puede guardar ese hecho y, al mismo tiempo, impedir referencias a recursos inexistentes.

Modelaremos `Enrollment` como una entidad propia. Esta elección permite que la matrícula tenga identificador, fecha, estado u otros datos en el futuro. No usaremos una relación automática de muchos a muchos porque necesitamos tratar la matrícula como un recurso de la API que se crea, consulta y cancela.

## Marco conceptual · 24 min (20%)

Material oficial: [relaciones en TypeORM](https://typeorm.io/docs/relations/relations/), [relaciones en Nest](https://docs.nestjs.com/techniques/database#relations) y [claves foráneas en PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK).

### Diapositiva 1 · La relación de CourseHub

```text
Student 1 ──── * Enrollment * ──── 1 Course
```

Cada matrícula tiene un estudiante y un curso. Un estudiante puede tener muchas matrículas; un curso también. Es una relación muchos-a-muchos representada mediante una entidad intermedia con identidad propia.

### Diapositiva 2 · La base protege vínculos válidos

| Regla | Mecanismo |
| --- | --- |
| La matrícula referencia un estudiante existente | Clave foránea `student_id`. |
| La matrícula referencia un curso existente | Clave foránea `course_id`. |
| No se repite la misma pareja | Restricción única compuesta. |
| La API muestra una explicación útil | Validación en `EnrollmentsService` y excepciones HTTP. |

La clave foránea evita filas huérfanas. El servicio sigue comprobando primero para decidir si corresponde un `404`, un `409` o un `400` por estudiante inactivo.

### Diapositiva 3 · Cargar la relación no es automático

Una consulta de matrículas puede devolver solo claves foráneas o también los objetos `student` y `course`. Para incluir los datos relacionados se solicita de forma explícita con `relations`. Así se evita cargar información innecesaria en cada consulta.

### Vocabulario esencial

- **Clave foránea:** columna que referencia la clave primaria de otra tabla.
- **Relación `ManyToOne`:** muchas matrículas apuntan a un estudiante; muchas matrículas apuntan a un curso.
- **Relación `OneToMany`:** vista inversa: un estudiante o curso tiene una colección de matrículas.
- **Restricción única compuesta:** regla que impide repetir una combinación, aquí estudiante + curso.
- **Entidad intermedia:** entidad que representa el vínculo entre otras dos y puede tener datos propios.

## Desarrollo · ejemplo guiado · 36 min (30%)

### Paso 1 · Declarar `Enrollment`

`src/enrollments/entities/enrollment.entity.ts`:

```ts
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('enrollments')
@Unique(['student', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
```

`@Unique(['student', 'course'])` protege la misma regla que antes buscaba en el arreglo: un estudiante no puede estar dos veces en el mismo curso. `onDelete: 'RESTRICT'` evita borrar un curso o estudiante que aún tenga matrículas. Si el producto necesita otro comportamiento —por ejemplo, cancelar automáticamente matrículas— debe decidirse y probarse explícitamente, no aparecer por accidente.

### Paso 2 · Añadir los lados inversos

Agrega estas propiedades a las entidades ya persistentes:

```ts
// student.entity.ts
@OneToMany(() => Enrollment, (enrollment) => enrollment.student)
enrollments: Enrollment[];

// course.entity.ts
@OneToMany(() => Enrollment, (enrollment) => enrollment.course)
enrollments: Enrollment[];
```

Importa `OneToMany` y `Enrollment` en ambas entidades. Los callbacks `() => Enrollment` impiden que TypeScript necesite resolver la clase demasiado pronto. En `AppModule`, registra las tres entidades:

```ts
entities: [Course, Student, Enrollment],
```

### Paso 3 · Dar repositorios al módulo de matrículas

`src/enrollments/enrollments.module.ts`:

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
```

El módulo de matrículas orquesta la regla que conecta los tres recursos, por eso necesita sus repositorios. No agrega SQL al controlador: el controlador continúa traduciendo HTTP y entrega DTOs validados al servicio.

### Paso 4 · Crear una matrícula con reglas de negocio

```ts
async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
  const student = await this.studentsRepository.findOneBy({ id: dto.studentId });
  if (!student) throw new NotFoundException(`Student ${dto.studentId} not found`);
  if (!student.isActive) throw new BadRequestException('Inactive students cannot enroll');

  const course = await this.coursesRepository.findOneBy({ id: dto.courseId });
  if (!course) throw new NotFoundException(`Course ${dto.courseId} not found`);

  const duplicate = await this.enrollmentsRepository.findOne({
    where: { student: { id: student.id }, course: { id: course.id } },
  });
  if (duplicate) throw new ConflictException('Student is already enrolled in this course');

  return this.enrollmentsRepository.save(
    this.enrollmentsRepository.create({ student, course }),
  );
}
```

El DTO mantiene los identificadores de entrada porque ese es el contrato HTTP sencillo que ya conoces. La entidad, en cambio, guarda objetos relacionados. Después de buscar los recursos, TypeORM obtiene las claves foráneas correctas al guardar `{ student, course }`.

### Paso 5 · Consultar matrículas con sus recursos

```ts
findAll(studentId?: number, courseId?: number) {
  return this.enrollmentsRepository.find({
    where: {
      ...(studentId ? { student: { id: studentId } } : {}),
      ...(courseId ? { course: { id: courseId } } : {}),
    },
    relations: { student: true, course: true },
    order: { id: 'ASC' },
  });
}
```

Con esta consulta, `GET /enrollments?studentId=1&courseId=2` puede devolver una matrícula junto con el estudiante y curso asociados. Ajusta el controlador existente para transformar y validar los parámetros opcionales; no compares texto de query string directamente con identificadores numéricos.

Para cancelar una matrícula, primero busca por `id`; si no existe responde `404`. Luego ejecuta `remove`. Al cancelar, no se elimina el estudiante ni el curso: solo desaparece el vínculo entre ambos.

### Prueba completa de relación

1. Crea un curso y un estudiante activo persistentes; anota sus identificadores.
2. Registra `POST /enrollments` con esos ids. Debe responder `201`.
3. Consulta `GET /enrollments?studentId=<id>` y verifica que trae ese vínculo y los datos relacionados.
4. Repite el `POST` con la misma pareja: debe responder `409 Conflict`.
5. Desactiva el estudiante y prueba una matrícula en otro curso: debe responder `400 Bad Request`.
6. Reinicia la API, consulta de nuevo y cancela la matrícula con `DELETE /enrollments/:id`.

## Cierre · 10 min

¿Por qué una tabla de matrículas es preferible a guardar un arreglo de ids dentro de `Student`? ¿Qué regla protege la aplicación y cuál protege PostgreSQL? ¿Qué información debe devolver una consulta de matrículas para que sea útil sin exponer datos innecesarios?

## Proyecto integrador · 60 min (50%)

1. Crea `Enrollment` con sus relaciones obligatorias a `Student` y `Course`, y registra las tres entidades.
2. Agrega los lados inversos `enrollments` a `Student` y `Course`.
3. Reemplaza el arreglo temporal del módulo de matrículas por repositorios TypeORM.
4. Conserva las reglas: estudiante y curso existentes, estudiante activo y pareja estudiante–curso no repetida.
5. Implementa consultas filtrables y persistentes, y comprueba crear, consultar, reiniciar, rechazar duplicado y cancelar.

**Criterio de salida:** cada matrícula persiste como una relación válida entre estudiantes y cursos; no hay duplicados ni referencias huérfanas, y las rutas de matrícula siguen respondiendo con códigos HTTP coherentes.

## Tarea opcional

Añade `createdAt` a `Enrollment` con `@CreateDateColumn()`. Inclúyelo en la respuesta de `GET /enrollments` y ordena por fecha descendente. Explica por qué el servidor —no el cliente— debe registrar el momento real de creación.
