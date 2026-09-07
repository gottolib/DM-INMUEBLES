import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MessageRow } from "@/components/admin/MessageRow";

export const metadata: Metadata = { title: "Mensajes | Admin" };

export default async function AdminMensajesPage() {
  const mensajes = await prisma.mensaje.findMany({
    include: { propiedad: { select: { titulo: true, codigo: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-1">Mensajes</h1>
      <p className="text-sm text-text/60 mb-8">Consultas recibidas desde los formularios de contacto del sitio.</p>

      <div className="space-y-4 max-w-3xl">
        {mensajes.map((m) => (
          <MessageRow
            key={m.id}
            id={m.id}
            nombre={m.nombre}
            telefono={m.telefono}
            email={m.email}
            mensaje={m.mensaje}
            propiedadTitulo={m.propiedad ? `${m.propiedad.codigo} - ${m.propiedad.titulo}` : null}
            fecha={m.createdAt.toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}
            leidoInicial={m.leido}
          />
        ))}
        {mensajes.length === 0 && <p className="text-text/50 text-sm">Todavía no recibiste ningún mensaje.</p>}
      </div>
    </div>
  );
}
