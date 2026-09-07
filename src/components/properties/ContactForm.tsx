"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactoSchema, type ContactoInput } from "@/lib/validations";

interface ContactFormProps {
  propiedadId?: string;
  titulo?: string;
}

export function ContactForm({ propiedadId, titulo = "Enviar consulta" }: ContactFormProps) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoInput>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { propiedadId },
  });

  async function onSubmit(data: ContactoInput) {
    setEstado("enviando");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No pudimos enviar tu consulta.");
      }
      setEstado("ok");
      reset({ nombre: "", telefono: "", email: "", mensaje: "", propiedadId });
    } catch (err) {
      setEstado("error");
      setErrorMsg(err instanceof Error ? err.message : "No pudimos enviar tu consulta.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="bg-cream border border-gold-light rounded-xl p-6 text-center">
        <p className="font-display text-lg text-charcoal mb-1">¡Gracias por tu consulta!</p>
        <p className="text-sm text-text/70">Te vamos a contactar a la brevedad.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gold-light/50 rounded-xl p-6 space-y-4">
      <h3 className="font-display text-lg text-charcoal">{titulo}</h3>

      <input type="hidden" {...register("propiedadId")} />

      <div>
        <input className="input-brand w-full" placeholder="Nombre completo" {...register("nombre")} />
        {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input className="input-brand w-full" placeholder="Teléfono" {...register("telefono")} />
          {errors.telefono && <p className="text-xs text-red-600 mt-1">{errors.telefono.message}</p>}
        </div>
        <div>
          <input className="input-brand w-full" placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <textarea className="input-brand w-full min-h-28 resize-y" placeholder="Contanos tu consulta" {...register("mensaje")} />
        {errors.mensaje && <p className="text-xs text-red-600 mt-1">{errors.mensaje.message}</p>}
      </div>

      {estado === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-charcoal font-semibold uppercase tracking-wide text-sm rounded-full py-3 transition-colors"
      >
        {estado === "enviando" ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
