import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site-config";
import { ConfiguracionForm } from "@/components/admin/ConfiguracionForm";

export const metadata: Metadata = { title: "Configuración | Admin" };

export default async function AdminConfiguracionPage() {
  const config = await getSiteConfig();

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-1">Configuración del sitio</h1>
      <p className="text-sm text-text/60 mb-8">
        Estos datos se muestran en todo el sitio (header, footer, WhatsApp, mapa) sin necesidad de tocar código.
      </p>
      <ConfiguracionForm config={config} />
    </div>
  );
}
