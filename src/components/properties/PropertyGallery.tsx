"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  imagenes: { id: string; url: string }[];
  titulo: string;
}

export function PropertyGallery({ imagenes, titulo }: PropertyGalleryProps) {
  const [indice, setIndice] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setIndice((i) => (i + 1) % imagenes.length);
      if (e.key === "ArrowLeft") setIndice((i) => (i - 1 + imagenes.length) % imagenes.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, imagenes.length]);

  if (imagenes.length === 0) {
    return (
      <div className="aspect-[16/10] bg-cream rounded-xl flex items-center justify-center text-gold-dark/50">
        Sin imágenes cargadas
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative w-full aspect-[16/10] rounded-xl overflow-hidden block bg-charcoal cursor-zoom-in"
      >
        <Image src={imagenes[indice].url} alt={`${titulo} - foto ${indice + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
      </button>

      {imagenes.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndice(i)}
              className={cn(
                "relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                i === indice ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute top-5 right-5 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center hover:text-gold-light"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>

          {imagenes.length > 1 && (
            <button
              type="button"
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation();
                setIndice((i) => (i - 1 + imagenes.length) % imagenes.length);
              }}
              className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center hover:text-gold-light"
            >
              ‹
            </button>
          )}

          <div className="relative w-full max-w-5xl aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image src={imagenes[indice].url} alt={`${titulo} - foto ${indice + 1}`} fill sizes="90vw" className="object-contain" />
          </div>

          {imagenes.length > 1 && (
            <button
              type="button"
              aria-label="Siguiente"
              onClick={(e) => {
                e.stopPropagation();
                setIndice((i) => (i + 1) % imagenes.length);
              }}
              className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center hover:text-gold-light"
            >
              ›
            </button>
          )}

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {indice + 1} / {imagenes.length}
          </span>
        </div>
      )}
    </div>
  );
}
