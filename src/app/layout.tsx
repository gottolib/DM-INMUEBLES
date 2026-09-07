import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DM Inmobiliaria | Venta y alquiler de propiedades en Goya, Corrientes",
    template: "%s | DM Inmobiliaria",
  },
  description:
    "DM Inmobiliaria: compraventa, alquiler y alquiler temporario de casas, departamentos, terrenos y campos en Goya, Corrientes.",
  openGraph: {
    title: "DM Inmobiliaria",
    description: "Venta y alquiler de propiedades en Goya, Corrientes.",
    images: ["/logo-dm-inmobiliaria.svg"],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
