---
sidebar_position: 3
---

# Sesión 2 · Módulos, controladores, servicios e inyección de dependencias

**Duración:** 2 horas.  
**Meta:** crear una ruta de bienvenida para CourseHub API usando las responsabilidades básicas de NestJS.

## Introducción · 10 min

En la sesión anterior usamos las piezas generadas por el CLI. Hoy las separaremos con intención: el módulo las registra, el controlador expone la ruta y el servicio conserva la lógica.

## Teoría en diapositivas · 24 min (20%)

Material oficial: [providers](https://docs.nestjs.com/providers), [módulos](https://docs.nestjs.com/modules) y [controladores](https://docs.nestjs.com/controllers).

### Diapositiva 1 · Responsabilidades

| Pieza | Responsabilidad |
| --- | --- |
| Módulo | Agrupar y registrar elementos relacionados. |
| Controlador | Recibir peticiones y definir rutas. |
| Servicio | Encapsular lógica reutilizable. |

### Diapositiva 2 · Inyección de dependencias

```text
AppController necesita WelcomeService
          │
          └── Nest crea y entrega WelcomeService
```

El controlador declara lo que necesita en el constructor. No crea el servicio con `new`; el contenedor de Nest entrega la dependencia registrada.

### Diapositiva 3 · Una ruta con prefijo

```ts
@Controller('welcome')
export class WelcomeController {
  @Get()
  getWelcome() {}
}
```

La combinación produce `GET /welcome`. No hay datos de cursos ni operaciones CRUD en esta etapa.

## Desarrollo · ejemplo guiado · 36 min (30%)

Crea los archivos siguientes en `src/`. El ejemplo usa una respuesta estática para concentrarse en la estructura.

### `src/welcome.service.ts`

```ts
import { Injectable } from '@nestjs/common'; // 1

@Injectable() // 2
export class WelcomeService { // 3
  getMessage(): { message: string } { // 4
    return { message: 'Bienvenido a CourseHub API' }; // 5
  }
}
```

1. Importa el decorador de proveedor.
2. Indica que Nest puede inyectar esta clase.
3. Declara el servicio de bienvenida.
4. Define una operación que devuelve un objeto simple.
5. Construye la respuesta inicial; aún no consulta ninguna base de datos.

### `src/welcome.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common'; // 1
import { WelcomeService } from './welcome.service'; // 2

@Controller('welcome') // 3
export class WelcomeController { // 4
  constructor(private readonly welcomeService: WelcomeService) {} // 5

  @Get() // 6
  getWelcome(): { message: string } { // 7
    return this.welcomeService.getMessage(); // 8
  }
}
```

1. Importa los decoradores que definen el controlador y `GET`.
2. Importa la dependencia del controlador.
3. Define el prefijo `/welcome`.
4. Declara la clase del controlador.
5. Recibe el servicio mediante inyección de dependencias.
6. Asocia el método a `GET /welcome`.
7. Declara el tipo de respuesta.
8. Delega la creación del mensaje al servicio.

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common'; // 1
import { AppController } from './app.controller'; // 2
import { AppService } from './app.service'; // 3
import { WelcomeController } from './welcome.controller'; // 4
import { WelcomeService } from './welcome.service'; // 5

@Module({ // 6
  imports: [], // 7
  controllers: [AppController, WelcomeController], // 8
  providers: [AppService, WelcomeService], // 9
})
export class AppModule {} // 10
```

1. Importa el decorador que configura módulos.
2–3. Conserva las piezas iniciales de la aplicación.
4–5. Importa las nuevas piezas de bienvenida.
6. Abre la configuración del módulo raíz.
7. Aún no importamos otros módulos.
8. Registra los controladores que atienden rutas.
9. Registra los servicios disponibles para inyección.
10. Exporta el módulo raíz.

Prueba con `http://localhost:3000/welcome`. Debes recibir:

```json
{ "message": "Bienvenido a CourseHub API" }
```

## Cierre · 10 min

Explica sin mirar el código: ¿qué falla si `WelcomeService` no está en `providers`? ¿Por qué el controlador no debería construir el mensaje directamente? Compara tu respuesta con la de otra persona.

## Proyecto integrador · 60 min (50%)

En tu repositorio público personal `coursehub-api`:

1. Implementa `WelcomeController` y `WelcomeService` como en el ejemplo.
2. Regístralos en `AppModule`.
3. Verifica `GET /welcome` y conserva una captura o una breve evidencia en el `README`.
4. Haz commit y push del código de ambas sesiones.

**Criterio de salida:** `GET /` y `GET /welcome` responden correctamente. La solución solo contiene la estructura y las respuestas iniciales; no agregues entidades, DTOs, validadores, repositorios ni base de datos.
