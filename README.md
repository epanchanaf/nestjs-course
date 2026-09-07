# Curso de NestJS

Sitio docente construido con Docusaurus. La Semana 1 inicia el proyecto transversal **CourseHub API** sin adelantarse a CRUD, DTOs, validaciones o persistencia de datos.

## Ejecutar localmente

Usa Node.js 22 (si utilizas `nvm`, ejecuta `nvm use`).

```bash
npm install
npm start
```

El sitio se abre normalmente en `http://localhost:3000/nestjs-course/`.

## Publicar en GitHub Pages

1. En el repositorio, habilita GitHub Pages con la fuente **GitHub Actions**.
2. Sube la rama `main`; el flujo `.github/workflows/deploy.yml` construirá y publicará el sitio.
