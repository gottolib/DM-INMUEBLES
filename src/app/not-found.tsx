import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal text-cream px-6">
      <div className="text-center max-w-md">
        <Image src="/logo-dm-inmobiliaria.png" alt="DM Inmobiliaria" width={110} height={99} className="mx-auto mb-6" />
        <p className="font-display text-6xl text-gold mb-4">404</p>
        <h1 className="font-display text-2xl text-white mb-3">No encontramos esta página</h1>
        <p className="text-cream/70 mb-8">
          La propiedad o sección que buscás no existe o fue dada de baja. Volvé al inicio para seguir buscando.
        </p>
        <Link
          href="/"
          className="inline-block bg-gold hover:bg-gold-light text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-8 py-3 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
