"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { guardarConfiguracionAction } from "@/app/admin/configuracion/actions";
import type { FormActionState } from "@/app/admin/propiedades/actions";

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
  };
}

const initialState: FormActionState = {};

export function ConfiguracionForm({ config }: ConfiguracionFormProps) {
  const [state, formAction, pending] = useActionState(guardarConfiguracionAction, initialState);
  const err = (campo: string) => state.fieldErrors?.[campo];

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
