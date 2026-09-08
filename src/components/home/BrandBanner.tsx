"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Textos del banner de Inicio. Como no hay una pantalla en /admin para
// editarlos (son la bajada de marca, no contenido operativo del día a día),
// se pueden ajustar acá directamente si hace falta cambiarlos más adelante.
const TITULO = "D.M INMUEBLES";
const SUBTITULO = "Tu propiedad en las mejores manos. Vos disfrutás los resultados.";

function useMaquinaDeEscribir(texto: string, velocidadMs = 45) {
  const [mostrado, setMostrado] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setMostrado(texto.slice(0, i));
      if (i >= texto.length) clearInterval(id);
    }, velocidadMs);
    return () => clearInterval(id);
  }, [texto, velocidadMs]);

  return mostrado;
}

export function BrandBanner() {
  const textoEscrito = useMaquinaDeEscribir(SUBTITULO);

  return (
    <section className="bg-black">
      <div className="container-site py-16 sm:py-24 flex flex-col sm:flex-row items-center gap-10 sm:gap-14">
        <div className="shrink-0 relative w-40 sm:w-56 aspect-[430/388]">
          <Image src="/logo-dm-inmobiliaria.png" alt="DM Inmobiliaria" fill sizes="(max-width: 640px) 160px, 224px" className="object-contain" priority />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="fuente-titulo text-4xl sm:text-6xl font-bold tracking-wide text-white mb-4">{TITULO}</h1>
          <p className="fuente-subtitulo text-lg sm:text-xl text-gold-light min-h-[1.75em]">
            {textoEscrito}
            <span className="inline-block w-[2px] h-[1em] align-middle bg-gold-light ml-1 cursor-parpadeo" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}
