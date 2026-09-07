import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getSiteConfig } from "@/lib/site-config";
import { getTiposConPropiedadesActivas } from "@/lib/properties";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [config, tiposVenta, tiposAlquiler] = await Promise.all([
    getSiteConfig(),
    getTiposConPropiedadesActivas("VENTA"),
    getTiposConPropiedadesActivas("ALQUILER"),
  ]);

  return (
    <>
      <Header
        telefono={config.telefono}
        whatsapp={config.whatsapp}
        direccion={config.direccion}
        tiposVenta={tiposVenta}
        tiposAlquiler={tiposAlquiler}
      />
      <main className="flex-1">{children}</main>
      <Footer
        telefono={config.telefono}
        whatsapp={config.whatsapp}
        email={config.email}
        direccion={config.direccion}
        facebookUrl={config.facebookUrl}
        instagramUrl={config.instagramUrl}
        horarios={config.horarios}
      />
      <WhatsAppButton whatsapp={config.whatsapp} />
    </>
  );
}
