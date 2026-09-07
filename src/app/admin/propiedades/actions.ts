"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { propiedadSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { getSiguienteCodigo } from "@/lib/properties";
import { eliminarImagen } from "@/lib/storage";
import { auth } from "@/lib/auth";

export interface FormActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

function extraerDatos(formData: FormData) {
  const num = (key: string) => {
    const val = formData.get(key);
    return val && val !== "" ? val : undefined;
  };

  return {
    titulo: String(formData.get("titulo") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    tipoOperacion: String(formData.get("tipoOperacion") ?? ""),
    tipoPropiedadId: String(formData.get("tipoPropiedadId") ?? ""),
    estadoDestacado: String(formData.get("estadoDestacado") ?? "NINGUNO"),
    estadoPublicacion: resolverEstadoPublicacion(formData),
    direccion: String(formData.get("direccion") ?? ""),
    zona: String(formData.get("zona") ?? ""),
    localidad: String(formData.get("localidad") ?? "Goya, Corrientes"),
    superficieTotal: num("superficieTotal"),
    superficieCubierta: num("superficieCubierta"),
    ambientes: num("ambientes"),
    dormitorios: num("dormitorios"),
    banos: num("banos"),
    cochera: formData.get("cochera") === "on",
    antiguedad: num("antiguedad"),
    precio: num("precio"),
    moneda: String(formData.get("moneda") ?? "USD"),
    consultarPrecio: formData.get("consultarPrecio") === "on",
    destacadaHome: formData.get("destacadaHome") === "on",
  };
}

function resolverEstadoPublicacion(formData: FormData): "ACTIVA" | "BORRADOR" | "INACTIVA" | "VENDIDA" | "ALQUILADA" {
  const intent = formData.get("intent");
  if (intent === "publicar") return "ACTIVA";
  if (intent === "borrador") return "BORRADOR";
  const seleccionado = formData.get("estadoPublicacion");
  const validos = ["ACTIVA", "BORRADOR", "INACTIVA", "VENDIDA", "ALQUILADA"];
  return validos.includes(String(seleccionado)) ? (seleccionado as "ACTIVA") : "BORRADOR";
}

function primerErrorPorCampo(flatten: { fieldErrors: Record<string, string[] | undefined> }) {
  const errores: Record<string, string> = {};
  for (const [campo, mensajes] of Object.entries(flatten.fieldErrors)) {
    if (mensajes && mensajes[0]) errores[campo] = mensajes[0];
  }
  return errores;
}

export async function crearPropiedadAction(_prevState: FormActionState, formData: FormData): Promise<FormActionState> {
  const session = await auth();
  if (!session) return { error: "Tu sesión expiró. Volvé a iniciar sesión." };

  const datos = extraerDatos(formData);
  const parsed = propiedadSchema.safeParse(datos);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return { error: "Revisá los campos marcados.", fieldErrors: primerErrorPorCampo(flat) };
  }

  const codigo = await getSiguienteCodigo();
  const slug = `${slugify(parsed.data.titulo)}-${codigo.toLowerCase()}`;

  const propiedad = await prisma.propiedad.create({
    data: { ...parsed.data, codigo, slug },
  });

  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  redirect(`/admin/propiedades/${propiedad.id}/editar?creada=1`);
}

export async function actualizarPropiedadAction(
  id: string,
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const session = await auth();
  if (!session) return { error: "Tu sesión expiró. Volvé a iniciar sesión." };

  const datos = extraerDatos(formData);
  const parsed = propiedadSchema.safeParse(datos);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return { error: "Revisá los campos marcados.", fieldErrors: primerErrorPorCampo(flat) };
  }

  await prisma.propiedad.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  revalidatePath(`/admin/propiedades/${id}/editar`);
  redirect(`/admin/propiedades/${id}/editar?guardada=1`);
}

export async function eliminarPropiedadAction(id: string): Promise<void> {
  const session = await auth();
  if (!session) return;

  const propiedad = await prisma.propiedad.findUnique({ where: { id }, include: { imagenes: true } });
  if (!propiedad) return;

  await Promise.all(propiedad.imagenes.map((img) => eliminarImagen(img.url)));
  await prisma.propiedad.delete({ where: { id } });

  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
}

export async function toggleDestacadaHomeAction(id: string, valor: boolean): Promise<void> {
  const session = await auth();
  if (!session) return;
  await prisma.propiedad.update({ where: { id }, data: { destacadaHome: valor } });
  revalidatePath("/admin/propiedades");
  revalidatePath("/");
}

export async function cambiarEstadoPublicacionAction(id: string, estado: string): Promise<void> {
  const session = await auth();
  if (!session) return;
  const validos = ["ACTIVA", "BORRADOR", "INACTIVA", "VENDIDA", "ALQUILADA"];
  if (!validos.includes(estado)) return;
  await prisma.propiedad.update({ where: { id }, data: { estadoPublicacion: estado as "ACTIVA" } });
  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
}
