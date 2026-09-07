"use client";

import { useActionState } from "react";
import type { FormActionState } from "@/app/admin/propiedades/actions";
import { ImageManager } from "@/components/admin/ImageManager";
import type { PropiedadCompleta } from "@/types/propiedad";

interface TipoOption {
  id: string;
  nombre: string;
}

interface PropertyFormProps {
  tipos: TipoOption[];
  propiedad?: PropiedadCompleta;
  action: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
}

const initialState: FormActionState = {};

export function PropertyForm({ tipos, propiedad, action }: PropertyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const err = (campo: string) => state.fieldErrors?.[campo];

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {state.error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>}

      <Section titulo="Datos generales">
        <Campo label="Título" error={err("titulo")} className="sm:col-span-2">
          <input name="titulo" defaultValue={propiedad?.titulo} className="input-brand w-full" placeholder="Ej: Casa de 3 dormitorios con parque" />
        </Campo>

        <Campo label="Tipo de operación" error={err("tipoOperacion")}>
          <select name="tipoOperacion" defaultValue={propiedad?.tipoOperacion ?? "VENTA"} className="select-brand w-full">
            <option value="VENTA">Venta</option>
            <option value="ALQUILER">Alquiler</option>
            <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
          </select>
        </Campo>

        <Campo label="Tipo de propiedad" error={err("tipoPropiedadId")}>
          <select name="tipoPropiedadId" defaultValue={propiedad?.tipoPropiedadId ?? ""} className="select-brand w-full">
            <option value="" disabled>
              Seleccionar...
            </option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Estado destacado" error={err("estadoDestacado")}>
          <select name="estadoDestacado" defaultValue={propiedad?.estadoDestacado ?? "NINGUNO"} className="select-brand w-full">
            <option value="NINGUNO">Ninguno</option>
            <option value="DESTACADA">Destacada</option>
            <option value="EXCELENTE">Excelente</option>
            <option value="BUENA">Buena</option>
          </select>
        </Campo>

        <Campo label="Mostrar en portada (home)">
          <label className="flex items-center gap-2 text-sm text-charcoal mt-2">
            <input type="checkbox" name="destacadaHome" defaultChecked={propiedad?.destacadaHome} className="w-4 h-4 accent-[#c9a24b]" />
            Incluir en el slider y destacados de inicio
          </label>
        </Campo>
      </Section>

      <Section titulo="Ubicación">
        <Campo label="Dirección">
          <input name="direccion" defaultValue={propiedad?.direccion ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Barrio / Zona">
          <input name="zona" defaultValue={propiedad?.zona ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Localidad" error={err("localidad")}>
          <input name="localidad" defaultValue={propiedad?.localidad ?? "Goya, Corrientes"} className="input-brand w-full" />
        </Campo>
      </Section>

      <Section titulo="Características">
        <Campo label="Superficie total (m²)">
          <input type="number" step="0.01" name="superficieTotal" defaultValue={propiedad?.superficieTotal ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Superficie cubierta (m²)">
          <input type="number" step="0.01" name="superficieCubierta" defaultValue={propiedad?.superficieCubierta ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Ambientes">
          <input type="number" name="ambientes" defaultValue={propiedad?.ambientes ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Dormitorios">
          <input type="number" name="dormitorios" defaultValue={propiedad?.dormitorios ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Baños">
          <input type="number" name="banos" defaultValue={propiedad?.banos ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Antigüedad (años)">
          <input type="number" name="antiguedad" defaultValue={propiedad?.antiguedad ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Cochera">
          <label className="flex items-center gap-2 text-sm text-charcoal mt-2">
            <input type="checkbox" name="cochera" defaultChecked={propiedad?.cochera} className="w-4 h-4 accent-[#c9a24b]" />
            Tiene cochera
          </label>
        </Campo>
      </Section>

      <Section titulo="Precio">
        <Campo label="Precio" error={err("precio")}>
          <input type="number" step="0.01" name="precio" defaultValue={propiedad?.precio ?? ""} className="input-brand w-full" />
        </Campo>
        <Campo label="Moneda">
          <select name="moneda" defaultValue={propiedad?.moneda ?? "USD"} className="select-brand w-full">
            <option value="USD">USD (Dólares)</option>
            <option value="ARS">ARS (Pesos)</option>
          </select>
        </Campo>
        <Campo label="">
          <label className="flex items-center gap-2 text-sm text-charcoal mt-2">
            <input type="checkbox" name="consultarPrecio" defaultChecked={propiedad?.consultarPrecio} className="w-4 h-4 accent-[#c9a24b]" />
            Mostrar &quot;Consultar precio&quot; en vez del precio
          </label>
        </Campo>
      </Section>

      <Section titulo="Descripción">
        <Campo label="Descripción completa" error={err("descripcion")} className="sm:col-span-2">
          <textarea name="descripcion" defaultValue={propiedad?.descripcion ?? ""} className="input-brand w-full min-h-40 resize-y" />
        </Campo>
      </Section>

      {propiedad && (
        <Section titulo="Estado de la publicación">
          <Campo label="Estado">
            <select name="estadoPublicacion" defaultValue={propiedad.estadoPublicacion} className="select-brand w-full">
              <option value="BORRADOR">Borrador</option>
              <option value="ACTIVA">Activa</option>
              <option value="INACTIVA">Inactiva</option>
              <option value="VENDIDA">Vendida</option>
              <option value="ALQUILADA">Alquilada</option>
            </select>
          </Campo>
        </Section>
      )}

      {propiedad && (
        <Section titulo="Imágenes">
          <div className="sm:col-span-2">
            <ImageManager propiedadId={propiedad.id} imagenesIniciales={propiedad.imagenes} />
          </div>
        </Section>
      )}

      <div className="flex flex-wrap gap-3 sticky bottom-0 bg-cream py-4 border-t border-gold-light/40">
        <button
          type="submit"
          name="intent"
          value="borrador"
          disabled={pending}
          className="border border-charcoal/30 text-charcoal hover:border-gold rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60"
        >
          Guardar como borrador
        </button>
        <button
          type="submit"
          name="intent"
          value="publicar"
          disabled={pending}
          className="bg-gold hover:bg-gold-dark text-charcoal rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Publicar"}
        </button>
        {propiedad && (
          <button
            type="submit"
            disabled={pending}
            className="ml-auto text-sm text-charcoal/60 hover:text-gold-dark underline underline-offset-4"
          >
            Guardar cambios (mantener estado actual)
          </button>
        )}
      </div>
    </form>
  );
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="bg-white border border-gold-light/40 rounded-xl p-6">
      <legend className="font-display text-lg text-charcoal px-1">{titulo}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">{children}</div>
    </fieldset>
  );
}

function Campo({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      {label && <span className="text-xs font-medium uppercase tracking-wide text-charcoal/70">{label}</span>}
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
