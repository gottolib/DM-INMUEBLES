import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// El panel admin nunca debe indexarse en buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // El login tiene su propio layout minimalista; para el resto exigimos sesión
  // (el proxy/middleware ya redirige, esto es una segunda capa de defensa).
  if (!session) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  const mensajesSinLeer = await prisma.mensaje.count({ where: { leido: false } });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream">
      <AdminSidebar nombre={session.user?.name ?? session.user?.email ?? "Administrador"} mensajesSinLeer={mensajesSinLeer} />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
