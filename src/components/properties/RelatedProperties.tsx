import { PropertyCard } from "@/components/properties/PropertyCard";
import type { PropiedadConPortada } from "@/types/propiedad";

export function RelatedProperties({ propiedades }: { propiedades: PropiedadConPortada[] }) {
  if (propiedades.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl text-charcoal mb-6">Propiedades similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {propiedades.map((p) => (
          <PropertyCard key={p.id} propiedad={p} />
        ))}
      </div>
    </section>
  );
}
