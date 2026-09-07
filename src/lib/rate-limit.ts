// Rate limiting simple en memoria para el formulario de contacto público.
// Suficiente para desalentar spam básico en un sitio de tráfico bajo/medio.
// Nota: en un entorno serverless con múltiples instancias (p. ej. Vercel)
// este contador no se comparte entre instancias; para un control más
// estricto en producción conviene una solución externa (p. ej. Upstash
// Redis). Se documenta esta limitación en el README.
const intentos = new Map<string, { count: number; resetAt: number }>();

const VENTANA_MS = 60_000;
const MAX_INTENTOS = 5;

export function verificarRateLimit(clave: string): boolean {
  const ahora = Date.now();
  const registro = intentos.get(clave);

  if (!registro || ahora > registro.resetAt) {
    intentos.set(clave, { count: 1, resetAt: ahora + VENTANA_MS });
    return true;
  }

  if (registro.count >= MAX_INTENTOS) return false;

  registro.count++;
  return true;
}
