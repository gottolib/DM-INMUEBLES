import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imágenes placeholder que usa el seed de ejemplo. Podés borrar esta
      // entrada cuando reemplaces las fotos de ejemplo por las tuyas.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Imágenes subidas mediante STORAGE_PROVIDER=cloudinary (ver .env.example).
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
