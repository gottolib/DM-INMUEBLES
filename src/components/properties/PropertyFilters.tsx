"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { TipoNav } from "@/components/layout/Header";

interface PropertyFiltersProps {
  basePath: string; // /propiedades, /propiedades/venta, /propiedades/alquiler, /propiedades/alquiler-temporario
  tipos: TipoNav[];
  mostrarOperacion?: boolean;
}

export function PropertyFilters({ basePath, tipos, mostrarOperacion = true }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [operacion, setOperacion] = useState(searchParams.get("operacion") ?? "");
  const [tipo, setTipo] = useState(searchParams.get("tipo") ?? "");
  const [ubicacion, setUbicacion] = useState(searchParams.get("ubicacion") ?? "");
  const [ambientes, setAmbientes] = useState(searchParams.get("ambientes") ?? "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");
  const [superficieMin, setSuperficieMin] = useState(searchParams.get("superficieMin") ?? "");
  const [orden, setOrden] = useState(searchParams.get("orden") ?? "recientes");

  function aplicar(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (mostrarOperacion && operacion) params.set("operacion", operacion);
    if (tipo) params.set("tipo", tipo);
    if (ubicacion) params.set("ubicacion", ubicacion);
    if (ambientes) params.set("ambientes", ambientes);
    if (precioMin) params.set("precioMin", precioMin);
    if (precioMax) params.set("precioMax", precioMax);
    if (superficieMin) params.set("superficieMin", superficieMin);
    if (orden && orden !== "recientes") params.set("orden", orden);

    router.push(`${basePath}${params.toString() ? `?${params}` : ""}`);
  }

  function limpiar() {
    setOperacion("");
    setTipo("");
    setUbicacion("");
    setAmbientes("");
    setPrecioMin("");
    setPrecioMax("");
    setSuperficieMin("");
    setOrden("recientes");
    router.push(basePath);
  }

  return (
    <form onSubmit={aplicar} className="bg-cream border border-gold-light/50 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mostrarOperacion && (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Operación</span>
          <select className="select-brand" value={operacion} onChange={(e) => setOperacion(e.target.value)}>
            <option value="">Todas</option>
            <option value="VENTA">Venta</option>
            <option value="ALQUILER">Alquiler</option>
            <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Tipo</span>
        <select className="select-brand" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          {tipos.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Ubicación / Zona</span>
        <input className="input-brand" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ej: Zona Centro" />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Ambientes (mín.)</span>
        <input className="input-brand" type="number" min={0} value={ambientes} onChange={(e) => setAmbientes(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Precio mínimo</span>
        <input className="input-brand" type="number" min={0} value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Precio máximo</span>
        <input className="input-brand" type="number" min={0} value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Superficie mín. (m²)</span>
        <input className="input-brand" type="number" min={0} value={superficieMin} onChange={(e) => setSuperficieMin(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Ordenar por</span>
        <select className="select-brand" value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
        </select>
      </label>

      <div className="sm:col-span-2 lg:col-span-4 flex gap-3 mt-1">
        <button type="submit" className="flex-1 bg-gold hover:bg-gold-dark text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full py-2.5 transition-colors">
          Aplicar filtros
        </button>
        <button type="button" onClick={limpiar} className="px-5 border border-charcoal/20 text-charcoal/70 hover:border-gold hover:text-gold-dark rounded-full text-sm transition-colors">
          Limpiar
        </button>
      </div>
    </form>
  );
}
