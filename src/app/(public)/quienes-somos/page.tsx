import type { Metadata } from "next";
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
          <div key={v.titulo} className="flip-card" tabIndex={0}>
            <div className="flip-card-inner shadow-sm">
              <div
                className="flip-card-front"
                style={{ background: "linear-gradient(135deg, #e8d9a6, #c9a24b 45%, #9c7a2e)" }}
              >
                <h3 className="texto-titulo text-xl text-charcoal font-semibold">{v.titulo}</h3>
                <p className="text-xs text-charcoal/60 mt-3 uppercase tracking-wide">Pasá el mouse</p>
              </div>
              <div
                className="flip-card-back"
                style={{ background: "linear-gradient(135deg, #9c7a2e, #c9a24b 55%, #e8d9a6)" }}
              >
                <p className="text-sm text-charcoal font-medium leading-relaxed">{v.texto}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
