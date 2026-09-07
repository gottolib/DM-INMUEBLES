import { z } from "zod";

// Esquemas de validación compartidos entre formularios (cliente) y
// API routes (servidor), para que las reglas nunca queden desincronizadas.

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre completo."),
  telefono: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono de contacto válido.")
    .max(30)
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Ingresá un email válido.").optional().or(z.literal("")),
  mensaje: z.string().trim().min(5, "Contanos brevemente tu consulta."),
  propiedadId: z.string().optional().nullable(),
});

export type ContactoInput = z.infer<typeof contactoSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresá un email válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export type LoginInput = z.infer<typeof loginSchema>;

const numeroOpcional = z.preprocess(
  (val) => (val === "" || val == null ? undefined : Number(val)),
  z.number().nonnegative().optional()
);

export const propiedadSchema = z
  .object({
    titulo: z.string().trim().min(5, "El título debe tener al menos 5 caracteres."),
    descripcion: z.string().trim().min(20, "La descripción debe tener al menos 20 caracteres."),
    tipoOperacion: z.enum(["VENTA", "ALQUILER", "ALQUILER_TEMPORARIO"]),
    tipoPropiedadId: z.string().min(1, "Seleccioná un tipo de propiedad."),
    estadoDestacado: z.enum(["DESTACADA", "EXCELENTE", "BUENA", "NINGUNO"]).default("NINGUNO"),
    estadoPublicacion: z
      .enum(["ACTIVA", "INACTIVA", "VENDIDA", "ALQUILADA", "BORRADOR"])
      .default("BORRADOR"),
    direccion: z.string().trim().optional().or(z.literal("")),
    zona: z.string().trim().optional().or(z.literal("")),
    localidad: z.string().trim().min(1, "Ingresá la localidad."),
    superficieTotal: numeroOpcional,
    superficieCubierta: numeroOpcional,
    ambientes: numeroOpcional,
    dormitorios: numeroOpcional,
    banos: numeroOpcional,
    cochera: z.boolean().default(false),
    antiguedad: numeroOpcional,
    precio: numeroOpcional,
    moneda: z.enum(["USD", "ARS"]).default("USD"),
    consultarPrecio: z.boolean().default(false),
    destacadaHome: z.boolean().default(false),
  })
  .refine((data) => data.consultarPrecio || data.precio != null, {
    message: "Ingresá un precio o marcá la opción 'Consultar precio'.",
    path: ["precio"],
  });

export type PropiedadInput = z.infer<typeof propiedadSchema>;

export const configuracionSchema = z.object({
  telefono: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().min(6, "Ingresá un número de WhatsApp válido (solo números, con código de país)."),
  email: z.string().trim().email("Ingresá un email válido.").optional().or(z.literal("")),
  direccion: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  instagramUrl: z.string().trim().optional().or(z.literal("")),
  horarios: z.string().trim().optional().or(z.literal("")),
  textoQuienesSomos: z.string().trim().optional().or(z.literal("")),
});

export type ConfiguracionInput = z.infer<typeof configuracionSchema>;

export const filtrosPropiedadesSchema = z.object({
  operacion: z.enum(["VENTA", "ALQUILER", "ALQUILER_TEMPORARIO"]).optional(),
  tipo: z.string().optional(),
  ubicacion: z.string().optional(),
  ambientes: z.coerce.number().optional(),
  precioMin: z.coerce.number().optional(),
  precioMax: z.coerce.number().optional(),
  superficieMin: z.coerce.number().optional(),
  orden: z.enum(["recientes", "precio-asc", "precio-desc"]).optional(),
  pagina: z.coerce.number().min(1).default(1),
});

export type FiltrosPropiedades = z.infer<typeof filtrosPropiedadesSchema>;
