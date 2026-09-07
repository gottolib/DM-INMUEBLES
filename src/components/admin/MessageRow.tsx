"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface MessageRowProps {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mensaje: string;
  propiedadTitulo: string | null;
  fecha: string;
  leidoInicial: boolean;
}

export function MessageRow({ id, nombre, telefono, email, mensaje, propiedadTitulo, fecha, leidoInicial }: MessageRowProps) {
  const router = useRouter();
  const [leido, setLeido] = useState(leidoInicial);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const nuevo = !leido;
    setLeido(nuevo);
    startTransition(async () => {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leido: nuevo }),
      });
      router.refresh();
    });
  }

  return (
    <div className={cn("border rounded-xl p-5 bg-white", leido ? "border-gold-light/30" : "border-gold shadow-sm")}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-medium text-charcoal">
            {nombre} {!leido && <span className="ml-2 text-[10px] bg-gold text-charcoal px-2 py-0.5 rounded-full uppercase font-semibold">Nuevo</span>}
          </p>
          <p className="text-xs text-text/50">
            {[telefono, email].filter(Boolean).join(" · ") || "Sin datos de contacto adicionales"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          className="text-xs border border-charcoal/20 hover:border-gold rounded-full px-3 py-1.5 text-charcoal/70 transition-colors shrink-0"
        >
          {leido ? "Marcar como no leído" : "Marcar como leído"}
        </button>
      </div>
      {propiedadTitulo && <p className="text-xs text-gold-dark mb-2">Consulta por: {propiedadTitulo}</p>}
      <p className="text-sm text-text/80 mb-2 whitespace-pre-line">{mensaje}</p>
      <p className="text-xs text-text/40">{fecha}</p>
    </div>
  );
}
