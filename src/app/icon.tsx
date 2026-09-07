import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon generado dinámicamente con la identidad de marca (círculo dorado
// con ícono de casa y "DM"), para no depender de un archivo binario.
// Si más adelante tenés el logo oficial en PNG, podés reemplazar este
// archivo por un favicon.ico estático en /src/app y borrar este icon.tsx.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #3a3a42, #1e1e24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "88%",
            height: "88%",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e8d9a6, #c9a24b, #9c7a2e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "86%",
              height: "86%",
              borderRadius: "50%",
              background: "#f3ecd9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: 26,
              color: "#9c7a2e",
            }}
          >
            DM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
