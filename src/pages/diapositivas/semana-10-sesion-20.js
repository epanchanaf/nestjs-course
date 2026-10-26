import React from 'react';
import SlideDeck from '../../components/SlideDeck';

const slides = [
  {kicker: 'Curso de NestJS · Semana 10', title: 'La seguridad de una API se construye en capas.', statement: 'Sesión 20 · CORS, límite de solicitudes y HTTPS.', notes: 'No presentar ninguna capa como solución única.'},
  {kicker: 'Defensa en profundidad', title: 'Cada control reduce un riesgo distinto.', diagram: 'Entrada → DTO y ValidationPipe\nIdentidad → JWT\nAcción → roles y propiedad\nAbuso → rate limit\nTránsito → HTTPS/TLS', notes: 'Las capas se complementan y ninguna reemplaza las demás.'},
  {kicker: 'CORS', title: 'CORS controla qué sitios web puede leer un navegador.', code: "app.enableCors({\n  origin: ['https://coursehub.example.edu'],\n  methods: ['GET', 'POST', 'PATCH', 'DELETE'],\n  allowedHeaders: ['Content-Type', 'Authorization'],\n});", notes: 'Un script, Postman o un servidor externo no están sujetos a CORS.'},
  {kicker: 'Límite', title: 'Rate limiting hace costoso repetir intentos.', code: 'ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]);\n\n@Throttle({ default: { limit: 5, ttl: 60_000 } })\n@Post(\'login\')\nlogin(@Body() dto: LoginDto) {}', notes: 'Login tiene un umbral menor porque recibe credenciales.'},
  {kicker: '429', title: 'El cliente debe esperar, no recibe pistas sobre credenciales.', statement: 'Too Many Requests no debe revelar si el correo o la contraseña eran correctos.', notes: 'Haz seis intentos controlados para observar el último 429.'},
  {kicker: 'HTTPS', title: 'Un Bearer token por HTTP puede ser interceptado.', bullets: ['Local: http://localhost puede servir para desarrollo.', 'Producción: HTTPS/TLS es obligatorio.', 'TLS suele terminar en proxy, balanceador o plataforma.', 'Los secretos permanecen fuera del repositorio.'], notes: 'Una firma correcta no protege un token que otra persona ya capturó.'},
  {kicker: 'Matriz', title: 'Relaciona el riesgo con su control principal.', bullets: ['Cuerpo malformado → DTO y ValidationPipe.', 'Fuerza bruta → límite de solicitudes.', 'Acción no permitida → roles y propiedad.', 'Sitio web no autorizado → CORS.', 'Token en tránsito → HTTPS y vencimiento corto.'], notes: 'CORS no sustituye JWT ni autorización de servidor.'},
  {kicker: 'Salida', title: 'Permite el cliente correcto y conserva las barreras del servidor.', statement: 'Configura CORS explícito, limita login y documenta HTTPS en producción.', notes: 'Cierre: pregunta por qué CORS no impide usar Postman.'},
];

export default function Semana10Sesion20() { return <SlideDeck slides={slides} session="Semana 10 · Sesión 20" />; }
