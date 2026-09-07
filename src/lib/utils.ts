import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Convierte un texto en un slug amigable para URLs (sin tildes, minúsculas, guiones). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrecio(precio: number | null | undefined, moneda: string, consultarPrecio: boolean): string {
  if (consultarPrecio || precio == null) return "Consultar precio";
  const simbolo = moneda === "USD" ? "US$" : moneda === "ARS" ? "$" : moneda;
  return `${simbolo} ${new Intl.NumberFormat("es-AR").format(precio)}`;
}

export function formatSuperficie(m2: number | null | undefined): string | null {
  if (m2 == null) return null;
  return `${new Intl.NumberFormat("es-AR").format(m2)} m²`;
}

const TIPO_OPERACION_LABEL: Record<string, string> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
  ALQUILER_TEMPORARIO: "Alquiler Temporario",
};

export function tipoOperacionLabel(tipo: string): string {
  return TIPO_OPERACION_LABEL[tipo] ?? tipo;
}

const TIPO_OPERACION_SLUG: Record<string, string> = {
  VENTA: "venta",
  ALQUILER: "alquiler",
  ALQUILER_TEMPORARIO: "alquiler-temporario",
};

export function tipoOperacionSlug(tipo: string): string {
  return TIPO_OPERACION_SLUG[tipo] ?? tipo.toLowerCase();
}

export function tipoOperacionDesdeSlug(slug: string): string | null {
  const entry = Object.entries(TIPO_OPERACION_SLUG).find(([, s]) => s === slug);
  return entry ? entry[0] : null;
}

const ESTADO_DESTACADO_LABEL: Record<string, string> = {
  DESTACADA: "Destacada",
  EXCELENTE: "Excelente",
  BUENA: "Buena",
  NINGUNO: "",
};

export function estadoDestacadoLabel(estado: string): string {
  return ESTADO_DESTACADO_LABEL[estado] ?? "";
}

/** Arma el link de WhatsApp con mensaje precargado para consultar por una propiedad. */
export function whatsappPropiedadUrl(numero: string, codigo: string, titulo: string): string {
  const mensaje = `Hola, quiero consultar por la propiedad N° ${codigo} - ${titulo}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function whatsappGenericoUrl(numero: string, mensaje = "Hola, quiero más información."): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Genera un código de propiedad autoincremental legible, ej: DM-1042. */
export function generarCodigo(secuencia: number): string {
  return `DM-${1000 + secuencia}`;
}
