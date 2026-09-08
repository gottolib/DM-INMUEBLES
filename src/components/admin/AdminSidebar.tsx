"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminSidebar({ nombre, mensajesSinLeer }: { nombre: string; mensajesSinLeer: number }) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-64 shrink-0 bg-charcoal text-cream lg:min-h-screen">
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <Image src="/logo-dm-inmobiliaria.png" alt="DM Inmobiliaria" width={42} height={38} />
        <div>
          <p className="font-display text-sm text-white leading-tight">DM Inmobiliaria</p>
          <p className="text-xs text-cream/50">Panel admin</p>
        </div>
      </div>

      <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
        {LINKS.map((link) => {
          const activo = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-between gap-2",
                activo ? "bg-gold text-charcoal" : "text-cream/75 hover:bg-charcoal-soft"
              )}
            >
              {link.label}
              {link.href === "/admin/mensajes" && mensajesSinLeer > 0 && (
                <span className={cn("text-[11px] rounded-full px-1.5 py-0.5 font-semibold", activo ? "bg-charcoal text-gold" : "bg-gold text-charcoal")}>
                  {mensajesSinLeer}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10 lg:absolute lg:bottom-0 lg:w-64">
        <p className="text-xs text-cream/50 mb-2 truncate">{nombre}</p>
        <div className="flex gap-2">
          <Link href="/" className="flex-1 text-center text-xs border border-white/15 rounded-lg py-2 hover:border-gold-light">
            Ver sitio
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex-1 text-xs border border-white/15 rounded-lg py-2 hover:border-gold-light"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}
