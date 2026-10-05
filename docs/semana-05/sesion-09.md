---
sidebar_position: 2
---

# Sesión 9 · Persistir estudiantes con TypeORM

**Duración:** 2 horas.
**Meta:** sustituir el arreglo temporal de `StudentsService` por un repositorio TypeORM y preservar las reglas de estudiantes, incluido el correo único.

[Abrir presentación navegable de la Sesión 9](/diapositivas/semana-05-sesion-09)

## Antes de empezar

Debes tener PostgreSQL configurado y el CRUD persistente de `courses` de la Semana 4 funcionando. También debes tener el módulo `students` construido en la práctica de la Semana 3: sus DTOs, filtros y reglas seguirán siendo parte del contrato. Antes de cambiar código, crea un estudiante, reinicia la API y comprueba que desaparece: esa evidencia confirma que `students` todavía vive en memoria.

## Introducción · 10 min

Una API integrada no puede tratar a cursos como datos duraderos y a estudiantes como datos temporales. La persistencia debe avanzar módulo por módulo sin convertir el controlador en una capa de SQL ni perder reglas ya acordadas.

Hoy el servicio seguirá recibiendo DTOs y respondiendo con los mismos códigos HTTP. Cambiaremos la fuente de datos: el arreglo y `nextId` desaparecen, PostgreSQL genera el identificador y una restricción de unicidad protege el correo incluso si dos solicitudes llegan casi al mismo tiempo.

## Marco conceptual · 24 min (20%)

Material oficial: [entidades y repositorios de Nest](https://docs.nestjs.com/techniques/database), [decoradores de entidades de TypeORM](https://typeorm.io/docs/help/decorator-reference/) y [restricciones en PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html).

### Diapositiva 1 · La misma arquitectura, otra entidad

```text
StudentsController → StudentsService → Repository<Student> → students
```

El controlador conserva rutas, DTOs y validación. El repositorio es el único componente que conoce cómo leer y guardar filas de `students`.

### Diapositiva 2 · Dos defensas para un correo único

| Capa | Responsabilidad |
| --- | --- |
| Servicio | Detectar el conflicto y devolver un `409 Conflict` comprensible. |
| Base de datos | Impedir definitivamente dos filas con el mismo correo. |

Validar primero en el servicio mejora el mensaje para quien usa la API. La restricción `unique` no es redundante: protege la integridad cuando hay concurrencia o alguna ruta futura olvida hacer la comprobación.

### Diapositiva 3 · Entidad, DTO y regla de negocio

- `CreateStudentDto` decide qué JSON puede crear un estudiante.
- `Student` describe la tabla y sus columnas.
- `StudentsService` decide si una operación es válida, por ejemplo si el correo ya está ocupado o un estudiante inactivo puede eliminarse.

Una entidad no sustituye a los DTOs. La columna `email` puede tener una restricción de unicidad y el DTO sigue validando que el dato sea un correo con el formato esperado.

### Vocabulario esencial

- **Restricción de unicidad:** regla que impide repetir un valor o combinación de valores dentro de una tabla.
- **Integridad de datos:** propiedades que la base de datos debe conservar aunque la aplicación reciba varias solicitudes o reinicie.
- **Índice único:** estructura que PostgreSQL usa para hacer cumplir una restricción de unicidad y buscar eficientemente ese valor.
- **Valor por defecto:** valor que se asigna al guardar una fila cuando la aplicación no proporciona uno; aquí `isActive` comienza en `true`.

## Desarrollo · ejemplo guiado · 36 min (30%)

### Paso 1 · Crear la entidad `Student`

`src/students/entities/student.entity.ts`:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column()
  career: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ default: true })
  isActive: boolean;
}
```

`unique: true` traduce una regla del dominio a una garantía de PostgreSQL. Los valores de tipo `int` hacen explícito que `age` y `semester` no son texto. Mantén las mismas reglas de rango en los DTOs; el tipo de columna no sabe, por sí solo, que un semestre debe estar entre 1 y 10.

### Paso 2 · Registrar la entidad y el repositorio

En `src/app.module.ts`, agrega `Student` a las entidades de la conexión existente:

```ts
entities: [Course, Student],
```

En `src/students/students.module.ts`, habilita el repositorio dentro del módulo:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
```

La entidad se registra en la conexión una sola vez; `forFeature` entrega su repositorio exclusivamente al módulo que lo necesita. Al iniciar con `synchronize: true` en desarrollo, TypeORM creará la tabla `students` y su restricción única.

### Paso 3 · Reemplazar el arreglo en `StudentsService`

Elimina el arreglo temporal y `nextId`. Inyecta `Repository<Student>` y conserva el nombre de tus DTOs existentes:

```ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(`Student ${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    await this.ensureEmailAvailable(dto.email);
    return this.studentsRepository.save(this.studentsRepository.create(dto));
  }

  private async ensureEmailAvailable(email: string, currentId?: number) {
    const existing = await this.studentsRepository.findOneBy({ email });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('Email already belongs to another student');
    }
  }
}
```

La comprobación previa ofrece un `409` claro. Como la base también tiene `unique: true`, deja registrado en el README que una violación de esa restricción debe transformarse a un `409` si ocurre durante una carrera entre solicitudes. Esa conversión puede hacerse con una excepción específica o un filtro de errores; no ocultes un error de integridad como si fuera un `500` sin contexto.

### Paso 4 · Trasladar los métodos restantes

| Método en memoria | Sustitución persistente | Regla que se conserva |
| --- | --- | --- |
| `students.filter(...)` | `studentsRepository.find({ where })` | Los filtros `career`, `semester` e `isActive` siguen siendo opcionales y combinables. |
| `students.find(...)` | `findOneBy({ id })` | Un id inexistente responde `404`. |
| `Object.assign(...)` | Buscar, asignar y `save(...)` | Si cambia el correo, comprobar unicidad antes de guardar. |
| `splice(...)` | Buscar, comprobar que está activo y `remove(...)` | No se elimina un estudiante inactivo. |

Para filtros opcionales, construye un objeto `where` solo con los valores que llegaron. Evita convertir accidentalmente el texto `"false"` en un booleano verdadero: usa el Pipe o transformación que ya definiste para el query string.

### Prueba de persistencia y unicidad

```http
POST http://localhost:3000/students
Content-Type: application/json

{
  "name": "Ana Torres",
  "email": "ana.torres@example.edu",
  "age": 20,
  "career": "Software",
  "semester": 4,
  "isActive": true
}
```

1. Conserva el `id` recibido y reinicia la API.
2. Consulta `GET /students/:id`: el estudiante debe continuar disponible.
3. Repite el `POST` con el mismo correo y datos válidos: debe responder `409 Conflict`.
4. Prueba filtros individuales y combinados; por ejemplo `GET /students?career=Software&isActive=true`.
5. Desactiva el estudiante e intenta eliminarlo: la regla existente debe seguir rechazando la operación.

## Cierre · 10 min

Explica por qué la validación de correo del DTO no basta para la unicidad. ¿Qué cambia en la API visible para el cliente al sustituir el arreglo? ¿Qué debe ocurrir al reiniciar el servidor?

## Proyecto integrador · 60 min (50%)

1. Crea `Student` con todas las propiedades de la práctica anterior y una restricción única para `email`.
2. Registra la entidad en la conexión y habilita `Repository<Student>` en `StudentsModule`.
3. Sustituye el arreglo y el contador temporal en todos los métodos del servicio.
4. Mantén las reglas: correo único, semestre válido, existencia antes de operar y prohibición de eliminar estudiantes inactivos.
5. Demuestra crear, filtrar, actualizar, reiniciar, consultar y provocar un `409` por correo repetido.

**Criterio de salida:** `students` persiste tras reiniciar, el correo no puede repetirse y los endpoints ya existentes conservan sus validaciones, filtros y respuestas HTTP.

## Tarea opcional

Agrega un índice no único para el filtro más frecuente de tu grupo, por ejemplo `career` e `isActive`. Explica en el README qué consulta pretende acelerar y por qué no debe agregarse un índice por costumbre sin medir las necesidades reales.
