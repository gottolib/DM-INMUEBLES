"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EstadoBadge, OperacionBadge } from "@/components/ui/Badge";
import { formatPrecio, formatSuperficie } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PropiedadConPortada } from "@/types/propiedad";

const AUTOPLAY_MS = 6000;

export function Hero({ propiedades }: { propiedades: PropiedadConPortada[] }) {
  const [indice, setIndice] = useState(0);
  const total = propiedades.length;
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const siguiente = useCallback(() => setIndice((i) => (i + 1) % total), [total]);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(siguiente, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [siguiente, total]);

  if (total === 0) return null;

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta > 0 ? anterior : siguiente)();
    touchStartX.current = null;
  }

  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[720px] w-full overflow-hidden bg-charcoal" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {propiedades.map((propiedad, i) => {
        const portada = propiedad.imagenes[0];
        return (
          <div key={propiedad.id} className={cn("absolute inset-0 transition-opacity duration-700", i === indice ? "opacity-100" : "opacity-0 pointer-events-none")}>
            {portada && (
              <Image
                src={portada.url}
                alt={propiedad.titulo}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/10" />

            <div className="relative h-full container-site flex flex-col justify-end pb-16 sm:pb-20 text-white">
              <div className="flex gap-2 mb-4">
                <OperacionBadge operacion={propiedad.tipoOperacion} />
                <EstadoBadge estado={propiedad.estadoDestacado} />
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold max-w-2xl leading-tight mb-3">{propiedad.titulo}</h2>
              <p className="text-white/80 mb-5">
                {propiedad.zona ? `${propiedad.zona}, ` : ""}
                {propiedad.localidad}
                {formatSuperficie(propiedad.superficieTotal) ? ` · ${formatSuperficie(propiedad.superficieTotal)}` : ""}
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <span className="font-display text-2xl text-gold-light font-semibold">
                  {formatPrecio(propiedad.precio, propiedad.moneda, propiedad.consultarPrecio)}
                </span>
                <Link
                  href={`/propiedades/${propiedad.slug}`}
                  className="bg-gold hover:bg-gold-light text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-6 py-3 transition-colors"
                >
                  Ver propiedad
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={anterior}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={siguiente}
            aria-label="Siguiente"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center backdrop-blur transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {propiedades.map((p, i) => (
              <button
                key={p.id}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => setIndice(i)}
                className={cn("h-1.5 rounded-full transition-all", i === indice ? "w-8 bg-gold" : "w-1.5 bg-white/50")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
