import Link from "next/link";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { PropiedadConPortada } from "@/types/propiedad";

export function FeaturedGrid({ propiedades }: { propiedades: PropiedadConPortada[] }) {
  if (propiedades.length === 0) return null;

  return (
    <section className="container-site py-16 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-dark font-semibold mb-2">Selección</p>
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal">Propiedades Destacadas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {propiedades.map((p) => (
          <PropertyCard key={p.id} propiedad={p} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/propiedades"
          className="inline-block border border-gold text-gold-dark hover:bg-gold hover:text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-8 py-3 transition-colors"
        >
          Ver todas las propiedades
        </Link>
      </div>
    </section>
  );
}
