---
sidebar_position: 3
---

# Sesión 8 · CRUD persistente con repositorios

**Duración:** 2 horas.  
**Meta:** reemplazar el arreglo temporal por un repositorio TypeORM sin cambiar el contrato de `/courses`.

[Abrir presentación navegable de la Sesión 8](/diapositivas/semana-04-sesion-08)

## Antes de empezar

Completa primero la Sesión 7: PostgreSQL debe estar disponible, `.env` debe contener los valores correctos, la entidad `Course` debe existir y la tabla vacía `courses` debe aparecer en tu cliente de base de datos. Conserva tus DTOs y controladores de la Semana 3; en esta sesión no rediseñamos el contrato HTTP, cambiamos únicamente el lugar donde el servicio almacena los datos.

## Introducción · 10 min

La entidad define qué se guarda; el repositorio permite consultarla y modificarla. En la Sesión 7 dejamos lista una tabla vacía. Hoy esa tabla pasa a ser la fuente de datos de `CoursesService`.

Este es un principio importante de diseño: una ruta expresa qué puede hacer el cliente, mientras que el servicio decide cómo hacerlo. Por eso el cliente puede seguir usando `POST /courses` sin saber si detrás existe un arreglo, un archivo o PostgreSQL. Cambiar detalles internos sin romper a quien consume la API es una señal de buena separación de responsabilidades.

## Marco conceptual · 24 min (20%)

Material oficial: [repositorios TypeORM en Nest](https://docs.nestjs.com/techniques/database#repository-pattern) y [operaciones de repositorio](https://typeorm.io/docs/working-with-entity-manager/working-with-repository/).

### Diapositiva 1 · Registrar y recibir el repositorio

`Course` ya está registrada en la conexión creada en la Sesión 7. `TypeOrmModule.forFeature([Course])` hace disponible su repositorio dentro de `CoursesModule`; `@InjectRepository(Course)` se lo entrega al servicio. No creamos ese objeto con `new`: Nest y TypeORM lo preparan por nosotros.

### Diapositiva 2 · Cambia el almacenamiento, no la ruta

| Antes | Después |
| --- | --- |
| `this.courses.find(...)` | `coursesRepository.find(...)` |
| `this.courses.push(...)` | `coursesRepository.create()` y `coursesRepository.save()` |
| Se pierde al reiniciar | Permanece en PostgreSQL |

### Diapositiva 3 · Verificar persistencia

Una prueba importante crea un curso, reinicia el servidor y vuelve a consultar. Si el recurso sigue allí, ya no dependemos del arreglo en memoria.

### Del arreglo al repositorio, paso a paso

En la Semana 3 un servicio podía tener una propiedad como `private readonly courses: Course[] = [...]` y un contador `nextId`. Ambas piezas desaparecen: PostgreSQL genera el id y conserva las filas. Ahora `Repository<Course>` representa la puerta de acceso a la tabla.

| Necesidad | Arreglo temporal | Repositorio TypeORM | Idea principal |
| --- | --- | --- | --- |
| Listar | `courses.filter(...)` | `repository.find(...)` | Consulta varias filas. |
| Buscar uno | `courses.find(...)` | `repository.findOneBy(...)` | Consulta por id. |
| Crear | `push(...)` | `create(...)` + `save(...)` | Preparar y guardar son pasos distintos. |
| Actualizar | `Object.assign(...)` | `Object.assign(...)` + `save(...)` | El cambio solo es persistente después de guardar. |
| Eliminar | `splice(...)` | `remove(...)` | El repositorio escribe el cambio en la tabla. |

## Desarrollo · ejemplo guiado · 36 min (30%)

### Paso 1 · `src/courses/courses.module.ts`

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

1. Hace disponible el repositorio de `Course` solamente en el módulo que lo necesita.

`forFeature([Course])` no abre una segunda conexión ni crea otra tabla. Usa la conexión configurada en `AppModule` en la Sesión 7 y declara que `CoursesModule` necesita trabajar con el repositorio de esa entidad. Esta diferencia ayuda a leer la arquitectura: `forRoot` configura la aplicación; `forFeature` habilita su repositorio dentro de un módulo de negocio.

### Paso 2 · `src/courses/courses.service.ts`

Primero elimina la propiedad del arreglo temporal, `nextId` y cualquier interfaz `Course` que solo modelaba los datos en memoria. Importa la entidad creada en la Sesión 7. Los DTOs no cambian: siguen siendo el contrato validado que el controlador entrega al servicio.

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {} // 1

  findAll(level?: string) { // 2
    return this.coursesRepository.find({ where: level ? { level } : {} }); // 3
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOneBy({ id: Number(id) }); // 4
    if (!course) throw new NotFoundException(`Course ${id} not found`); // 5
    return course;
  }

  create(dto: CreateCourseDto) { // 6
    const course = this.coursesRepository.create(dto);
    return this.coursesRepository.save(course);
  }

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.findOne(id); // 7
    Object.assign(course, dto);
    return this.coursesRepository.save(course); // 8
  }

  async remove(id: string) {
    const course = await this.findOne(id); // 9
    await this.coursesRepository.remove(course); // 10
    return course;
  }
}
```

1. Recibe el repositorio administrado por TypeORM. El nombre `coursesRepository` evita confundirlo con el arreglo que acabamos de eliminar.
2–3. Consulta todos los cursos o filtra por nivel.
4–5. Busca por clave primaria y conserva el 404 del contrato anterior.
6. Construye y guarda la entidad nueva.
7–8. Recupera, cambia y guarda.
9–10. Recupera y elimina la entidad existente.

Los métodos asíncronos devuelven promesas; Nest espera su resultado y lo convierte en la respuesta HTTP. El controlador puede conservar sus rutas, DTOs y excepciones de validación.

### Paso 3 · Mantén el controlador

No cambies las rutas `GET`, `POST`, `PATCH` y `DELETE`, ni sus DTOs. Por ejemplo, este método continúa igual:

```ts
@Post()
create(@Body() createCourseDto: CreateCourseDto) {
  return this.coursesService.create(createCourseDto);
}
```

El controlador recibe y valida HTTP; el servicio decide ahora que el curso se guarda en PostgreSQL. Esa separación es la razón por la que el cliente no necesita cambiar sus peticiones.

### Cómo leer cada método del servicio

1. **`findAll`** recibe opcionalmente `level`. Si hay filtro, TypeORM busca solo filas con ese nivel; si no, devuelve toda la tabla.
2. **`findOne`** busca por clave primaria. El repositorio puede devolver `null`; el servicio convierte esa ausencia técnica en el `404` que entiende el cliente.
3. **`create`** no acepta JSON sin validar directamente: recibe el DTO que el controlador ya verificó. `create` prepara una entidad en memoria y `save` la escribe en PostgreSQL.
4. **`update`** recupera la entidad existente antes de cambiarla. Así un id inexistente sigue respondiendo `404` y no se crea un curso nuevo por accidente.
5. **`remove`** también recupera primero. La API no afirma haber eliminado algo que nunca existió.

### Prueba completa de persistencia

Haz esta prueba con un título fácil de reconocer, por ejemplo `Curso persistente de prueba`:

```http
POST http://localhost:3000/courses
Content-Type: application/json

{
  "title": "Curso persistente de prueba",
  "level": "beginner"
}
```

1. Anota el `id` que devuelve el `201`.
2. Detén el servidor con `Ctrl + C` y vuelve a iniciarlo.
3. Llama `GET /courses/<id>` con el id anotado.
4. Cambia el nivel con `PATCH`, reinicia otra vez y vuelve a consultar.
5. Elimina el curso y consulta su id por última vez: debe responder `404`.

Esta secuencia comprueba creación, lectura, actualización, eliminación y —sobre todo— que los reinicios no borran los datos. Si en lugar del curso creado aparecen los ejemplos iniciales de la Semana 3, revisa que el servicio ya no tenga el arreglo temporal.

### Errores frecuentes

| Síntoma | Causa probable | Acción de diagnóstico |
| --- | --- | --- |
| `Nest can't resolve dependencies of CoursesService` | Falta `TypeOrmModule.forFeature([Course])` | Revisa `CoursesModule` y el import de la entidad. |
| La tabla no aparece | La entidad no está registrada o no conectó PostgreSQL | Comprueba la Sesión 7, especialmente `entities: [Course]`. |
| `findOneBy` no encuentra un id recién creado | El id sigue siendo texto o no se guardó | Usa `Number(id)` y espera `save(...)`. |
| Después del reinicio no hay datos | Sigues usando el arreglo temporal | Busca `private readonly courses: Course[]` y elimínalo. |
| `PATCH` crea un nuevo curso | Se llama a `save` sin recuperar primero | Mantén `await this.findOne(id)` antes de asignar campos. |

## Cierre · 10 min

Haz una revisión por pares: ¿el controlador tuvo que aprender SQL? ¿Qué propiedades del servicio temporal se eliminaron? ¿En qué línea se decide el 404? ¿Qué prueba demuestra que la persistencia funciona de verdad?

## Proyecto integrador · 60 min (50%)

1. Confirma que la tabla `courses` creada en la Sesión 7 existe y está disponible.
2. Registra el repositorio de `Course` con `TypeOrmModule.forFeature` e inyéctalo en `CoursesService`.
3. Elimina el arreglo temporal y `nextId`; sustituye cada una de sus operaciones por operaciones del repositorio.
4. Verifica todos los endpoints del CRUD sin modificar el controlador y reinicia el servidor para confirmar persistencia.
5. Actualiza README: requisitos de PostgreSQL, variables de entorno y endpoints. Haz commit y push sin `.env`.

**Criterio de salida:** el CRUD de `/courses` conserva su contrato HTTP y los datos permanecen tras reiniciar la API.

## Tarea opcional

Añade un orden determinista a `findAll`, por ejemplo por `id` ascendente, usando la opción `order` de TypeORM. Crea tres cursos, verifica el orden y explica por qué una API no debería depender de un orden implícito de la base de datos.
