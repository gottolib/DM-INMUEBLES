import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { crearAdminYConfigBase } from "@/lib/bootstrap";

/**
 * Endpoint de "primer arranque" para producción: crea (o actualiza) el
 * usuario administrador, la configuración base del sitio y los tipos de
 * propiedad, sin necesidad de tener Node/Prisma instalados localmente ni
 * acceso directo a la base de datos.
 *
 * Está desactivado por defecto: solo funciona si configurás la variable de
 * entorno SETUP_SECRET en Vercel. Visitando
 * https://tu-sitio.vercel.app/api/setup?token=EL_MISMO_VALOR
 * se ejecuta. Es seguro volver a visitarla más de una vez (por ejemplo,
 * para "resetear" la contraseña de admin: cambiás ADMIN_PASSWORD en Vercel,
 * volvés a desplegar, y visitás esta URL de nuevo).
 *
 * Recomendación: una vez que ya pudiste entrar a /admin, borrá la variable
 * SETUP_SECRET de Vercel para desactivar este endpoint.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Este endpoint está desactivado. Configurá SETUP_SECRET en las variables de entorno para habilitarlo." },
      { status: 404 }
    );
  }

  const token = req.nextUrl.searchParams.get("token") ?? "";
  const tokenBuffer = Buffer.from(token);
  const secretBuffer = Buffer.from(secret);
  const coincide =
    tokenBuffer.length === secretBuffer.length && crypto.timingSafeEqual(tokenBuffer, secretBuffer);

  if (!coincide) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const { adminEmail } = await crearAdminYConfigBase();

  return NextResponse.json({
    ok: true,
    mensaje: `Listo. Ya podés entrar a /admin/login con el email ${adminEmail} y la contraseña definida en ADMIN_PASSWORD.`,
  });
}
