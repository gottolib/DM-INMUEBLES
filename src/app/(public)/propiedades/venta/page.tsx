import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Propiedades en Venta",
  description: "Casas, departamentos, terrenos y campos en venta en Goya, Corrientes.",
};

export default async function VentaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <PropertyListingPage
      titulo="Propiedades en Venta"
      descripcion="Encontrá tu próxima casa, departamento, terreno o campo en venta."
      basePath="/propiedades/venta"
      operacionFija="VENTA"
      searchParams={params}
    />
  );
}
