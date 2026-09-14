---
sidebar_position: 3
---

# Sesión 8 · CRUD persistente con repositorios

**Duración:** 2 horas.  
**Meta:** reemplazar el arreglo temporal por un repositorio TypeORM sin cambiar el contrato de `/courses`.

[Abrir presentación navegable de la Sesión 8](/diapositivas/semana-04-sesion-08)

## Introducción · 10 min

La entidad define qué se guarda; el repositorio permite consultarla y modificarla. El objetivo no es reescribir los controladores, sino cambiar la implementación interna de forma segura.

## Marco conceptual · 24 min (20%)

Material oficial: [repositorios TypeORM en Nest](https://docs.nestjs.com/techniques/database#repository-pattern) y [operaciones de repositorio](https://typeorm.io/docs/working-with-entity-manager/working-with-repository/).

### Diapositiva 1 · Registrar e inyectar

`TypeOrmModule.forFeature([Course])` hace disponible el repositorio de la entidad dentro de `CoursesModule`. `@InjectRepository(Course)` lo entrega al servicio.

### Diapositiva 2 · Cambia el almacenamiento, no la ruta

| Antes | Después |
| --- | --- |
| `this.courses.find(...)` | `repository.findOneBy(...)` |
| `this.courses.push(...)` | `repository.create()` y `repository.save()` |
| Se pierde al reiniciar | Permanece en PostgreSQL |

### Diapositiva 3 · Verificar persistencia

Una prueba importante crea un curso, reinicia el servidor y vuelve a consultar. Si el recurso sigue allí, ya no dependemos del arreglo en memoria.

## Desarrollo · ejemplo guiado · 36 min (30%)

### `src/courses/courses.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // 1
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
```

1. Registra el repositorio de `Course` solamente en el módulo que lo necesita.

### `src/courses/courses.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private readonly courses: Repository<Course>) {} // 1

  findAll(level?: string) { // 2
    return this.courses.find({ where: level ? { level } : {} }); // 3
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courses.findOneBy({ id: Number(id) }); // 4
    if (!course) throw new NotFoundException(`Course ${id} not found`); // 5
    return course;
  }

  create(dto: CreateCourseDto) { return this.courses.save(this.courses.create(dto)); } // 6

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.findOne(id); // 7
    return this.courses.save(Object.assign(course, dto)); // 8
  }

  async remove(id: string) {
    const course = await this.findOne(id); // 9
    await this.courses.remove(course); // 10
    return course;
  }
}
```

1. Recibe el repositorio administrado por TypeORM.
2–3. Consulta todos los cursos o filtra por nivel.
4–5. Busca por clave primaria y conserva el 404 del contrato anterior.
6. Construye y guarda la entidad nueva.
7–8. Recupera, cambia y guarda.
9–10. Recupera y elimina la entidad existente.

Los métodos asíncronos devuelven promesas; Nest espera su resultado y lo convierte en la respuesta HTTP. El controlador puede conservar sus rutas y DTOs.

## Cierre · 10 min

Haz una revisión por pares: ¿el controlador tuvo que aprender SQL? ¿En qué línea se decide el 404? ¿qué prueba demuestra que la persistencia funciona de verdad?

## Proyecto integrador · 60 min (50%)

1. Registra `Course` con `TypeOrmModule.forFeature`.
2. Inyecta `Repository<Course>` en `CoursesService`.
3. Sustituye cada operación del arreglo temporal por operaciones del repositorio.
4. Verifica todos los endpoints del CRUD y reinicia el servidor para confirmar persistencia.
5. Actualiza README: requisitos de PostgreSQL, variables de entorno y endpoints. Haz commit y push sin `.env`.

**Criterio de salida:** el CRUD de `/courses` conserva su contrato HTTP y los datos permanecen tras reiniciar la API.
