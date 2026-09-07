import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  facebookUrl?: string;
  instagramUrl?: string;
  horarios?: string;
}

export function Footer({ telefono, whatsapp, email, direccion, facebookUrl, instagramUrl, horarios }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream/85 mt-20">
      <div className="container-site py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo-dm-inmobiliaria.svg" alt="DM Inmobiliaria" width={48} height={48} className="rounded-full" />
            <span className="font-display text-lg text-white">DM Inmobiliaria</span>
          </div>
          <p className="text-sm leading-relaxed text-cream/70">
            Compraventa y alquiler de propiedades en Goya y la región, con atención cercana y personalizada.
          </p>
          <div className="flex gap-4 mt-5">
            {facebookUrl && (
              <SocialIcon href={facebookUrl} label="Facebook">
                <path d="M13.5 9H15V6.5h-2c-1.7 0-3 1.3-3 3V11H8v2.5h2V19h2.5v-5.5H15L15.5 11H12.5V9.5c0-.3.2-.5.5-.5Z" />
              </SocialIcon>
            )}
            {instagramUrl && (
              <SocialIcon href={instagramUrl} label="Instagram">
                <rect x="5" y="5" width="14" height="14" rx="4" />
                <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="16" cy="8" r="0.9" />
              </SocialIcon>
            )}
            {whatsapp && (
              <SocialIcon href={`https://wa.me/${whatsapp}`} label="WhatsApp">
                <path d="M12 4a8 8 0 0 0-6.9 12l-1 3.6 3.7-1A8 8 0 1 0 12 4Zm4.4 11.3c-.2.5-1 1-1.5 1-.4 0-.9.1-2.9-.8-2.5-1.1-4-3.7-4.1-3.9-.1-.2-1-1.3-1-2.5 0-1.2.6-1.7.8-2 .2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.2.5.1.6-.1l.6-.7c.2-.3.4-.2.6-.1l1.7.8c.2.1.3.2.4.3.1.2.1.9-.1 1.3Z" />
              </SocialIcon>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white font-display text-base mb-4">Enlaces rápidos</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/propiedades/venta" className="hover:text-gold-light">Propiedades en Venta</Link></li>
            <li><Link href="/propiedades/alquiler" className="hover:text-gold-light">Propiedades en Alquiler</Link></li>
            <li><Link href="/propiedades/alquiler-temporario" className="hover:text-gold-light">Alquiler Temporario</Link></li>
            <li><Link href="/quienes-somos" className="hover:text-gold-light">Quiénes Somos</Link></li>
            <li><Link href="/contacto" className="hover:text-gold-light">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-display text-base mb-4">Contacto</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            {direccion && <li>{direccion}</li>}
            {telefono && <li>{telefono}</li>}
            {email && <li>{email}</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-display text-base mb-4">Horario de atención</h3>
          <p className="text-sm text-cream/70 whitespace-pre-line">{horarios || "Consultanos por WhatsApp."}</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/50">
        © {year} DM Inmobiliaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-gold-light/40 flex items-center justify-center text-gold-light hover:bg-gold hover:text-charcoal hover:border-gold transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
