// Catálogo curado de tipografías que se pueden elegir desde
// /admin/configuracion para cada rol de texto (título, subtítulo,
// característica, precio). Es una lista cerrada (no texto libre) a
// propósito: así garantizamos que la fuente elegida efectivamente
// existe en Google Fonts y se ve bien, sin que el admin tenga que saber
// nada de tipografía.
//
// Las fuentes se cargan en tiempo de request (no con next/font, que
// exige que el import sea estático) armando la URL de Google Fonts con
// las familias realmente elegidas — así solo se descargan las 1 a 4
// tipografías que el sitio usa, nunca las 8 del catálogo completo.

export interface FuenteCatalogo {
  key: string;
  etiqueta: string;
  /** Nombre exacto tal como lo espera la API de Google Fonts. */
  familiaGoogle: string;
  /** Pesos a pedir, formato de la API de Google Fonts (ej. "400;600;700"). */
  pesos: string;
  /** Pila de fuentes de respaldo por si Google Fonts no carga. */
  fallback: string;
}

export const CATALOGO_FUENTES: FuenteCatalogo[] = [
  { key: "playfair", etiqueta: "Playfair Display — serif elegante", familiaGoogle: "Playfair Display", pesos: "500;600;700", fallback: "Georgia, serif" },
  { key: "cormorant", etiqueta: "Cormorant Garamond — serif clásica", familiaGoogle: "Cormorant Garamond", pesos: "500;600;700", fallback: "Georgia, serif" },
  { key: "lora", etiqueta: "Lora — serif suave", familiaGoogle: "Lora", pesos: "500;600;700", fallback: "Georgia, serif" },
  { key: "merriweather", etiqueta: "Merriweather — serif de lectura", familiaGoogle: "Merriweather", pesos: "400;700", fallback: "Georgia, serif" },
  { key: "inter", etiqueta: "Inter — sans moderna", familiaGoogle: "Inter", pesos: "400;500;600;700", fallback: "system-ui, sans-serif" },
  { key: "montserrat", etiqueta: "Montserrat — sans geométrica", familiaGoogle: "Montserrat", pesos: "400;500;600;700", fallback: "system-ui, sans-serif" },
  { key: "poppins", etiqueta: "Poppins — sans redondeada", familiaGoogle: "Poppins", pesos: "400;500;600;700", fallback: "system-ui, sans-serif" },
  { key: "raleway", etiqueta: "Raleway — sans fina", familiaGoogle: "Raleway", pesos: "400;500;600;700", fallback: "system-ui, sans-serif" },
];

export const CLAVES_FUENTES = CATALOGO_FUENTES.map((f) => f.key) as [string, ...string[]];

export function getFuente(key: string): FuenteCatalogo {
  return CATALOGO_FUENTES.find((f) => f.key === key) ?? CATALOGO_FUENTES[0];
}

/** font-family CSS con fallback, para usar en `--font-<rol>`. */
export function fontFamilyCss(key: string): string {
  const fuente = getFuente(key);
  return `"${fuente.familiaGoogle}", ${fuente.fallback}`;
}

/** URL de Google Fonts que carga únicamente las fuentes efectivamente elegidas (sin duplicar). */
export function construirUrlGoogleFonts(keys: string[]): string {
  const unicas = Array.from(new Set(keys));
  const familias = unicas
    .map((k) => {
      const f = getFuente(k);
      return `family=${encodeURIComponent(f.familiaGoogle)}:wght@${f.pesos}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${familias}&display=swap`;
}

export interface RolesTipografia {
  tituloFuente: string;
  tituloColor: string;
  subtituloFuente: string;
  subtituloColor: string;
  caracteristicaFuente: string;
  caracteristicaColor: string;
  precioFuente: string;
  precioColor: string;
}

const HEX_VALIDO = /^#[0-9A-Fa-f]{6}$/;

/** Color validado, o un gris neutro si por algún motivo no es un hex válido (defensa extra, ya se valida al guardar). */
function colorSeguro(color: string): string {
  return HEX_VALIDO.test(color) ? color : "#2a2a2a";
}

/** CSS que define las variables --font-<rol> y --color-<rol> según la configuración del sitio. */
export function construirEstiloRoles(config: RolesTipografia): string {
  return `:root{
  --font-titulo:${fontFamilyCss(config.tituloFuente)};
  --color-titulo:${colorSeguro(config.tituloColor)};
  --font-subtitulo:${fontFamilyCss(config.subtituloFuente)};
  --color-subtitulo:${colorSeguro(config.subtituloColor)};
  --font-caracteristica:${fontFamilyCss(config.caracteristicaFuente)};
  --color-caracteristica:${colorSeguro(config.caracteristicaColor)};
  --font-precio:${fontFamilyCss(config.precioFuente)};
  --color-precio:${colorSeguro(config.precioColor)};
}`;
}
