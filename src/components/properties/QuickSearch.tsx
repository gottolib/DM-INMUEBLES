import type { TipoNav } from "@/components/layout/Header";

export function QuickSearch({ tipos }: { tipos: TipoNav[] }) {
  return (
    <form
      action="/propiedades"
      method="GET"
      className="w-full bg-white/95 backdrop-blur rounded-xl shadow-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
    >
      <Field label="Operación">
        <select name="operacion" className="select-brand" defaultValue="">
          <option value="">Todas</option>
          <option value="VENTA">Venta</option>
          <option value="ALQUILER">Alquiler</option>
          <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
        </select>
      </Field>

      <Field label="Tipo">
        <select name="tipo" className="select-brand" defaultValue="">
          <option value="">Todos</option>
          {tipos.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.nombre}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ubicación / Zona">
        <input name="ubicacion" type="text" placeholder="Ej: Zona Centro" className="input-brand" />
      </Field>

      <Field label="Precio mínimo">
        <input name="precioMin" type="number" min={0} placeholder="0" className="input-brand" />
      </Field>

      <Field label="Precio máximo">
        <input name="precioMax" type="number" min={0} placeholder="Sin límite" className="input-brand" />
      </Field>

      <button
        type="submit"
        className="sm:col-span-2 lg:col-span-5 mt-1 bg-gold hover:bg-gold-dark text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full py-3 transition-colors"
      >
        Buscar propiedades
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">{label}</span>
      {children}
    </label>
  );
}
