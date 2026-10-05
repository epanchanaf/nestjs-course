---
sidebar_position: 1
---

# Semana 5 · Estudiantes y matrículas persistentes

## Resultado de aprendizaje

Al finalizar la semana podrás llevar los módulos de `students` y `enrollments` desde arreglos en memoria a PostgreSQL, conservando sus reglas de negocio y expresando una matrícula como una relación entre entidades.

## Entregable semanal

CourseHub API almacenará cursos, estudiantes y matrículas en PostgreSQL. Un estudiante tendrá correo único y cada matrícula enlazará exactamente un estudiante activo con un curso, sin duplicar la misma combinación.

## Límites de esta semana

- Sí: entidades `Student` y `Enrollment`, repositorios, restricciones de integridad, relaciones `ManyToOne`/`OneToMany` y consultas con relaciones.
- No todavía: autenticación, roles, migraciones de producción, pagos o una interfaz gráfica.

## Ruta de trabajo

1. **Sesión 9:** persistir estudiantes y trasladar sus reglas —en especial el correo único— al servicio y a la base de datos.
2. **Sesión 10:** persistir matrículas como vínculos entre estudiantes y cursos; consultar esos vínculos sin perder las rutas existentes.

La Semana 4 ya dejó persistente el módulo `courses`. Esta semana completa el mismo cambio en los módulos que antes se construyeron en memoria.
