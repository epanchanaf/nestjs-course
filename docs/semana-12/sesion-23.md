---
sidebar_position: 2
---

# Sesión 23 · Probar reglas de negocio con Jest

[Abrir presentación navegable de la Sesión 23](/diapositivas/semana-12-sesion-23)

**Duración:** 2 horas.  
**Meta:** crear pruebas unitarias para un caso de uso usando un repositorio falso o simulado, sin iniciar HTTP ni PostgreSQL.

## Introducción

Probar manualmente una ruta es valioso, pero no escala cuando cada cambio obliga a repetir decenas de escenarios. Una prueba unitaria protege una decisión pequeña: «un docente no edita un curso ajeno», «un curso inexistente produce `404`» o «un administrador sí puede actualizarlo».

## Marco conceptual

### La forma Arrange Act Assert

1. **Arrange:** preparar entradas y dependencias controladas.
2. **Act:** ejecutar la unidad que se quiere comprobar.
3. **Assert:** verificar resultado, error o interacción esperada.

Una prueba debe tener un propósito evidente. Evita probar diez reglas sin relación en un solo caso: cuando falle, nadie sabrá cuál cambió.

### Repositorio simulado

```ts
const courses = {
  findById: jest.fn(),
  save: jest.fn(),
};

beforeEach(async () => {
  const module = await Test.createTestingModule({
    providers: [
      UpdateCourseUseCase,
      { provide: COURSE_REPOSITORY, useValue: courses },
    ],
  }).compile();

  useCase = module.get(UpdateCourseUseCase);
  jest.clearAllMocks();
});
```

El objeto `courses` sustituye al adaptador TypeORM. Gracias a ello, la prueba controla qué devuelve `findById` y puede verificar si se llamó a `save`. No abre conexiones ni depende de datos previos.

### Caso exitoso

```ts
it('allows the owner teacher to update a course', async () => {
  const course = { id: 7, title: 'NestJS', createdByUserId: 4 } as Course;
  courses.findById.mockResolvedValue(course);
  courses.save.mockImplementation(async (value) => value);

  const result = await useCase.execute(7, { title: 'NestJS avanzado' },
    { id: 4, role: UserRole.TEACHER });

  expect(result.title).toBe('NestJS avanzado');
  expect(courses.save).toHaveBeenCalledWith(course);
});
```

El nombre explica la regla: propietario docente. Si esta prueba falla, el equipo sabe qué comportamiento revisar.

### Casos de error

```ts
it('rejects an update from a different teacher', async () => {
  courses.findById.mockResolvedValue({ id: 7, createdByUserId: 4 });

  await expect(useCase.execute(7, { title: 'Cambio' },
    { id: 9, role: UserRole.TEACHER }))
    .rejects.toThrow(ForbiddenException);

  expect(courses.save).not.toHaveBeenCalled();
});
```

Además del `403`, se verifica que el repositorio no guarda cambios. Una regla de seguridad está incompleta si responde un error después de modificar datos.

## Práctica guiada

1. Localiza una regla de negocio clara: propiedad, duplicado o estudiante inactivo.
2. Escribe tres pruebas: éxito, recurso inexistente y rechazo por regla.
3. Ejecuta `npm test -- update-course` y lee el resultado antes de cambiar producción.
4. Haz fallar intencionalmente una expectativa para comprobar que la prueba realmente protege algo.
5. Restaura la expectativa y registra en el README cómo ejecutar el conjunto de pruebas.

## Cierre

¿Por qué esta prueba no necesita PostgreSQL? ¿Qué diferencia hay entre probar que se lanzó `ForbiddenException` y probar que no se llamó a `save`?
