import { cn } from "@/lib/utils";

const ESTILOS: Record<string, string> = {
  DESTACADA: "bg-gold text-charcoal",
  EXCELENTE: "bg-charcoal text-gold-light",
  BUENA: "bg-cream text-gold-dark border border-gold/40",
};

export function EstadoBadge({ estado }: { estado: string }) {
  if (!estado || estado === "NINGUNO") return null;
  const label = estado.charAt(0) + estado.slice(1).toLowerCase();

  return (
    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm", ESTILOS[estado])}>
      {label}
    </span>
  );
}

export function OperacionBadge({ operacion }: { operacion: string }) {
  const label = operacion === "ALQUILER_TEMPORARIO" ? "Alquiler Temporario" : operacion.charAt(0) + operacion.slice(1).toLowerCase();
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-charcoal/90 text-white">
      {label}
    </span>
  );
}
