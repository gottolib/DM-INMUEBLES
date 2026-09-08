import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
// El SDK de Cloudinary se auto-configura a partir de CLOUDINARY_URL apenas
// se importa el módulo, y si esa variable está mal formada tira una
// excepción en ese mismo momento. Next.js evalúa los route handlers durante
// el build (para recolectar metadata), así que un import estático acá
// hacía que un CLOUDINARY_URL mal cargado rompiera el build ENTERO, incluso
// en rutas que no tienen nada que ver con imágenes. Por eso se importa de
// forma diferida (dynamic import), solo en el momento en que efectivamente
// se necesita subir/borrar una imagen — así un typo en esa variable rompe,
// como mucho, esa operación puntual en tiempo de ejecución, nunca el build.
async function getCloudinary() {
  const { v2 } = await import("cloudinary");
  return v2;
}

// Abstracción de almacenamiento de imágenes, controlada por STORAGE_PROVIDER:
//
// - "local" (por defecto): guarda los archivos en /public/uploads/propiedades.
//   Funciona perfecto en desarrollo y en un servidor propio con disco
//   persistente (VPS, Railway, Render, etc). NO funciona en Vercel, porque
//   las funciones serverless tienen el filesystem de solo lectura: si vas a
//   desplegar en Vercel, usá "cloudinary" (ver README, sección Deploy).
//
// - "cloudinary": sube las imágenes a Cloudinary (tienen un plan gratuito
//   generoso). Necesita la variable de entorno CLOUDINARY_URL, que te la da
//   Cloudinary en el dashboard con el formato:
//   cloudinary://<api_key>:<api_secret>@<cloud_name>
//
// Si en el futuro querés otro proveedor (S3, etc.), este es el único
// archivo que hace falta tocar: el resto de la app solo llama a
// guardarImagen()/eliminarImagen().

export const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
export const TAMANO_MAXIMO_BYTES = 8 * 1024 * 1024; // 8MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "propiedades");

function extensionPara(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function guardarImagen(file: File): Promise<string> {
  const provider = process.env.STORAGE_PROVIDER ?? "local";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (provider === "cloudinary") {
    return subirACloudinary(buffer);
  }

  if (provider !== "local") {
    throw new Error(
      `STORAGE_PROVIDER="${provider}" no está implementado. Los valores soportados son "local" y "cloudinary" (ver src/lib/storage.ts).`
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const nombreArchivo = `${Date.now()}-${crypto.randomUUID()}.${extensionPara(file.type)}`;
  const rutaAbsoluta = path.join(UPLOAD_DIR, nombreArchivo);

  await writeFile(rutaAbsoluta, buffer);

  return `/uploads/propiedades/${nombreArchivo}`;
}

export async function eliminarImagen(url: string): Promise<void> {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "cloudinary" && url.includes("res.cloudinary.com")) {
    await eliminarDeCloudinary(url);
    return;
  }

  if (!url.startsWith("/uploads/propiedades/")) return; // no borra imágenes externas (ej. seed con picsum)
  const rutaAbsoluta = path.join(process.cwd(), "public", url);
  await unlink(rutaAbsoluta).catch(() => undefined);
}

async function subirACloudinary(buffer: Buffer): Promise<string> {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("Falta la variable de entorno CLOUDINARY_URL para poder subir imágenes a Cloudinary.");
  }
  const cloudinary = await getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "dm-inmobiliaria/propiedades" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Error desconocido al subir la imagen."));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function eliminarDeCloudinary(url: string): Promise<void> {
  // Reconstruye el public_id a partir de la URL: todo lo que sigue a
  // "/upload/v123456789/" sin la extensión final.
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  if (!match) return;
  const cloudinary = await getCloudinary();
  await cloudinary.uploader.destroy(match[1]).catch(() => undefined);
}

export interface ConfigSubidaCliente {
  provider: "local" | "cloudinary";
  cloudName: string | null;
  uploadPreset: string | null;
}

/**
 * Datos (no secretos) que el navegador necesita para subir imágenes.
 *
 * En Vercel, las funciones serverless tienen un límite de tamaño de
 * request (~4.5MB) que una foto de celular normal supera fácilmente —
 * subir el archivo pasando por nuestro backend falla ahí con un error
 * críptico ("Unexpected end of JSON input", porque la respuesta ni
 * siquiera llega a ser JSON). La solución estándar es que el navegador
 * suba el archivo DIRECTO a Cloudinary (usando un "unsigned upload
 * preset", que no requiere exponer ninguna clave secreta) y que nuestro
 * servidor solo reciba la URL final para guardarla en la base de datos.
 * Con STORAGE_PROVIDER=local (desarrollo) esto no aplica: el archivo
 * sigue subiendo normalmente a nuestro propio backend.
 */
export function getConfigSubidaCliente(): ConfigSubidaCliente {
  const provider = process.env.STORAGE_PROVIDER === "cloudinary" ? "cloudinary" : "local";

  if (provider !== "cloudinary") {
    return { provider: "local", cloudName: null, uploadPreset: null };
  }

  // CLOUDINARY_URL tiene el formato cloudinary://<api_key>:<api_secret>@<cloud_name>
  // Acá solo extraemos el cloud_name (dato público) — el secreto nunca sale del servidor.
  const match = process.env.CLOUDINARY_URL?.match(/@([^/]+)$/);
  const cloudName = match?.[1] ?? null;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? null;

  return { provider: "cloudinary", cloudName, uploadPreset };
}
