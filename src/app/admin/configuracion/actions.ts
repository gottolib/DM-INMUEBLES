"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { configuracionSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import type { FormActionState } from "@/app/admin/propiedades/actions";

export async function guardarConfiguracionAction(_prevState: FormActionState, formData: FormData): Promise<FormActionState> {
  const session = await auth();
  if (!session) return { error: "Tu sesión expiró. Volvé a iniciar sesión." };

  const datos = {
    telefono: String(formData.get("telefono") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    direccion: String(formData.get("direccion") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    horarios: String(formData.get("horarios") ?? ""),
    textoQuienesSomos: String(formData.get("textoQuienesSomos") ?? ""),
    tituloFuente: String(formData.get("tituloFuente") ?? ""),
    tituloColor: String(formData.get("tituloColor") ?? ""),
    subtituloFuente: String(formData.get("subtituloFuente") ?? ""),
    subtituloColor: String(formData.get("subtituloColor") ?? ""),
    caracteristicaFuente: String(formData.get("caracteristicaFuente") ?? ""),
    caracteristicaColor: String(formData.get("caracteristicaColor") ?? ""),
    precioFuente: String(formData.get("precioFuente") ?? ""),
    precioColor: String(formData.get("precioColor") ?? ""),
  };

  const parsed = configuracionSchema.safeParse(datos);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors: Record<string, string> = {};
    for (const [campo, mensajes] of Object.entries(flat.fieldErrors)) {
      if (mensajes?.[0]) fieldErrors[campo] = mensajes[0];
    }
    return { error: "Revisá los campos marcados.", fieldErrors };
  }

  await prisma.configuracionSitio.upsert({
    where: { id: "config" },
    update: parsed.data,
    create: { id: "config", ...parsed.data },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
