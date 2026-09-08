"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { guardarConfiguracionAction } from "@/app/admin/configuracion/actions";
import type { FormActionState } from "@/app/admin/propiedades/actions";
import { CATALOGO_FUENTES, fontFamilyCss } from "@/lib/fonts-catalogo";

interface ConfiguracionFormProps {
  config: {
    telefono: string;
    whatsapp: string;
    email: string;
    direccion: string;
    facebookUrl: string;
    instagramUrl: string;
    horarios: string;
    textoQuienesSomos: string;
    tituloFuente: string;
    tituloColor: string;
    subtituloFuente: string;
    subtituloColor: string;
    caracteristicaFuente: string;
    caracteristicaColor: string;
    precioFuente: string;
    precioColor: string;
  };
}

const initialState: FormActionState = {};

const ROLES = [
  { key: "titulo", label: "Títulos", ejemplo: "Casa de 3 dormitorios con parque y pileta", tamano: "text-xl" },
  { key: "subtitulo", label: "Subtítulos", ejemplo: "PROPIEDADES DESTACADAS", tamano: "text-xs uppercase tracking-widest" },
  { key: "caracteristica", label: "Características", ejemplo: "3 dormitorios · 2 baños · 180 m² cubiertos", tamano: "text-sm" },
  { key: "precio", label: "Precios", ejemplo: "US$ 145.000", tamano: "text-lg font-semibold" },
] as const;

export function ConfiguracionForm({ config }: ConfiguracionFormProps) {
  const [state, formAction, pending] = useActionState(guardarConfiguracionAction, initialState);
  const err = (campo: string) => state.fieldErrors?.[campo];

  const [seleccion, setSeleccion] = useState(() =>
    Object.fromEntries(
      ROLES.map((r) => [
        r.key,
        {
          fuente: config[`${r.key}Fuente` as const],
          color: config[`${r.key}Color` as const],
        },
      ])
    ) as Record<(typeof ROLES)[number]["key"], { fuente: string; color: string }>
  );

  useEffect(() => {
    if (state.success) toast.success("Configuración guardada.");
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state.error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>}

      <fieldset className="bg-white border border-gold-light/40 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <legend className="font-display text-lg text-charcoal px-1">Datos de contacto</legend>

        <Campo label="Teléfono" error={err("telefono")}>
          <input name="telefono" defaultValue={config.telefono} className="input-brand w-full" placeholder="+54 3777 40-1234" />
        </Campo>
        <Campo label="WhatsApp (solo números, con código de país)" error={err("whatsapp")}>
          <input name="whatsapp" defaultValue={config.whatsapp} className="input-brand w-full" placeholder="5493777123456" />
        </Campo>
        <Campo label="Email" error={err("email")}>
          <input name="email" type="email" defaultValue={config.email} className="input-brand w-full" />
        </Campo>
        <Campo label="Dirección" error={err("direccion")} className="sm:col-span-2">
          <input name="direccion" defaultValue={config.direccion} className="input-brand w-full" />
        </Campo>
        <Campo label="Horarios de atención" error={err("horarios")} className="sm:col-span-2">
          <textarea name="horarios" defaultValue={config.horarios} className="input-brand w-full min-h-20" />
        </Campo>
      </fieldset>

      <fieldset className="bg-white border border-gold-light/40 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <legend className="font-display text-lg text-charcoal px-1">Redes sociales</legend>
        <Campo label="Facebook (URL)" error={err("facebookUrl")}>
          <input name="facebookUrl" defaultValue={config.facebookUrl} className="input-brand w-full" placeholder="https://facebook.com/..." />
        </Campo>
        <Campo label="Instagram (URL)" error={err("instagramUrl")}>
          <input name="instagramUrl" defaultValue={config.instagramUrl} className="input-brand w-full" placeholder="https://instagram.com/..." />
        </Campo>
      </fieldset>

      <fieldset className="bg-white border border-gold-light/40 rounded-xl p-6">
        <legend className="font-display text-lg text-charcoal px-1">Quiénes somos</legend>
        <Campo label="Texto que se muestra en Inicio y en /quienes-somos" error={err("textoQuienesSomos")}>
          <textarea name="textoQuienesSomos" defaultValue={config.textoQuienesSomos} className="input-brand w-full min-h-40" />
        </Campo>
      </fieldset>

      <fieldset className="bg-white border border-gold-light/40 rounded-xl p-6">
        <legend className="font-display text-lg text-charcoal px-1">Tipografía y colores</legend>
        <p className="text-xs text-text/50 mb-5 mt-1">
          Elegí una fuente y un color para cada tipo de texto del sitio. Los cambios se aplican a todo el sitio público apenas guardás.
        </p>

        <div className="space-y-5">
          {ROLES.map((rol) => (
            <div key={rol.key} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.4fr] gap-4 items-end border-t border-gold-light/30 pt-5 first:border-t-0 first:pt-0">
              <Campo label={`Fuente — ${rol.label}`} error={err(`${rol.key}Fuente`)}>
                <select
                  name={`${rol.key}Fuente`}
                  className="select-brand w-full"
                  value={seleccion[rol.key].fuente}
                  onChange={(e) => setSeleccion((prev) => ({ ...prev, [rol.key]: { ...prev[rol.key], fuente: e.target.value } }))}
                >
                  {CATALOGO_FUENTES.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.etiqueta}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Color" error={err(`${rol.key}Color`)}>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={seleccion[rol.key].color}
                    onChange={(e) => setSeleccion((prev) => ({ ...prev, [rol.key]: { ...prev[rol.key], color: e.target.value } }))}
                    className="w-10 h-10 rounded border border-gold-light/50 cursor-pointer shrink-0"
                    aria-label={`Color de ${rol.label}`}
                  />
                  <input
                    name={`${rol.key}Color`}
                    value={seleccion[rol.key].color}
                    onChange={(e) => setSeleccion((prev) => ({ ...prev, [rol.key]: { ...prev[rol.key], color: e.target.value } }))}
                    className="input-brand w-24"
                    placeholder="#000000"
                  />
                </div>
              </Campo>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">Vista previa</span>
                <div className="bg-cream rounded-lg px-4 py-3 overflow-hidden">
                  <span
                    className={rol.tamano}
                    style={{ fontFamily: fontFamilyCss(seleccion[rol.key].fuente), color: seleccion[rol.key].color }}
                  >
                    {rol.ejemplo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold hover:bg-gold-dark disabled:opacity-60 text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full px-8 py-3 transition-colors"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

function Campo({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
