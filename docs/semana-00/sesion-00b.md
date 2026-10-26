---
sidebar_position: 3
---

# Sesión 0B · Concurrencia, peticiones HTTP y estado compartido

**Duración sugerida:** 2 horas.
**Meta:** describir cómo el servidor atiende varias solicitudes y detectar cuándo el acceso concurrente al estado puede producir resultados incorrectos.

[Abrir presentación navegable de la Sesión 0B](/diapositivas/semana-00-sesion-00b)

## Concurrencia no es paralelismo · 20 min

- **Concurrencia:** varias tareas progresan durante el mismo intervalo. Un servidor puede iniciar una consulta de base de datos para A mientras queda disponible para recibir B.
- **Paralelismo:** varias tareas se ejecutan literalmente a la vez en distintos núcleos o procesadores.

Node.js usa un hilo principal de JavaScript y un *event loop*. Las operaciones de red, disco y base de datos se coordinan de forma asíncrona; cuando una espera termina, su continuación se agenda. Esto ofrece concurrencia eficiente para trabajo de entrada/salida, pero no convierte un cálculo intensivo en trabajo gratuito: un bucle pesado bloquea el hilo principal y retrasa otras peticiones.

```ts
// Bien para I/O: el hilo de JavaScript puede atender otros eventos mientras espera.
const course = await this.courseRepository.findOneBy({ id });

// Mal dentro de un controlador: bloquea el hilo principal.
while (Date.now() < finishAt) { /* cálculo ocupado */ }
```

Para CPU intensiva se evalúan *worker threads*, procesos separados o una cola de trabajos; la elección llega cuando el caso real lo justifica.

## El modelo asíncrono de Node.js · 15 min

En Node.js, una promesa representa un resultado que estará disponible después. `async`/`await` permite expresar la secuencia de una operación asíncrona sin bloquear el servidor mientras se espera la entrada/salida.

```ts
async findCourse(id: number) {
  const course = await this.courseRepository.findOneBy({ id });
  return course;
}
```

Cuando la consulta a PostgreSQL está pendiente, el *event loop* puede seguir coordinando otras tareas. Cuando llega el resultado, Node.js programa la continuación de la función. Esta capacidad sirve principalmente para entrada/salida; una operación intensiva de CPU requiere una estrategia distinta, como *worker threads*, procesos separados o una cola de trabajos, cuando el caso de uso lo justifique.

## Anatomía de una petición HTTP · 30 min

### En el curso: NestJS sobre Node.js

```text
Cliente → TCP/TLS → servidor Node.js → adaptador HTTP (Express o Fastify)
        → middleware → guard → interceptor de entrada → pipe
        → controlador → servicio/caso de uso → repositorio/BD
        ← respuesta ← interceptor de salida ← adaptador HTTP ← cliente
```

No todas las solicitudes activan todas las piezas, pero el mapa permite ubicar responsabilidades. Por ejemplo, un *guard* decide acceso; un *pipe* transforma o valida; el controlador no debería implementar toda esa lógica manualmente.

### La ruta en NestJS

```ts
@Controller('welcome')
export class WelcomeController {
  @Get()
  getWelcome() {
    return { message: 'Bienvenido a CourseHub API' };
  }
}
```

El decorador `@Controller('welcome')` fija el prefijo y `@Get()` asocia el método con `GET /welcome`. NestJS entrega la solicitud al controlador a través de su adaptador HTTP —Express por defecto o Fastify si se configura— y transforma el valor retornado en una respuesta HTTP. Los parámetros `@Param()`, `@Query()`, `@Body()` y `@Headers()` permiten leer los datos de entrada cuando la ruta los requiere.

## Condiciones de carrera · 30 min

Existe una condición de carrera cuando el resultado depende del orden imprevisible en que operaciones concurrentes leen y escriben un estado compartido.

```ts
// Dos solicitudes pueden leer 0 antes de que cualquiera escriba 1.
let availableSeats = 1;

async function reserveSeat() {
  if (availableSeats > 0) {
    await saveReservation();
    availableSeats -= 1;
    return true;
  }
  return false;
}
```

El problema no se arregla solo con `async`/`await`: la espera permite que otra solicitud ejecute la misma comprobación. En una aplicación real, la protección adecuada depende del recurso:

- Para datos persistentes, prefiere una operación atómica o una transacción con restricción en PostgreSQL; la base de datos es la autoridad compartida entre procesos.
- Para estado local de un único proceso, un bloqueo o una cola puede serializar una sección crítica, pero no escala por sí solo a varias instancias.
- Para trabajo distribuido, emplea mecanismos diseñados para coordinación distribuida, con límites y recuperación ante fallos.

En NestJS/Node.js se previenen principalmente mediante operaciones atómicas, restricciones de datos y pruebas que ejerciten solicitudes simultáneas. Una prueba aislada que solo envía una petición puede confirmar una ruta, pero no demuestra que el sistema conserve la regla cuando varias solicitudes compiten por el mismo dato.

## Cierre · 10 min

Explica esta afirmación con tus palabras: “Node.js puede ser concurrente sin ejecutar JavaScript de aplicación en paralelo”. Luego indica qué ocurriría si dos peticiones intentan ocupar el último cupo y qué debe garantizar la base de datos.
