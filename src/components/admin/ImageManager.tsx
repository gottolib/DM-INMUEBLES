"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImagenItem {
  id: string;
  url: string;
  esPortada: boolean;
}

export function ImageManager({ propiedadId, imagenesIniciales }: { propiedadId: string; imagenesIniciales: ImagenItem[] }) {
  const [imagenes, setImagenes] = useState<ImagenItem[]>(imagenesIniciales);
  const [subiendo, setSubiendo] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setSubiendo(true);
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      try {
        const res = await fetch(`/api/admin/properties/${propiedadId}/images`, { method: "POST", body: formData });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "No se pudieron subir las imágenes.");
        setImagenes((prev) => [...prev, ...body.imagenes]);
        toast.success(`${files.length > 1 ? "Imágenes subidas" : "Imagen subida"} correctamente.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al subir imágenes.");
      } finally {
        setSubiendo(false);
      }
    },
    [propiedadId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 8 * 1024 * 1024,
  });

  async function guardarOrden(nuevas: ImagenItem[], portadaId?: string) {
    setImagenes(nuevas);
    await fetch(`/api/admin/properties/${propiedadId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orden: nuevas.map((i) => i.id), portadaId: portadaId ?? nuevas.find((i) => i.esPortada)?.id }),
    }).catch(() => toast.error("No se pudo guardar el nuevo orden."));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = imagenes.findIndex((i) => i.id === active.id);
    const newIndex = imagenes.findIndex((i) => i.id === over.id);
    guardarOrden(arrayMove(imagenes, oldIndex, newIndex));
  }

  async function marcarPortada(id: string) {
    const nuevas = imagenes.map((i) => ({ ...i, esPortada: i.id === id }));
    setImagenes(nuevas);
    await guardarOrden(nuevas, id);
  }

  async function eliminar(id: string) {
    const previas = imagenes;
    setImagenes((prev) => prev.filter((i) => i.id !== id));
    const res = await fetch(`/api/admin/properties/${propiedadId}/images/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setImagenes(previas);
      toast.error("No se pudo eliminar la imagen.");
    }
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-gold bg-gold/10" : "border-gold-light/60 hover:border-gold"
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-charcoal">
          {subiendo ? "Subiendo imágenes..." : isDragActive ? "Soltá las imágenes acá..." : "Arrastrá imágenes acá, o hacé clic para elegirlas"}
        </p>
        <p className="text-xs text-text/50 mt-1">JPG, PNG o WEBP. Máximo 8MB por imagen.</p>
      </div>

      {imagenes.length > 0 && (
        <>
          <p className="text-xs text-text/50 mt-4 mb-2">Arrastrá para reordenar. La primera imagen (con borde dorado) es la portada.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={imagenes.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imagenes.map((img) => (
                  <SortableThumb key={img.id} imagen={img} onMarcarPortada={() => marcarPortada(img.id)} onEliminar={() => eliminar(img.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

function SortableThumb({ imagen, onMarcarPortada, onEliminar }: { imagen: ImagenItem; onMarcarPortada: () => void; onEliminar: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: imagen.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-square rounded-lg overflow-hidden border-2 group",
        imagen.esPortada ? "border-gold" : "border-transparent",
        isDragging && "opacity-50"
      )}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Image src={imagen.url} alt="" fill sizes="200px" className="object-cover" />
      </div>

      {imagen.esPortada && (
        <span className="absolute top-1.5 left-1.5 bg-gold text-charcoal text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full pointer-events-none">
          Portada
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-1.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
        {!imagen.esPortada && (
          <button
            type="button"
            onClick={onMarcarPortada}
            className="flex-1 text-[10px] bg-white/90 hover:bg-white text-charcoal rounded px-1.5 py-1"
          >
            Portada
          </button>
        )}
        <button
          type="button"
          onClick={onEliminar}
          className="text-[10px] bg-red-600/90 hover:bg-red-600 text-white rounded px-1.5 py-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
