---
sidebar_position: 3
---

# Sesión 14 · TypeORM por ambiente y preparación de la Etapa 2

**Duración:** 2 horas.  
**Meta:** configurar la conexión TypeORM desde `ConfigService`, diferenciar desarrollo y producción, y verificar la entrega de la Etapa 2.

[Abrir presentación navegable de la Sesión 14](/diapositivas/semana-07-sesion-14)

## Prerrequisitos y materiales

Completa la Sesión 13: `ConfigModule` debe validar las variables y el puerto debe venir del entorno. Conserva las entidades `Course`, `Student` y `Enrollment`. Necesitas dos archivos locales de ejemplo o dos conjuntos de variables para simular desarrollo y producción; no se requiere desplegar.

## Agenda (120 min)

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0–10 | Recuperación | Identificar qué necesita TypeORM para conectarse. |
| 10–30 | Marco conceptual | Comparar desarrollo y producción. |
| 30–60 | Demostración guiada | `forRootAsync` con `ConfigService`. |
| 60–95 | Práctica guiada | Conectar con variables y verificar dos escenarios. |
| 95–110 | Integración Etapa 2 | Ejecutar lista de comprobación y preparar evidencia. |
| 110–120 | Cierre | Defender una decisión de seguridad. |

## Introducción · 10 min

En desarrollo, `synchronize: true` permite que TypeORM ajuste tablas mientras se aprende. En producción puede cambiar o eliminar estructuras de datos de forma inesperada; por eso no se activa allí. La misma aplicación necesita decidir ese comportamiento según el ambiente, no según un comentario que alguien recuerde editar antes de publicar.

La configuración asíncrona de TypeORM usa `ConfigService` para reunir las variables ya validadas. Así hay una única fuente de datos para puerto, base de datos y ambiente.

## Marco conceptual · 20 min

Material oficial: [integración TypeORM de Nest](https://docs.nestjs.com/techniques/database), [opciones de conexión de TypeORM](https://typeorm.io/docs/data-source/data-source-options/) y [migraciones de TypeORM](https://typeorm.io/docs/advanced-topics/migrations/).

| Decisión | Desarrollo | Producción |
| --- | --- | --- |
| Fuente de valores | `.env` local | Variables seguras del entorno de despliegue |
| `synchronize` | Permitido para aprendizaje local | `false` |
| Cambios de esquema | Ajuste local desechable | Migraciones revisadas |
| Errores de configuración | Fallar al iniciar | Fallar al iniciar, sin mostrar secretos |

**Importante:** esta sesión no implementa migraciones completas; solo deja la aplicación en una posición segura para adoptarlas después. Decir «`synchronize` es falso en producción» no sustituye una estrategia de migraciones.

## Demostración guiada · 30 min

### Paso 1 · Configurar TypeORM con valores ya validados

```ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.getOrThrow<string>('DB_HOST'),
    port: config.getOrThrow<number>('DB_PORT'),
    username: config.getOrThrow<string>('DB_USER'),
    password: config.getOrThrow<string>('DB_PASSWORD'),
    database: config.getOrThrow<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: config.getOrThrow<string>('NODE_ENV') === 'development',
  }),
}),
```

`autoLoadEntities: true` evita mantener manualmente una segunda lista de entidades cuando los módulos ya las registran con `forFeature`. Si el proyecto utiliza una lista explícita y funciona correctamente, mantenla de manera consistente; no mezcles ambas estrategias sin razón.

### Paso 2 · Hacer explícita la política del ambiente

`NODE_ENV` admite únicamente `development`, `test` o `production` gracias al esquema de la sesión anterior. Con `NODE_ENV=production`, la expresión anterior produce `false`; por tanto TypeORM no intentará sincronizar el esquema.

No registres `console.log(config)` ni muestres el objeto completo de configuración: contiene la contraseña. Para diagnosticar, registra solo datos no sensibles, como ambiente, host y puerto, o consulta el valor de forma individual sin exponer secretos.

### Paso 3 · Verificar dos escenarios sin desplegar

1. Con variables de desarrollo y una base local, inicia la API y consulta `GET /courses`.
2. Cambia solo `NODE_ENV=production` en una copia temporal de variables. Confirma con una prueba controlada o un registro no sensible que `synchronize` es `false`; no apuntes estas pruebas a una base ajena.
3. Restaura `NODE_ENV=development` para continuar el trabajo local.

### Paso 4 · Preparar la configuración de la Etapa 2

El README debe separar:

- requisitos (Node.js, PostgreSQL y versión o método de instalación);
- variables requeridas y cómo copiar `.env.example` a `.env`;
- comando de inicio de desarrollo;
- endpoints principales y ejemplos de consultas de la Semana 6;
- advertencia de que `.env` no se comparte ni se entrega.

## Práctica guiada · 35 min

1. Reemplaza la conexión con valores fijos por `TypeOrmModule.forRootAsync`.
2. Lee todas las variables con `getOrThrow`.
3. Comprueba que cursos, estudiantes y matrículas siguen disponibles al iniciar en desarrollo.
4. Simula `NODE_ENV=production` sin utilizar una base de producción y verifica la política de sincronización.
5. Revisa `.gitignore`, `.env.example` y `README` en pareja usando la lista de comprobación siguiente.

## Lista de comprobación de Etapa 2 · 15 min

| Aspecto | Comprobación |
| --- | --- |
| Relaciones | Matrícula válida, duplicado rechazado y estudiante inactivo rechazado. |
| Consultas | Paginación estable, búsqueda parametrizada y filtros combinables. |
| Configuración | No hay host, usuario ni contraseña escritos en TypeScript. |
| Ambientes | `NODE_ENV` está validado y desactiva `synchronize` fuera de desarrollo. |
| Reproducibilidad | `.env.example` y README permiten iniciar un clon local. |
| Seguridad | `.env` está ignorado y no aparece en el control de versiones. |

**Criterio de éxito:** se puede clonar el proyecto, crear un `.env` desde la plantilla y arrancar el entorno local sin descubrir credenciales en el código; la configuración de producción no sincroniza el esquema automáticamente.

## Cierre · 10 min

Responde: ¿por qué cambiar solo una variable puede modificar el comportamiento de `synchronize`? ¿Por qué no debemos probar una configuración de desarrollo sobre una base que contenga datos reales? Entrega evidencia de un arranque local y de los archivos de configuración seguros.

## Tarea opcional

Escribe una propuesta de migración para agregar una columna futura, indicando el nombre de la migración, el cambio `up` y cómo se revertiría con `down`. No es necesario ejecutarla aún.
