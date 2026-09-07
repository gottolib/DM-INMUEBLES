"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  eliminarPropiedadAction,
  toggleDestacadaHomeAction,
  cambiarEstadoPublicacionAction,
} from "@/app/admin/propiedades/actions";

interface PropertyRowActionsProps {
  id: string;
  destacadaHome: boolean;
  estadoPublicacion: string;
}

const ESTADOS = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "ACTIVA", label: "Activa" },
  { value: "INACTIVA", label: "Inactiva" },
  { value: "VENDIDA", label: "Vendida" },
  { value: "ALQUILADA", label: "Alquilada" },
];

export function PropertyRowActions({ id, destacadaHome, estadoPublicacion }: PropertyRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [destacada, setDestacada] = useState(destacadaHome);
  const [estado, setEstado] = useState(estadoPublicacion);

  function onToggleDestacada() {
    const nuevo = !destacada;
    setDestacada(nuevo);
    startTransition(async () => {
      await toggleDestacadaHomeAction(id, nuevo);
      router.refresh();
    });
  }

  function onCambiarEstado(value: string) {
    setEstado(value);
    startTransition(async () => {
      await cambiarEstadoPublicacionAction(id, value);
      router.refresh();
    });
  }

  function onEliminar() {
    if (!confirm("¿Eliminar esta propiedad y todas sus imágenes? Esta acción no se puede deshacer.")) return;
    startTransition(async () => {
      await eliminarPropiedadAction(id);
      toast.success("Propiedad eliminada.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={estado}
        onChange={(e) => onCambiarEstado(e.target.value)}
        disabled={pending}
        className="select-brand text-xs py-1.5"
      >
        {ESTADOS.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onToggleDestacada}
        disabled={pending}
        className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
          destacada ? "bg-gold border-gold text-charcoal" : "border-charcoal/20 text-charcoal/60 hover:border-gold"
        }`}
      >
        {destacada ? "En portada" : "Destacar"}
      </button>

      <button
        type="button"
        onClick={onEliminar}
        disabled={pending}
        className="text-xs px-2.5 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
      >
        Eliminar
      </button>
    </div>
  );
}
