import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ pagina, totalPaginas, basePath, searchParams }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  function hrefPara(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "pagina") params.set(key, value);
    });
    if (p > 1) params.set("pagina", String(p));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Paginación">
      <Link
        href={hrefPara(Math.max(1, pagina - 1))}
        aria-disabled={pagina === 1}
        className={cn(
          "px-3 py-2 rounded-full text-sm border border-gold-light/50 text-charcoal hover:border-gold transition-colors",
          pagina === 1 && "pointer-events-none opacity-40"
        )}
      >
        Anterior
      </Link>
      {paginas.map((p) => (
        <Link
          key={p}
          href={hrefPara(p)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full text-sm border transition-colors",
            p === pagina ? "bg-gold text-charcoal border-gold font-semibold" : "border-gold-light/50 text-charcoal hover:border-gold"
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefPara(Math.min(totalPaginas, pagina + 1))}
        className={cn(
          "px-3 py-2 rounded-full text-sm border border-gold-light/50 text-charcoal hover:border-gold transition-colors",
          pagina === totalPaginas && "pointer-events-none opacity-40"
        )}
      >
        Siguiente
      </Link>
    </nav>
  );
}
