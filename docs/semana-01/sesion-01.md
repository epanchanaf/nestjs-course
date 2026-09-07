---
sidebar_position: 2
---

# Sesión 1 · Primer proyecto NestJS

**Duración:** 2 horas.  
**Meta:** iniciar una aplicación NestJS y entender cómo una petición llega a un controlador.

[Abrir presentación navegable de la Sesión 1](/diapositivas/semana-01-sesion-01)

## Introducción · 10 min

Una API no es solo una colección de rutas: necesita una estructura que siga siendo entendible cuando el proyecto crezca. NestJS propone una arquitectura basada en módulos y se apoya en TypeScript y decoradores.

Pregunta de arranque: ¿qué debería ocurrir entre una petición `GET /` y la respuesta que ve el cliente?

## Teoría en diapositivas · 24 min (20%)

Usa estas diapositivas breves durante la explicación. El contenido se basa en la documentación oficial de NestJS: [primeros pasos](https://docs.nestjs.com/first-steps), [controladores](https://docs.nestjs.com/controllers) y [módulos](https://docs.nestjs.com/modules).

### Diapositiva 1 · ¿Qué es NestJS?

- Framework para construir aplicaciones de servidor con Node.js y TypeScript.
- Ofrece una estructura lista para crecer.
- En este curso construiremos una API HTTP.

### Diapositiva 2 · Crear y ejecutar

```bash
npm i -g @nestjs/cli
nest new coursehub-api
cd coursehub-api
npm run start:dev
```

`start:dev` mantiene el servidor observando los cambios. Abre `http://localhost:3000` para comprobar la respuesta inicial.

### Diapositiva 3 · El recorrido de una petición

```text
Cliente ── GET / ──> Controller ──> Service ──> respuesta HTTP
```

El controlador recibe la petición y delega la lógica al servicio. Esta separación evita mezclar transporte HTTP y lógica de la aplicación.

### Diapositiva 4 · El módulo como organizador

- `AppModule` es el módulo raíz.
- Declara qué controladores y proveedores pertenecen a una parte de la aplicación.
- Más adelante tendremos módulos de negocio, pero hoy usaremos el generado por Nest.

## Desarrollo · ejemplo guiado · 36 min (30%)

Después de crear el proyecto con el CLI, revisa estos tres archivos generados. Léelos y ejecútalos antes de modificarlos.

### `src/main.ts`

```ts
import { NestFactory } from '@nestjs/core'; // 1
import { AppModule } from './app.module'; // 2

async function bootstrap() { // 3
  const app = await NestFactory.create(AppModule); // 4
  await app.listen(process.env.PORT ?? 3000); // 5
}
bootstrap(); // 6
```

1. Importa la fábrica que crea la aplicación Nest.
2. Importa el módulo raíz que describe la aplicación.
3. Declara una función asíncrona para el arranque.
4. Crea la aplicación a partir de `AppModule`.
5. Inicia el servidor en el puerto de entorno o en el 3000.
6. Ejecuta el arranque.

### `src/app.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common'; // 1
import { AppService } from './app.service'; // 2

@Controller() // 3
export class AppController { // 4
  constructor(private readonly appService: AppService) {} // 5

  @Get() // 6
  getHello(): string { // 7
    return this.appService.getHello(); // 8
  }
}
```

1. Trae decoradores HTTP de Nest.
2. Importa el servicio que contiene la respuesta.
3. Marca la clase como controlador sin prefijo de ruta.
4. Exporta el controlador para registrarlo en el módulo.
5. Solicita una instancia de `AppService`; Nest la suministra.
6. Asocia el método a `GET /`.
7. Define un método que devuelve texto.
8. Delega el valor al servicio.

### `src/app.service.ts`

```ts
import { Injectable } from '@nestjs/common'; // 1

@Injectable() // 2
export class AppService { // 3
  getHello(): string { // 4
    return 'CourseHub API está en línea'; // 5
  }
}
```

1. Importa el decorador para proveedores.
2. Permite que Nest gestione esta clase como dependencia.
3. Declara el servicio.
4. Expone una operación de la aplicación.
5. Devuelve la respuesta inicial del producto.

## Cierre · 10 min

Comprueba en pareja: ¿qué archivo crea el servidor?, ¿qué archivo recibe `GET /`?, ¿por qué la respuesta vive en un servicio? Registra una duda y un hallazgo en el `README` de tu repositorio.

## Proyecto integrador · 60 min (50%)

1. Crea en GitHub un repositorio público exactamente llamado `coursehub-api`.
2. Genera localmente el proyecto con `nest new coursehub-api` y enlázalo con ese repositorio.
3. Ajusta `AppService.getHello()` para devolver `CourseHub API está en línea`.
4. Ejecuta `npm run start:dev` y verifica `GET /` en el navegador o con un cliente HTTP.
5. Publica el código con un commit descriptivo, por ejemplo `feat: initialize CourseHub API`.

**Criterio de salida:** el repositorio es público, contiene una aplicación NestJS ejecutable y la ruta raíz responde el mensaje acordado.
