import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Propiedades en Alquiler",
  description: "Casas, departamentos y locales en alquiler en Goya, Corrientes.",
};

export default async function AlquilerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <PropertyListingPage
      titulo="Propiedades en Alquiler"
      descripcion="Casas, departamentos y locales disponibles para alquiler."
      basePath="/propiedades/alquiler"
      operacionFija="ALQUILER"
      searchParams={params}
    />
  );
}
