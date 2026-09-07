import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactoSchema } from "@/lib/validations";
import { verificarRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonimo";
  if (!verificarRateLimit(ip)) {
    return NextResponse.json({ error: "Demasiadas consultas enviadas. Probá de nuevo en un minuto." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisá los datos del formulario.", detalles: parsed.error.flatten() }, { status: 400 });
  }

  const { nombre, telefono, email, mensaje, propiedadId } = parsed.data;

  let propiedadIdValido: string | null = null;
  if (propiedadId) {
    const existe = await prisma.propiedad.findUnique({ where: { id: propiedadId }, select: { id: true } });
    if (existe) propiedadIdValido = existe.id;
  }

  await prisma.mensaje.create({
    data: {
      nombre,
      telefono: telefono || null,
      email: email || null,
      mensaje,
      propiedadId: propiedadIdValido,
    },
  });

  return NextResponse.json({ ok: true });
}
