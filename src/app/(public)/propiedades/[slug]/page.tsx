import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { ContactForm } from "@/components/properties/ContactForm";
import { RelatedProperties } from "@/components/properties/RelatedProperties";
import { EstadoBadge, OperacionBadge } from "@/components/ui/Badge";
import { getPropiedadPorSlug, getPropiedadesRelacionadas } from "@/lib/properties";
import { getSiteConfig } from "@/lib/site-config";
import { formatPrecio, formatSuperficie, whatsappPropiedadUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const propiedad = await getPropiedadPorSlug(slug);
  if (!propiedad) return { title: "Propiedad no encontrada" };

  return {
    title: propiedad.titulo,
    description: propiedad.descripcion.slice(0, 160),
    openGraph: {
      title: propiedad.titulo,
      description: propiedad.descripcion.slice(0, 160),
      images: propiedad.imagenes[0] ? [propiedad.imagenes[0].url] : undefined,
    },
  };
}

export default async function PropiedadDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const [propiedad, config] = await Promise.all([getPropiedadPorSlug(slug), getSiteConfig()]);

  if (!propiedad || propiedad.estadoPublicacion === "BORRADOR" || propiedad.estadoPublicacion === "INACTIVA") {
    notFound();
  }

  const relacionadas = await getPropiedadesRelacionadas(propiedad.id, propiedad.tipoPropiedadId, propiedad.tipoOperacion);
  const ubicacion = [propiedad.direccion, propiedad.zona, propiedad.localidad].filter(Boolean).join(", ");
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(ubicacion)}&output=embed`;

  const datos = [
    { label: "Superficie total", valor: formatSuperficie(propiedad.superficieTotal) },
    { label: "Superficie cubierta", valor: formatSuperficie(propiedad.superficieCubierta) },
    { label: "Ambientes", valor: propiedad.ambientes ?? null },
    { label: "Dormitorios", valor: propiedad.dormitorios ?? null },
    { label: "Baños", valor: propiedad.banos ?? null },
    { label: "Cochera", valor: propiedad.cochera ? "Sí" : "No" },
    { label: "Antigüedad", valor: propiedad.antiguedad != null ? `${propiedad.antiguedad} años` : null },
  ].filter((d) => d.valor != null && d.valor !== "");

  return (
    <div className="container-site py-10">
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-text/50">
        <span>Propiedades</span>
        <span>/</span>
        <span className="text-charcoal">{propiedad.codigo}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <PropertyGallery imagenes={propiedad.imagenes} titulo={propiedad.titulo} />

          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <OperacionBadge operacion={propiedad.tipoOperacion} />
              <EstadoBadge estado={propiedad.estadoDestacado} />
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-cream text-gold-dark border border-gold/30">
                {propiedad.codigo}
              </span>
            </div>
            <h1 className="texto-titulo text-3xl sm:text-4xl mb-2">{propiedad.titulo}</h1>
            <p className="text-text/60 mb-4">{ubicacion}</p>
            <p className="texto-precio text-2xl font-semibold mb-8">
              {formatPrecio(propiedad.precio, propiedad.moneda, propiedad.consultarPrecio)}
            </p>

            {datos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 bg-cream rounded-xl p-5">
                {datos.map((d) => (
                  <div key={d.label}>
                    <p className="texto-caracteristica text-xs uppercase tracking-wide opacity-60">{d.label}</p>
                    <p className="texto-caracteristica font-medium">{d.valor}</p>
                  </div>
                ))}
              </div>
            )}

            <h2 className="texto-titulo text-xl mb-3">Descripción</h2>
            <p className="text-text/75 leading-relaxed whitespace-pre-line mb-10">{propiedad.descripcion}</p>

            <h2 className="texto-titulo text-xl mb-3">Ubicación</h2>
            <div className="rounded-xl overflow-hidden border border-gold-light/50 aspect-[16/9]">
              <iframe src={mapaSrc} title="Ubicación de la propiedad" className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          {config.whatsapp && (
            <a
              href={whatsappPropiedadUrl(config.whatsapp, propiedad.codigo, propiedad.titulo)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:opacity-90 text-white font-semibold uppercase tracking-wide text-sm rounded-full py-3.5 transition-opacity"
            >
              Consultar por WhatsApp
            </a>
          )}
          <ContactForm propiedadId={propiedad.id} titulo="Consultar por esta propiedad" />
        </aside>
      </div>

      <RelatedProperties propiedades={relacionadas} />
    </div>
  );
}
