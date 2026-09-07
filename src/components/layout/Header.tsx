"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export interface TipoNav {
  nombre: string;
  slug: string;
}

interface HeaderProps {
  telefono: string;
  whatsapp: string;
  direccion: string;
  tiposVenta: TipoNav[];
  tiposAlquiler: TipoNav[];
}

const NAV_LINK = "text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold";

export function Header({ telefono, whatsapp, direccion, tiposVenta, tiposAlquiler }: HeaderProps) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdown, setDropdown] = useState<"venta" | "alquiler" | null>(null);

  // Cierra el menú mobile y los dropdowns al cambiar de página. Se ajusta el
  // estado durante el render (en vez de en un useEffect) siguiendo el patrón
  // recomendado por React para "resetear estado cuando cambia una prop".
  const [pathnamePrevio, setPathnamePrevio] = useState(pathname);
  if (pathname !== pathnamePrevio) {
    setPathnamePrevio(pathname);
    setMenuAbierto(false);
    setDropdown(null);
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Barra superior de contacto */}
      <div className="hidden md:block bg-charcoal text-cream/90 text-xs">
        <div className="container-site flex items-center justify-between py-2">
          <span className="truncate">{direccion}</span>
          <div className="flex items-center gap-5">
            {telefono && <span>{telefono}</span>}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-light hover:text-gold transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="bg-white/95 backdrop-blur border-b border-gold-light/40">
        <div className="container-site flex items-center justify-between py-3">
          <Logo size={52} textClassName="text-charcoal" />

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-charcoal">
            <Link href="/" className={NAV_LINK}>
              Inicio
            </Link>
            <Link href="/propiedades/alquiler-temporario" className={NAV_LINK}>
              Alquiler Temporario
            </Link>

            <NavDropdown
              label="Venta"
              basePath="/propiedades/venta"
              tipos={tiposVenta}
              open={dropdown === "venta"}
              onOpen={() => setDropdown("venta")}
              onClose={() => setDropdown(null)}
            />
            <NavDropdown
              label="Alquiler"
              basePath="/propiedades/alquiler"
              tipos={tiposAlquiler}
              open={dropdown === "alquiler"}
              onOpen={() => setDropdown("alquiler")}
              onClose={() => setDropdown(null)}
            />

            <Link href="/quienes-somos" className={NAV_LINK}>
              Quiénes Somos
            </Link>
            <Link href="/contacto" className={NAV_LINK}>
              Contacto
            </Link>
          </nav>

          {/* Botón mobile */}
          <button
            type="button"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="lg:hidden p-2 text-charcoal"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span className="sr-only">Menú</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={cn("h-0.5 bg-current rounded transition-transform", menuAbierto && "translate-y-2 rotate-45")} />
              <span className={cn("h-0.5 bg-current rounded transition-opacity", menuAbierto && "opacity-0")} />
              <span className={cn("h-0.5 bg-current rounded transition-transform", menuAbierto && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>
      </div>

      {/* Nav mobile */}
      {menuAbierto && (
        <nav className="lg:hidden bg-white border-b border-gold-light/40 px-5 py-4 flex flex-col gap-1 text-charcoal max-h-[80vh] overflow-y-auto">
          <MobileLink href="/">Inicio</MobileLink>
          <MobileLink href="/propiedades/alquiler-temporario">Alquiler Temporario</MobileLink>

          <MobileGroup label="Venta" basePath="/propiedades/venta" tipos={tiposVenta} />
          <MobileGroup label="Alquiler" basePath="/propiedades/alquiler" tipos={tiposAlquiler} />

          <MobileLink href="/quienes-somos">Quiénes Somos</MobileLink>
          <MobileLink href="/contacto">Contacto</MobileLink>
        </nav>
      )}
    </header>
  );
}

function NavDropdown({
  label,
  basePath,
  tipos,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  basePath: string;
  tipos: TipoNav[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link href={basePath} className={cn(NAV_LINK, "flex items-center gap-1")}>
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Link>
      {open && (
        <div className="absolute left-0 top-full pt-3 w-56">
          <div className="bg-charcoal text-cream rounded-md shadow-xl overflow-hidden py-2">
            <Link href={basePath} className="block px-4 py-2 text-sm hover:bg-charcoal-soft hover:text-gold-light transition-colors font-medium">
              Ver todas
            </Link>
            {tipos.length > 0 && <div className="border-t border-white/10 my-1" />}
            {tipos.map((tipo) => (
              <Link
                key={tipo.slug}
                href={`${basePath}?tipo=${tipo.slug}`}
                className="block px-4 py-2 text-sm hover:bg-charcoal-soft hover:text-gold-light transition-colors"
              >
                {tipo.nombre}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="py-2.5 text-sm font-medium uppercase tracking-wide border-b border-gold-light/30">
      {children}
    </Link>
  );
}

function MobileGroup({ label, basePath, tipos }: { label: string; basePath: string; tipos: TipoNav[] }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="border-b border-gold-light/30">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between py-2.5 text-sm font-medium uppercase tracking-wide"
      >
        {label}
        <span className={cn("transition-transform", abierto && "rotate-180")}>▾</span>
      </button>
      {abierto && (
        <div className="pb-2 pl-3 flex flex-col gap-1">
          <Link href={basePath} className="py-1.5 text-sm text-gold-dark">
            Ver todas
          </Link>
          {tipos.map((tipo) => (
            <Link key={tipo.slug} href={`${basePath}?tipo=${tipo.slug}`} className="py-1.5 text-sm">
              {tipo.nombre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
