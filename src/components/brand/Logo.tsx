import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Isotipo de DM Inmobiliaria. Lee /public/logo-dm-inmobiliaria.svg (o .png
 * si lo reemplazás por el archivo oficial). Cambiar el logo real es tan
 * simple como sobrescribir ese archivo en /public.
 */
export function Logo({ size = 48, withText = true, className, textClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0", className)}>
      <Image
        src="/logo-dm-inmobiliaria.svg"
        alt="DM Inmobiliaria"
        width={size}
        height={size}
        priority
        className="rounded-full"
      />
      {withText && (
        <span className={cn("font-display leading-tight", textClassName)}>
          <span className="block text-base sm:text-lg font-semibold tracking-wide">DM Inmobiliaria</span>
        </span>
      )}
    </Link>
  );
}
