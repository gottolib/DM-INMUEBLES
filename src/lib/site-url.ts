// Resuelve la URL pública del sitio de forma robusta: si NEXT_PUBLIC_SITE_URL
// no está seteada (o quedó vacía por error en el panel de variables de
// entorno del hosting), usa la URL que Vercel provee automáticamente para
// cada deploy (VERCEL_URL) y, como último recurso, localhost. Evita que un
// error de configuración de esa única variable rompa el build entero
// (new URL("") lanza una excepción).
function resolverSiteUrl(): string {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurada) return configurada;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolverSiteUrl();
