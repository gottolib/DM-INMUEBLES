import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Alquiler Temporario",
  description: "Propiedades para alquiler temporario por día, fin de semana o temporada en Goya, Corrientes.",
};

export default async function AlquilerTemporarioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <PropertyListingPage
      titulo="Alquiler Temporario"
      descripcion="Casas y quinchos para tu descanso de fin de semana o vacaciones."
      basePath="/propiedades/alquiler-temporario"
      operacionFija="ALQUILER_TEMPORARIO"
      searchParams={params}
    />
  );
}
