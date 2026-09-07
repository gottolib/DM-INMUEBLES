import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { buscarPropiedades, getTiposConPropiedadesActivas, type FiltrosBusqueda } from "@/lib/properties";
import { filtrosPropiedadesSchema } from "@/lib/validations";
import type { TipoOperacion } from "@prisma/client";

interface PropertyListingPageProps {
  titulo: string;
  descripcion: string;
  basePath: string;
  operacionFija?: TipoOperacion;
  searchParams: Record<string, string | undefined>;
}

export async function PropertyListingPage({ titulo, descripcion, basePath, operacionFija, searchParams }: PropertyListingPageProps) {
  const parsed = filtrosPropiedadesSchema.safeParse({
    operacion: operacionFija ?? searchParams.operacion,
    tipo: searchParams.tipo,
    ubicacion: searchParams.ubicacion,
    ambientes: searchParams.ambientes,
    precioMin: searchParams.precioMin,
    precioMax: searchParams.precioMax,
    superficieMin: searchParams.superficieMin,
    orden: searchParams.orden,
    pagina: searchParams.pagina,
  });

  const filtros: FiltrosBusqueda = parsed.success
    ? parsed.data
    : { pagina: 1 };

  const [{ items, total, totalPaginas, pagina }, tipos] = await Promise.all([
    buscarPropiedades(filtros),
    getTiposConPropiedadesActivas(operacionFija),
  ]);

  return (
    <div className="container-site py-12">
      <div className="max-w-2xl mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">{titulo}</h1>
        <p className="text-text/60">{descripcion}</p>
      </div>

      <div className="mb-8">
        <PropertyFilters basePath={basePath} tipos={tipos} mostrarOperacion={!operacionFija} />
      </div>

      <PropertyGrid items={items} total={total} totalPaginas={totalPaginas} pagina={pagina} basePath={basePath} searchParams={searchParams} />
    </div>
  );
}
