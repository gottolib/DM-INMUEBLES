import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getTodosTiposPropiedad } from "@/lib/properties";
import { actualizarPropiedadAction } from "@/app/admin/propiedades/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Editar propiedad | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creada?: string; guardada?: string }>;
}

export default async function EditarPropiedadPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { creada, guardada } = await searchParams;

  const [propiedad, tipos] = await Promise.all([
    prisma.propiedad.findUnique({ where: { id }, include: { imagenes: { orderBy: { orden: "asc" } }, tipoPropiedad: true } }),
    getTodosTiposPropiedad(),
  ]);

  if (!propiedad) notFound();

  const actualizarConId = actualizarPropiedadAction.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-1">Editar propiedad</h1>
      <p className="text-sm text-text/60 mb-2">
        {propiedad.codigo} · {propiedad.titulo}
      </p>
      {creada === "1" && (
        <p className="text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 mb-6 inline-block">
          Propiedad creada. Ahora subí las fotos más abajo.
        </p>
      )}
      {guardada === "1" && (
        <p className="text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 mb-6 inline-block">
          Cambios guardados correctamente.
        </p>
      )}
      <div className="mt-6">
        <PropertyForm tipos={tipos} propiedad={propiedad} action={actualizarConId} />
      </div>
    </div>
  );
}
