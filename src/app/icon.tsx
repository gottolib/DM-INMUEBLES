import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon generado a partir del logo real (/public/logo-dm-inmobiliaria.png),
// recortado sobre la parte superior (el ícono de casa + "DM") para que se
// vea nítido en el tamaño chico de una pestaña del navegador — el nombre
// completo de la empresa, que va debajo en el archivo original, no entraría
// legible en 64x64px.
export default async function Icon() {
  const rutaLogo = path.join(process.cwd(), "public", "logo-dm-inmobiliaria.png");
  const buffer = await readFile(rutaLogo);
  const logoDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#f3ecd9",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <img
          src={logoDataUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{ objectFit: "cover", objectPosition: "center 15%" }}
        />
      </div>
    ),
    { ...size }
  );
}
