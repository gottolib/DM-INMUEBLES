import { prisma } from "@/lib/prisma";

// Valores por defecto si todavía no se sembró/editó la configuración
// desde /admin/configuracion. Así el sitio nunca se rompe por falta de datos.
const DEFAULTS = {
  telefono: "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: "",
  direccion: "",
  facebookUrl: "",
  instagramUrl: "",
  horarios: "",
  textoQuienesSomos: "",
  tituloFuente: "playfair",
  tituloColor: "#1e1e24",
  subtituloFuente: "inter",
  subtituloColor: "#9c7a2e",
  caracteristicaFuente: "inter",
  caracteristicaColor: "#2a2a2a",
  precioFuente: "playfair",
  precioColor: "#9c7a2e",
};

export async function getSiteConfig() {
  const config = await prisma.configuracionSitio.findUnique({ where: { id: "config" } });
  if (!config) return { id: "config", ...DEFAULTS };
  return config;
}
