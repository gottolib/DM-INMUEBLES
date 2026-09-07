import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eliminarImagen } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id, imageId } = await params;
  const imagen = await prisma.imagenPropiedad.findUnique({ where: { id: imageId, propiedadId: id } });
  if (!imagen) return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });

  await prisma.imagenPropiedad.delete({ where: { id: imageId } });
  await eliminarImagen(imagen.url);

  // Si borramos la portada, la siguiente imagen en orden pasa a ser portada.
  if (imagen.esPortada) {
    const siguiente = await prisma.imagenPropiedad.findFirst({
      where: { propiedadId: id },
      orderBy: { orden: "asc" },
    });
    if (siguiente) {
      await prisma.imagenPropiedad.update({ where: { id: siguiente.id }, data: { esPortada: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
