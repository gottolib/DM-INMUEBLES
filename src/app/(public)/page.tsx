import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { QuickSearch } from "@/components/properties/QuickSearch";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactMapSection } from "@/components/home/ContactMapSection";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { getTiposConPropiedadesActivas, getPropiedadesDestacadasHome } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Inicio",
};

export default async function HomePage() {
  const [destacadasHome, config, tipos] = await Promise.all([
    getPropiedadesDestacadasHome(),
    getSiteConfig(),
    getTiposConPropiedadesActivas(),
  ]);

  let destacadas = destacadasHome;
  if (destacadas.length < 3) {
    const extra = await prisma.propiedad.findMany({
      where: { estadoPublicacion: "ACTIVA", id: { notIn: destacadas.map((p) => p.id) } },
      include: { imagenes: { orderBy: { orden: "asc" }, take: 1 }, tipoPropiedad: true },
      orderBy: { createdAt: "desc" },
      take: 6 - destacadas.length,
    });
    destacadas = [...destacadas, ...extra];
  }

  return (
    <>
      <div className="relative">
        <Hero propiedades={destacadas.slice(0, 5)} />
        <div className="container-site relative z-10 -mt-8 sm:-mt-10">
          <QuickSearch tipos={tipos} />
        </div>
      </div>

      <div className="pt-10">
        <FeaturedGrid propiedades={destacadas} />
      </div>

      <AboutSection texto={config.textoQuienesSomos} />

      <ContactMapSection direccion={config.direccion} />
    </>
  );
}
