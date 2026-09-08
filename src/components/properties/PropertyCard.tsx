import Link from "next/link";
import Image from "next/image";
import { EstadoBadge, OperacionBadge } from "@/components/ui/Badge";
import { formatPrecio, formatSuperficie, tipoOperacionSlug } from "@/lib/utils";
import type { PropiedadConPortada } from "@/types/propiedad";

export function PropertyCard({ propiedad }: { propiedad: PropiedadConPortada }) {
  const portada = propiedad.imagenes[0];
  const superficie = formatSuperficie(propiedad.superficieTotal);

  return (
    <Link
      href={`/propiedades/${propiedad.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gold-light/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        {portada ? (
          <Image
            src={portada.url}
            alt={propiedad.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold-dark/50 text-sm">Sin imagen</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <OperacionBadge operacion={propiedad.tipoOperacion} />
          <EstadoBadge estado={propiedad.estadoDestacado} />
        </div>
        <span className="absolute bottom-3 right-3 text-[11px] font-medium bg-charcoal/80 text-white px-2 py-1 rounded">
          {propiedad.codigo}
        </span>
      </div>

      <div className="p-4">
        <p className="texto-subtitulo text-xs uppercase tracking-wide font-medium mb-1">
          {propiedad.tipoPropiedad.nombre} · {tipoOperacionSlug(propiedad.tipoOperacion) === "alquiler-temporario" ? "Temp." : ""}
        </p>
        <h3 className="texto-titulo text-lg leading-snug line-clamp-2 mb-1">{propiedad.titulo}</h3>
        <p className="texto-caracteristica text-sm opacity-70 mb-3">
          {propiedad.zona ? `${propiedad.zona}, ` : ""}
          {propiedad.localidad}
        </p>

        <div className="flex items-center justify-between">
          <span className="texto-precio text-base font-semibold">
            {formatPrecio(propiedad.precio, propiedad.moneda, propiedad.consultarPrecio)}
          </span>
          {superficie && <span className="texto-caracteristica text-xs opacity-60">{superficie}</span>}
        </div>

        <span className="mt-4 inline-block w-full text-center text-sm font-medium uppercase tracking-wide border border-gold text-gold-dark rounded-full py-2 group-hover:bg-gold group-hover:text-charcoal transition-colors">
          Consultar
        </span>
      </div>
    </Link>
  );
}
