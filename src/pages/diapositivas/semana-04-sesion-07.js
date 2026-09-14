import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 4', title: 'Los datos deben sobrevivir al reinicio del servidor.', statement: 'Sesión 7 · PostgreSQL, TypeORM y entidades.', notes: 'Parte del límite conocido: el CRUD actual vive únicamente en memoria.'},
  {kicker: 'Objetivo', title: 'Prepararemos la conexión y el modelo persistente de CourseHub API.', bullets: ['Configuración local con variables de entorno.', 'Una entidad Course representa la tabla courses.', 'TypeORM descubre entidades al arrancar.'], notes: 'Hoy configuramos y modelamos; el repositorio llega en la siguiente sesión.'},
  {kicker: 'Nuevo recorrido', title: 'El repositorio separa las reglas del almacenamiento.', diagram: 'Controller → Service → Repository → PostgreSQL', notes: 'El cliente no debe saber que internamente hay PostgreSQL.'},
  {kicker: 'Variables de entorno', title: 'Las credenciales cambian; el código no debe contenerlas.', code: 'DATABASE_HOST=localhost\nDATABASE_PORT=5432\nDATABASE_NAME=coursehub\nDATABASE_USER=postgres\nDATABASE_PASSWORD=change_me', bullets: ['.env es local e ignorado.', '.env.example se publica sin secretos.', 'ConfigModule entrega la configuración.'], notes: 'Pide revisar git status antes de publicar para no incluir .env.'},
  {kicker: 'Entidad', title: 'Course describe cómo TypeORM guarda un curso.', code: "@Entity('courses')\nexport class Course {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column() title: string;\n  @Column() level: string;\n}", notes: 'Contrasta entidad con DTO: la primera modela persistencia, el segundo entrada HTTP.'},
  {kicker: 'Configuración', title: 'TypeOrmModule abre la conexión a partir del entorno.', code: "TypeOrmModule.forRootAsync({\n  inject: [ConfigService],\n  useFactory: (config) => ({\n    type: 'postgres',\n    host: config.getOrThrow('DATABASE_HOST'),\n    autoLoadEntities: true,\n    synchronize: true,\n  }),\n})", notes: 'Menciona que falta el resto de propiedades por claridad de la diapositiva. synchronize solo se permite durante desarrollo.'},
  {kicker: 'Regla de seguridad', title: 'synchronize acelera desarrollo, no reemplaza migraciones.', bullets: ['Puede alterar el esquema para reflejar entidades.', 'Nunca se usa como estrategia en producción.', 'Las migraciones llegarán antes de despliegue.'], notes: 'Evita que el alumnado copie esta opción sin conocer su contexto.'},
  {kicker: 'Proyecto integrador · 60 min', title: 'Conecta de forma local y segura.', bullets: ['Instala dependencias.', 'Crea .env.example y protege .env.', 'Configura TypeORM y Course.', 'Comprueba arranque y publica sin secretos.'], notes: 'Criterio: la entidad es detectada y no hay credenciales reales en Git.'}
];

export default function Semana04Sesion07() { return <SlideDeck slides={slides} session="Semana 4 · Sesión 7" />; }
