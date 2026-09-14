---
sidebar_position: 2
---

# Sesión 5 · Crear cursos con DTOs

**Duración:** 2 horas.  
**Meta:** recibir el cuerpo de una petición `POST` mediante un contrato de creación y validar sus datos.

[Abrir presentación navegable de la Sesión 5](/diapositivas/semana-03-sesion-05)

## Antes de empezar

Debes tener funcionando el recurso `courses` de la Semana 2: una ruta `GET /courses`, un servicio que administra cursos temporalmente y las rutas de consulta. Necesitarás Node.js, tu proyecto `coursehub-api`, un cliente HTTP (por ejemplo, REST Client, Postman, Insomnia o `curl`) y una terminal.

Al terminar no solo deberías poder copiar el código: debes poder explicar qué ocurre con un JSON desde que llega a la API hasta que se convierte en un curso dentro del servicio.

## Introducción · 10 min

Una API de lectura muestra datos; una API útil también recibe información. Antes de añadirla al arreglo, debemos decidir qué forma tiene una solicitud válida.

Piensa en un formulario de inscripción. Aunque la interfaz muestre campos obligatorios, alguien podría llamar directamente a la API desde otro programa y enviar `{}`, un número como título o un nivel inventado. Por eso el servidor no debe confiar en que el cliente hizo las comprobaciones: la API protege su propio contrato.

## Marco conceptual · 24 min (20%)

Material oficial: [DTOs](https://docs.nestjs.com/controllers#request-payloads), [validación](https://docs.nestjs.com/techniques/validation) y [pipes](https://docs.nestjs.com/pipes).

### Diapositiva 1 · Contrato de entrada

Un DTO (Data Transfer Object) describe los datos que cruzan el límite HTTP. `CreateCourseDto` no es una entidad ni una tabla: es el contrato para crear un curso.

### Diapositiva 2 · Validar cerca del borde

```text
cliente → JSON → ValidationPipe → controller → service
```

La tubería bloquea solicitudes mal formadas antes de que la lógica de negocio las procese.

### Diapositiva 3 · Semántica HTTP

Una creación correcta responde `201 Created`. Una solicitud que incumple el contrato responde `400 Bad Request` y explica qué campo falló.

### Palabras que conviene distinguir

- **Cuerpo o body:** los datos JSON enviados con la petición. En `POST /courses` podría ser `{ "title": "NestJS desde cero", "level": "beginner" }`.
- **DTO:** clase que expresa el contrato de datos que acepta una operación. Su trabajo es describir entrada, no guardar información.
- **Decorador de validación:** regla que se coloca sobre una propiedad, como `@IsNotEmpty()`.
- **Pipe:** pieza de Nest que transforma o valida datos antes de que el método del controlador se ejecute.
- **Código de estado:** parte de la respuesta HTTP. Un `201` indica una creación correcta; un `400` indica que la petición no cumple el contrato.

## Desarrollo · ejemplo guiado · 36 min (30%)

Instala las dependencias una sola vez:

```bash
npm install class-validator class-transformer
```

### `src/courses/dto/create-course.dto.ts`

```ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator'; // 1

export class CreateCourseDto { // 2
  @IsString() // 3
  @IsNotEmpty() // 4
  title: string;

  @IsIn(['beginner', 'intermediate', 'advanced']) // 5
  level: string;
}
```

1. Importa reglas declarativas de validación.
2. Declara el contrato de creación.
3–4. Exige un título de texto no vacío.
5. Limita el nivel a valores acordados.

### `src/main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`whitelist` elimina propiedades no declaradas; `forbidNonWhitelisted` las convierte en un error claro. No aceptamos campos por accidente.

### Sigue el recorrido de una solicitud

Supón que el cliente envía:

```json
{
  "title": "NestJS desde cero",
  "level": "beginner"
}
```

1. El servidor reconoce `POST /courses` y entra a `CoursesController.create`.
2. Antes de ejecutar el método, `ValidationPipe` compara el body con `CreateCourseDto`.
3. `title` es texto y no está vacío; `level` pertenece a la lista permitida. La petición continúa.
4. `@Body()` entrega al controlador el objeto validado.
5. El controlador lo pasa al servicio. El servicio crea el id temporal, agrega el curso al arreglo y lo devuelve.
6. Nest transforma ese objeto en JSON y responde `201 Created`.

En cambio, con `{ "title": "", "level": "expert" }`, los pasos 3 a 6 no ocurren: la tubería responde `400` antes de llamar al servicio.

### Cambios en controlador y servicio

```ts
// courses.controller.ts
@Post()
create(@Body() createCourseDto: CreateCourseDto) {
  return this.coursesService.create(createCourseDto);
}

// courses.service.ts
create(createCourseDto: CreateCourseDto): Course {
  const course = { id: this.nextId++, ...createCourseDto };
  this.courses.push(course);
  return course;
}
```

Importa `Body` y `Post` en el controlador, y `CreateCourseDto` en ambos archivos. Declara `private nextId = 3;` acorde con los cursos iniciales. Prueba un cuerpo válido y otro sin `title`.

### Prueba guiada desde un cliente HTTP

Envía esta petición válida:

```http
POST http://localhost:3000/courses
Content-Type: application/json

{
  "title": "Diseño de APIs",
  "level": "intermediate"
}
```

La respuesta debe tener estado `201` y un objeto parecido a este:

```json
{
  "id": 3,
  "title": "Diseño de APIs",
  "level": "intermediate"
}
```

Ahora cambia el nivel por `expert`, o añade `{ "duration": 20 }`. Observa que el servidor responde `400`. Lee el arreglo `message` de la respuesta: contiene la razón concreta. Esa lectura es una habilidad práctica para depurar una API.

### Errores frecuentes

| Síntoma | Causa probable | Cómo revisarlo |
| --- | --- | --- |
| Se crea un curso sin título | `ValidationPipe` no está configurado en `main.ts` | Reinicia el servidor y comprueba `app.useGlobalPipes(...)`. |
| `Cannot find module 'class-validator'` | Faltan dependencias | Ejecuta la instalación indicada y vuelve a iniciar la API. |
| La ruta responde 404 | Falta `@Post()` o el prefijo no es `courses` | Revisa el controlador y prueba `POST /courses`. |
| El id se repite | `nextId` no cambia o se reinicia el servidor | Comprueba el incremento y recuerda que el almacenamiento sigue siendo temporal. |

## Cierre · 10 min

¿Por qué validar solo en el navegador no protege la API? Distingue el tipo TypeScript del DTO: ¿cuál sigue aplicándose cuando llega una petición real?

## Proyecto integrador · 60 min (50%)

1. Instala las librerías de validación y activa la tubería global.
2. Crea `CreateCourseDto` con `title` y `level` validados.
3. Implementa `POST /courses` en controlador y servicio.
4. Prueba un `201` válido y dos `400` (título vacío y nivel no permitido).
5. Documenta los tres casos en el `README`, haz commit y push.

**Criterio de salida:** `POST /courses` crea un curso temporal con identificador y rechaza cuerpos inválidos antes de llegar al servicio.

## Tarea opcional

Añade una propiedad `description` al DTO. Decide una regla razonable —por ejemplo, texto opcional con un máximo de 280 caracteres—, aplícala con decoradores y prueba una petición que la cumpla y otra que la supere. Documenta la decisión en el README: un buen contrato siempre explica sus límites.
