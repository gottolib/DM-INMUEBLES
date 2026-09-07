import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propiedades = await prisma.propiedad.findMany({
    where: { estadoPublicacion: "ACTIVA" },
    select: { slug: true, updatedAt: true },
  });

  const estaticas: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/propiedades/venta`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/propiedades/alquiler`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/propiedades/alquiler-temporario`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/quienes-somos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contacto`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const dinamicas: MetadataRoute.Sitemap = propiedades.map((p) => ({
    url: `${siteUrl}/propiedades/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...estaticas, ...dinamicas];
}
