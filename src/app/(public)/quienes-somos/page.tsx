import type { Metadata } from "next";
import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description: "Conocé la historia, misión y valores de DM Inmobiliaria en Goya, Corrientes.",
};

const VALORES = [
  { titulo: "Transparencia", texto: "Información clara y honesta en cada operación, sin letra chica." },
  { titulo: "Cercanía", texto: "Atención personalizada, acompañando a cada cliente en todo el proceso." },
  { titulo: "Conocimiento local", texto: "Años de trayectoria conociendo el mercado inmobiliario de la región." },
];

const EQUIPO = [
  { nombre: "María Domínguez", rol: "Directora Comercial" },
  { nombre: "Lucas Medina", rol: "Asesor de Ventas" },
  { nombre: "Sofía Ramírez", rol: "Atención al Cliente" },
];

export default async function QuienesSomosPage() {
  const config = await getSiteConfig();

  return (
    <div>
      <section className="bg-charcoal text-cream">
        <div className="container-site py-16 sm:py-20 text-center max-w-2xl mx-auto">
          <p className="fuente-subtitulo text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-3">Quiénes somos</p>
          <h1 className="fuente-titulo text-3xl sm:text-4xl text-white mb-5">Nuestra historia</h1>
          <p className="text-cream/75 leading-relaxed whitespace-pre-line">{config.textoQuienesSomos}</p>
        </div>
      </section>

      <section className="container-site py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {VALORES.map((v) => (
          <div key={v.titulo} className="text-center border border-gold-light/50 rounded-xl p-8 bg-cream">
            <h3 className="texto-titulo text-xl mb-2">{v.titulo}</h3>
            <p className="text-sm text-text/65 leading-relaxed">{v.texto}</p>
          </div>
        ))}
      </section>

      <section className="container-site pb-20">
        <h2 className="texto-titulo text-2xl text-center mb-10">Nuestro equipo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {EQUIPO.map((persona) => (
            <div key={persona.nombre} className="text-center">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-gold mb-3">
                <Image src={`https://picsum.photos/seed/${encodeURIComponent(persona.nombre)}/200/200`} alt={persona.nombre} fill className="object-cover" />
              </div>
              <p className="font-display text-charcoal">{persona.nombre}</p>
              <p className="text-xs text-gold-dark uppercase tracking-wide">{persona.rol}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
