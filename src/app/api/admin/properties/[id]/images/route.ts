import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { guardarImagen, TIPOS_PERMITIDOS, TAMANO_MAXIMO_BYTES } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function crearImagenes(propiedadId: string, urls: string[]) {
  const propiedad = await prisma.propiedad.findUnique({ where: { id: propiedadId }, include: { imagenes: true } });
  if (!propiedad) return null;

  let siguienteOrden = propiedad.imagenes.length;
  const sinPortadaAun = propiedad.imagenes.every((img) => !img.esPortada);

  const creadas = [];
  for (const url of urls) {
    const imagen = await prisma.imagenPropiedad.create({
      data: {
        propiedadId,
        url,
        orden: siguienteOrden,
        esPortada: sinPortadaAun && siguienteOrden === 0,
      },
    });
    creadas.push(imagen);
    siguienteOrden++;
  }
  return creadas;
}

// Sube una o varias imágenes para una propiedad (drag & drop desde el admin).
//
// Acepta dos formatos de body:
// - multipart/form-data con campo "files": usado con STORAGE_PROVIDER=local,
//   el archivo se recibe acá y se guarda en disco (ver src/lib/storage.ts).
// - application/json con { urls: string[] }: usado con STORAGE_PROVIDER=cloudinary,
//   donde el navegador ya subió el archivo directo a Cloudinary (para no
//   chocar con el límite de tamaño de request de las funciones serverless
//   de Vercel) y acá solo guardamos la URL final en la base de datos.
export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    const urls: unknown = body?.urls;
    if (!Array.isArray(urls) || urls.some((u) => typeof u !== "string" || !u.startsWith("https://"))) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }

    const creadas = await crearImagenes(id, urls as string[]);
    if (!creadas) return NextResponse.json({ error: "Propiedad no encontrada." }, { status: 404 });
    return NextResponse.json({ imagenes: creadas });
  }

  const propiedad = await prisma.propiedad.findUnique({ where: { id }, select: { id: true } });
  if (!propiedad) return NextResponse.json({ error: "Propiedad no encontrada." }, { status: 404 });

  const formData = await req.formData();
  const archivos = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (archivos.length === 0) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }

  for (const archivo of archivos) {
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      return NextResponse.json({ error: `Formato no permitido: ${archivo.type || archivo.name}. Usá jpg, png o webp.` }, { status: 400 });
    }
    if (archivo.size > TAMANO_MAXIMO_BYTES) {
      return NextResponse.json({ error: `${archivo.name} supera el tamaño máximo de 8MB.` }, { status: 400 });
    }
  }

  const urls: string[] = [];
  for (const archivo of archivos) {
    urls.push(await guardarImagen(archivo));
  }

  const creadas = await crearImagenes(id, urls);
  return NextResponse.json({ imagenes: creadas });
}

// Reordena las imágenes y/o cambia cuál es la portada.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const orden: string[] | undefined = body?.orden;
  const portadaId: string | undefined = body?.portadaId;

  if (!Array.isArray(orden)) {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  await prisma.$transaction([
    ...orden.map((imagenId, index) =>
      prisma.imagenPropiedad.update({
        where: { id: imagenId, propiedadId: id },
        data: { orden: index, ...(portadaId ? { esPortada: imagenId === portadaId } : {}) },
      })
    ),
  ]);

  return NextResponse.json({ ok: true });
}
