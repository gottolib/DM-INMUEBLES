import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const leido = typeof body.leido === "boolean" ? body.leido : true;

  const mensaje = await prisma.mensaje.update({ where: { id }, data: { leido } }).catch(() => null);
  if (!mensaje) return NextResponse.json({ error: "Mensaje no encontrado." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
