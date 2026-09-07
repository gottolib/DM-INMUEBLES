import type { Metadata } from "next";
import { ContactForm } from "@/components/properties/ContactForm";
import { getSiteConfig } from "@/lib/site-config";
import { whatsappGenericoUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Comunicate con DM Inmobiliaria por teléfono, WhatsApp, email o visitá nuestra oficina en Goya, Corrientes.",
};

export default async function ContactoPage() {
  const config = await getSiteConfig();
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(config.direccion)}&output=embed`;

  return (
    <div className="container-site py-14">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-dark font-semibold mb-2">Contacto</p>
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Hablemos</h1>
        <p className="text-text/60">Escribinos por WhatsApp o completá el formulario y te respondemos a la brevedad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Dirección" valor={config.direccion} />
            <InfoCard label="Teléfono" valor={config.telefono} />
            <InfoCard label="Email" valor={config.email} />
            <InfoCard label="Horarios" valor={config.horarios} />
          </div>

          {config.whatsapp && (
            <a
              href={whatsappGenericoUrl(config.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-10 bg-[#25D366] hover:opacity-90 text-white font-semibold uppercase tracking-wide text-sm rounded-full py-3.5 transition-opacity"
            >
              Escribinos por WhatsApp
            </a>
          )}

          <div className="rounded-xl overflow-hidden border border-gold-light/50 aspect-[16/10]">
            <iframe src={mapaSrc} title="Ubicación de DM Inmobiliaria" className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <ContactForm titulo="Envianos tu consulta" />
      </div>
    </div>
  );
}

function InfoCard({ label, valor }: { label: string; valor: string }) {
  if (!valor) return null;
  return (
    <div className="bg-cream border border-gold-light/50 rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-gold-dark font-medium mb-1">{label}</p>
      <p className="text-sm text-charcoal whitespace-pre-line">{valor}</p>
    </div>
  );
}
