import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Propiedades",
  description: "Explorá todas las propiedades en venta y alquiler de DM Inmobiliaria en Goya, Corrientes.",
};

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <PropertyListingPage
      titulo="Todas las propiedades"
      descripcion="Filtrá por operación, tipo, ubicación y precio para encontrar la propiedad ideal."
      basePath="/propiedades"
      searchParams={params}
    />
  );
}
