import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

// Proporción real del archivo de logo (430 x 388 px).
const ASPECTO = 388 / 430;

/**
 * Logo de DM Inmobiliaria. Lee /public/logo-dm-inmobiliaria.png — el
 * archivo ya incluye el nombre "D.M Negocios Inmobiliarios" en la imagen,
 * por eso `withText` está en `false` por defecto (mostrarlo junto a un
 * texto aparte sería redundante). Reemplazar el logo real es tan simple
 * como sobrescribir ese archivo en /public, manteniendo el mismo nombre.
 */
export function Logo({ width = 52, withText = false, className, textClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0", className)}>
      <Image
        src="/logo-dm-inmobiliaria.png"
        alt="DM Inmobiliaria"
        width={width}
        height={Math.round(width * ASPECTO)}
        priority
      />
      {withText && (
        <span className={cn("font-display leading-tight", textClassName)}>
          <span className="block text-base sm:text-lg font-semibold tracking-wide">DM Inmobiliaria</span>
        </span>
      )}
    </Link>
  );
}
