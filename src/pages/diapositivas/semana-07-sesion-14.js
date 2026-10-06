import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  { kicker: 'Curso de NestJS · Semana 7', title: 'La conexión cambia por ambiente, no por descuido.', statement: 'Sesión 14 · TypeORM configurable y preparación de la Etapa 2.', notes: 'Parte de la validación de variables de la sesión anterior.' },
  { kicker: 'Objetivo', title: 'Conectaremos TypeORM con ConfigService.', bullets: ['Quitar valores fijos.', 'Usar variables ya validadas.', 'Diferenciar desarrollo y producción.', 'Preparar evidencia de Etapa 2.'], notes: 'No implementamos todavía un despliegue real ni migraciones completas.' },
  { kicker: 'Ambientes', title: 'Una política clara evita pérdidas de datos.', bullets: ['development: synchronize permitido localmente.', 'production: synchronize debe ser false.', 'Ambos: variables validadas al iniciar.', 'Producción: migraciones revisadas.'], notes: 'synchronize nunca reemplaza migraciones en producción.' },
  { kicker: 'forRootAsync', title: 'TypeORM recibe configuración desde un único servicio.', code: "TypeOrmModule.forRootAsync({\n  inject: [ConfigService],\n  useFactory: (config) => ({\n    type: 'postgres',\n    host: config.getOrThrow('DB_HOST'),\n    port: config.getOrThrow('DB_PORT'),\n    autoLoadEntities: true,\n    synchronize: config.getOrThrow('NODE_ENV') === 'development',\n  }),\n});", notes: 'La versión completa incluye usuario, contraseña y base, sin registrarlos en la consola.' },
  { kicker: 'Seguridad', title: 'Diagnosticar no exige imprimir secretos.', bullets: ['No hagas console.log(config).', 'No subas .env.', 'Registra solo datos no sensibles si es necesario.', 'Usa .env.example para explicar variables.'], notes: 'El equipo debe revisar cambios antes de hacer commit.' },
  { kicker: 'Prueba controlada', title: 'Simula producción sin usar una base real.', bullets: ['Inicia con variables de desarrollo.', 'Comprueba endpoints persistentes.', 'Cambia NODE_ENV en una copia temporal.', 'Verifica synchronize=false.', 'Restaura desarrollo.'], notes: 'No apuntar estas prácticas hacia datos de terceros.' },
  { kicker: 'Etapa 2', title: 'La entrega une tres semanas.', diagram: 'Semana 5: relaciones\n        ↓\nSemana 6: consultas\n        ↓\nSemana 7: configuración segura', notes: 'Revisa que cada evidencia se pueda demostrar en diez minutos.' },
  { kicker: 'Lista de salida', title: 'Antes de entregar, verifica lo esencial.', bullets: ['Matrícula íntegra y persistente.', 'Paginación y búsqueda segura.', 'Variables validadas.', '.env.example y README.', 'synchronize solo en desarrollo.'], notes: 'Un proyecto reproducible también debe estar documentado.' },
  { kicker: 'Práctica · 35 min', title: 'Configura, prueba y revisa.', bullets: ['Usa forRootAsync.', 'Arranca con entorno local.', 'Simula production de forma segura.', 'Revisa archivos sensibles.', 'Completa evidencia.'], notes: 'Da tiempo final para la lista de comprobación.' },
  { kicker: 'Cierre', title: 'La configuración es parte del producto.', statement: 'Una API madura puede cambiar de entorno sin reescribir el código ni exponer secretos.', notes: 'Presenta los criterios de la Etapa 2.' },
];

export default function Semana07Sesion14() { return <SlideDeck slides={slides} session="Semana 7 · Sesión 14" />; }
