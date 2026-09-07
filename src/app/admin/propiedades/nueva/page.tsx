import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getTodosTiposPropiedad } from "@/lib/properties";
import { crearPropiedadAction } from "@/app/admin/propiedades/actions";

export const metadata: Metadata = { title: "Nueva propiedad | Admin" };

export default async function NuevaPropiedadPage() {
  const tipos = await getTodosTiposPropiedad();

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-1">Cargar nueva propiedad</h1>
      <p className="text-sm text-text/60 mb-8">
        Completá los datos y guardala como borrador o publicala directamente. Vas a poder subir las fotos justo después de crearla.
      </p>
      <PropertyForm tipos={tipos} action={crearPropiedadAction} />
    </div>
  );
}
