import Link from "next/link";
import { ContactForm } from "@/components/properties/ContactForm";

export function ContactMapSection({ direccion }: { direccion: string }) {
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;

  return (
    <section className="container-site py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <p className="texto-subtitulo text-xs uppercase tracking-[0.2em] font-semibold mb-2">Visitanos</p>
        <h2 className="texto-titulo text-3xl mb-5">Estamos para ayudarte</h2>
        <div className="rounded-xl overflow-hidden border border-gold-light/50 aspect-[4/3]">
          <iframe
            src={mapaSrc}
            title="Ubicación de DM Inmobiliaria"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <Link href="/contacto" className="inline-block mt-4 text-sm text-gold-dark hover:text-gold underline underline-offset-4">
          Ver todos nuestros datos de contacto
        </Link>
      </div>
      <ContactForm titulo="Envianos tu consulta" />
    </section>
  );
}
