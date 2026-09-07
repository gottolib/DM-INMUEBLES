import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard | Admin DM Inmobiliaria" };

export default async function AdminDashboardPage() {
  const [activas, enVenta, enAlquiler, sinLeer, total] = await Promise.all([
    prisma.propiedad.count({ where: { estadoPublicacion: "ACTIVA" } }),
    prisma.propiedad.count({ where: { estadoPublicacion: "ACTIVA", tipoOperacion: "VENTA" } }),
    prisma.propiedad.count({ where: { estadoPublicacion: "ACTIVA", tipoOperacion: { in: ["ALQUILER", "ALQUILER_TEMPORARIO"] } } }),
    prisma.mensaje.count({ where: { leido: false } }),
    prisma.propiedad.count(),
  ]);

  const stats = [
    { label: "Propiedades activas", valor: activas },
    { label: "En venta", valor: enVenta },
    { label: "En alquiler", valor: enAlquiler },
    { label: "Mensajes sin leer", valor: sinLeer, destacar: sinLeer > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-1">Dashboard</h1>
      <p className="text-sm text-text/60 mb-8">Resumen general de DM Inmobiliaria ({total} propiedades cargadas en total).</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-6 border ${s.destacar ? "bg-gold/10 border-gold" : "bg-white border-gold-light/40"}`}>
            <p className="text-3xl font-display font-semibold text-charcoal">{s.valor}</p>
            <p className="text-sm text-text/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/propiedades/nueva" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-6 py-3 transition-colors">
          + Cargar propiedad
        </Link>
        <Link href="/admin/mensajes" className="border border-gold text-gold-dark hover:bg-gold hover:text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-6 py-3 transition-colors">
          Ver mensajes
        </Link>
      </div>
    </div>
  );
}
