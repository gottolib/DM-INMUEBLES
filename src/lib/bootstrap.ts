import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const TIPOS_BASE = [
  { nombre: "Casa", slug: "casa" },
  { nombre: "Departamento", slug: "departamento" },
  { nombre: "Terreno", slug: "terreno" },
  { nombre: "Campo", slug: "campo" },
  { nombre: "Local Comercial", slug: "local" },
  { nombre: "Oficina", slug: "oficina" },
  { nombre: "Galpón", slug: "galpon" },
  { nombre: "Quincho", slug: "quincho" },
];

/**
 * Crea/actualiza lo mínimo indispensable para poder usar el sitio en un
 * ambiente nuevo (producción incluida): el usuario administrador (a partir
 * de ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME), los tipos de propiedad base
 * para que el formulario del admin tenga opciones, y una configuración de
 * sitio con valores de placeholder editables luego desde /admin/configuracion.
 *
 * A propósito NO carga las propiedades de ejemplo (esas son solo para
 * desarrollo local vía `npm run db:seed`): un sitio en producción debería
 * arrancar con el catálogo vacío, listo para cargar propiedades reales.
 */
export async function crearAdminYConfigBase() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@dminmobiliaria.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "CambiarEstaClave123";
  const adminNombre = process.env.ADMIN_NAME ?? "Administrador DM Inmobiliaria";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, nombre: adminNombre },
    create: { email: adminEmail, passwordHash, nombre: adminNombre },
  });

  await prisma.configuracionSitio.upsert({
    where: { id: "config" },
    update: {},
    create: {
      id: "config",
      telefono: "+54 3777 40-1234",
      whatsapp: process.env.WHATSAPP_NUMBER ?? "5493777123456",
      email: "contacto@dminmobiliaria.com.ar",
      direccion: "Av. Colón 456, Goya, Corrientes",
      facebookUrl: "https://facebook.com/",
      instagramUrl: "https://instagram.com/",
      horarios: "Lunes a viernes de 8 a 12 y de 16 a 20 hs. Sábados de 9 a 12 hs.",
      textoQuienesSomos:
        "Escribí acá la historia, misión y valores de tu inmobiliaria. Podés editar este texto desde /admin/configuracion.",
    },
  });

  for (const tipo of TIPOS_BASE) {
    await prisma.tipoPropiedad.upsert({
      where: { slug: tipo.slug },
      update: { nombre: tipo.nombre },
      create: tipo,
    });
  }

  return { adminEmail };
}
