import Link from "next/link";
import Image from "next/image";

export function AboutSection({ texto }: { texto: string }) {
  return (
    <section className="bg-charcoal text-cream">
      <div className="container-site py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-light font-semibold mb-2">Sobre nosotros</p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">Confianza y cercanía en cada operación</h2>
          <p className="text-cream/75 leading-relaxed mb-8 line-clamp-3 sm:line-clamp-none">{texto}</p>
          <Link
            href="/quienes-somos"
            className="inline-block border border-gold text-gold-light hover:bg-gold hover:text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-7 py-3 transition-colors"
          >
            Conocer más
          </Link>
        </div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src="https://picsum.photos/id/1040/900/700"
            alt="Oficina de DM Inmobiliaria"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
