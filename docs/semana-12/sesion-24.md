---
sidebar_position: 3
---

# Sesión 24 · Controladores cobertura y calidad de pruebas

**Duración:** 2 horas.  
**Meta:** probar que un controlador delega correctamente, interpretar cobertura y distinguir una prueba útil de una prueba que solo aumenta porcentajes.

## Introducción

El controlador debe ser deliberadamente pequeño: recibe parámetros HTTP ya transformados, delega en un caso de uso y devuelve el resultado. Por eso sus pruebas no repiten las pruebas de negocio; verifican que el puente HTTP invoca el caso correcto con los argumentos correctos.

## Marco conceptual

### Controlador con dependencia simulada

```ts
const updateCourse = { execute: jest.fn() };

beforeEach(async () => {
  const module = await Test.createTestingModule({
    controllers: [CoursesController],
    providers: [{ provide: UpdateCourseUseCase, useValue: updateCourse }],
  }).compile();
  controller = module.get(CoursesController);
  jest.clearAllMocks();
});

it('delegates update with the id body and authenticated user', async () => {
  const actor = { id: 4, role: UserRole.TEACHER };
  const dto = { title: 'NestJS avanzado' };
  updateCourse.execute.mockResolvedValue({ id: 7, ...dto });

  await expect(controller.update(7, dto, actor)).resolves.toEqual({ id: 7, ...dto });
  expect(updateCourse.execute).toHaveBeenCalledWith(7, dto, actor);
});
```

Aquí no se prueba si el docente es propietario: eso corresponde al caso de uso. Se prueba que el controlador no pierde el `id`, no modifica el DTO y entrega la identidad autenticada.

### Cobertura como señal, no como objetivo único

```bash
npm test -- --coverage
```

La cobertura indica qué líneas, funciones y ramas se ejecutaron durante las pruebas. Una cobertura alta no garantiza calidad: se puede ejecutar una línea sin comprobar su resultado. Una cobertura baja sí puede revelar rutas sin ejercitar.

| Pregunta | Mejor evidencia |
| --- | --- |
| ¿Se ejecutó la rama de rechazo? | Cobertura de ramas y prueba de error. |
| ¿La regla es correcta? | Expectativa clara sobre resultado o excepción. |
| ¿La prueba es independiente? | No depende de orden, reloj real ni base local. |
| ¿El nombre explica el contrato? | `rejects update from a different teacher`. |

### Qué no debe simularse

No simules la unidad que estás tratando de probar. Para una prueba de `UpdateCourseUseCase`, se simula el repositorio, no el propio caso de uso. Para una prueba de controlador, se simula el caso de uso. Este límite mantiene cada prueba enfocada.

## Práctica guiada

1. Escribe una prueba para un controlador que delegue en un caso de uso.
2. Añade una prueba que confirme que un error del caso de uso se propaga; no lo conviertas en un falso `200`.
3. Ejecuta cobertura y localiza una rama relevante que no esté cubierta.
4. Añade una prueba con una expectativa significativa para esa rama.
5. Revisa los nombres: una persona que no escribió el código debe entender la regla al leer la salida de Jest.

## Cierre

Explica por qué una cobertura de 100 % no autoriza eliminar revisión de código. ¿Qué prueba unitaria agregarías antes de modificar la regla de propiedad?
