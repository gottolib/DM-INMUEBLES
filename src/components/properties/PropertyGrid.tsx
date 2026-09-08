import { PropertyCard } from "@/components/properties/PropertyCard";
import { Pagination } from "@/components/properties/Pagination";
import type { PropiedadConPortada } from "@/types/propiedad";

interface PropertyGridProps {
  items: PropiedadConPortada[];
  total: number;
  totalPaginas: number;
  pagina: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export function PropertyGrid({ items, total, totalPaginas, pagina, basePath, searchParams }: PropertyGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gold-light/60 rounded-xl">
        <p className="texto-titulo text-xl mb-2">No encontramos propiedades con esos filtros</p>
        <p className="text-sm text-text/60">Probá ampliar el rango de precios o cambiar la zona de búsqueda.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text/60 mb-6">{total} propiedad{total !== 1 ? "es" : ""} encontrada{total !== 1 ? "s" : ""}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((propiedad) => (
          <PropertyCard key={propiedad.id} propiedad={propiedad} />
        ))}
      </div>
      <Pagination pagina={pagina} totalPaginas={totalPaginas} basePath={basePath} searchParams={searchParams} />
    </div>
  );
}
