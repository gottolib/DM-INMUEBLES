import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Prisma, EstadoPublicacion, TipoOperacion } from "@prisma/client";
import { formatPrecio } from "@/lib/utils";
import { PropertyRowActions } from "@/components/admin/PropertyRowActions";

export const metadata: Metadata = { title: "Propiedades | Admin" };

interface PageProps {
  searchParams: Promise<{ q?: string; estado?: string; operacion?: string }>;
}

export default async function AdminPropiedadesPage({ searchParams }: PageProps) {
  const { q, estado, operacion } = await searchParams;

  const where: Prisma.PropiedadWhereInput = {};
  if (q) {
    where.OR = [
      { titulo: { contains: q } },
      { codigo: { contains: q } },
      { zona: { contains: q } },
    ];
  }
  if (estado && estado in EstadoPublicacion) where.estadoPublicacion = estado as EstadoPublicacion;
  if (operacion && operacion in TipoOperacion) where.tipoOperacion = operacion as TipoOperacion;

  const propiedades = await prisma.propiedad.findMany({
    where,
    include: { imagenes: { orderBy: { orden: "asc" }, take: 1 }, tipoPropiedad: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-charcoal">Propiedades</h1>
        <Link href="/admin/propiedades/nueva" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-6 py-2.5 transition-colors">
          + Nueva propiedad
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-6" method="GET">
        <input name="q" defaultValue={q} placeholder="Buscar por título, código o zona..." className="input-brand flex-1 min-w-[220px]" />
        <select name="estado" defaultValue={estado ?? ""} className="select-brand">
          <option value="">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
          <option value="VENDIDA">Vendida</option>
          <option value="ALQUILADA">Alquilada</option>
        </select>
        <select name="operacion" defaultValue={operacion ?? ""} className="select-brand">
          <option value="">Todas las operaciones</option>
          <option value="VENTA">Venta</option>
          <option value="ALQUILER">Alquiler</option>
          <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
        </select>
        <button type="submit" className="border border-gold text-gold-dark hover:bg-gold hover:text-charcoal rounded-full px-5 py-2 text-sm font-medium transition-colors">
          Filtrar
        </button>
      </form>

      <div className="bg-white border border-gold-light/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-charcoal/70 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Propiedad</th>
                <th className="text-left px-4 py-3">Código</th>
                <th className="text-left px-4 py-3">Operación</th>
                <th className="text-left px-4 py-3">Precio</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((p) => (
                <tr key={p.id} className="border-t border-gold-light/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/propiedades/${p.id}/editar`} className="flex items-center gap-3 hover:text-gold-dark">
                      <div className="relative w-14 h-11 rounded overflow-hidden bg-cream shrink-0">
                        {p.imagenes[0] && <Image src={p.imagenes[0].url} alt="" fill sizes="56px" className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal line-clamp-1">{p.titulo}</p>
                        <p className="text-xs text-text/50">{p.tipoPropiedad.nombre}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text/60">{p.codigo}</td>
                  <td className="px-4 py-3 text-text/60">{p.tipoOperacion.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-text/60">{formatPrecio(p.precio, p.moneda, p.consultarPrecio)}</td>
                  <td className="px-4 py-3">
                    <PropertyRowActions id={p.id} destacadaHome={p.destacadaHome} estadoPublicacion={p.estadoPublicacion} />
                  </td>
                </tr>
              ))}
              {propiedades.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-text/50">
                    No hay propiedades que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
