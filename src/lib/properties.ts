import { Prisma, TipoOperacion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const PROPIEDADES_POR_PAGINA = 9;

export interface FiltrosBusqueda {
  operacion?: TipoOperacion;
  tipo?: string; // slug de TipoPropiedad
  ubicacion?: string;
  ambientes?: number;
  precioMin?: number;
  precioMax?: number;
  superficieMin?: number;
  orden?: "recientes" | "precio-asc" | "precio-desc";
  pagina?: number;
  soloActivas?: boolean;
}

export function buildWhere(filtros: FiltrosBusqueda): Prisma.PropiedadWhereInput {
  const where: Prisma.PropiedadWhereInput = {};

  if (filtros.soloActivas !== false) {
    where.estadoPublicacion = "ACTIVA";
  }

  if (filtros.operacion) where.tipoOperacion = filtros.operacion;

  if (filtros.tipo) where.tipoPropiedad = { slug: filtros.tipo };

  if (filtros.ubicacion) {
    where.OR = [
      { zona: { contains: filtros.ubicacion } },
      { localidad: { contains: filtros.ubicacion } },
      { direccion: { contains: filtros.ubicacion } },
    ];
  }

  if (filtros.ambientes) where.ambientes = { gte: filtros.ambientes };

  if (filtros.precioMin != null || filtros.precioMax != null) {
    where.precio = {
      ...(filtros.precioMin != null ? { gte: filtros.precioMin } : {}),
      ...(filtros.precioMax != null ? { lte: filtros.precioMax } : {}),
    };
  }

  if (filtros.superficieMin != null) {
    where.superficieTotal = { gte: filtros.superficieMin };
  }

  return where;
}

function buildOrderBy(orden?: FiltrosBusqueda["orden"]): Prisma.PropiedadOrderByWithRelationInput {
  switch (orden) {
    case "precio-asc":
      return { precio: "asc" };
    case "precio-desc":
      return { precio: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function buscarPropiedades(filtros: FiltrosBusqueda) {
  const pagina = filtros.pagina ?? 1;
  const where = buildWhere(filtros);
  const orderBy = buildOrderBy(filtros.orden);

  const [items, total] = await Promise.all([
    prisma.propiedad.findMany({
      where,
      orderBy,
      include: {
        imagenes: { orderBy: { orden: "asc" }, take: 1 },
        tipoPropiedad: true,
      },
      skip: (pagina - 1) * PROPIEDADES_POR_PAGINA,
      take: PROPIEDADES_POR_PAGINA,
    }),
    prisma.propiedad.count({ where }),
  ]);

  return {
    items,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / PROPIEDADES_POR_PAGINA)),
    pagina,
  };
}

export async function getPropiedadPorSlug(slug: string) {
  return prisma.propiedad.findUnique({
    where: { slug },
    include: {
      imagenes: { orderBy: { orden: "asc" } },
      tipoPropiedad: true,
    },
  });
}

export async function getPropiedadesRelacionadas(propiedadId: string, tipoPropiedadId: string, tipoOperacion: TipoOperacion) {
  return prisma.propiedad.findMany({
    where: {
      id: { not: propiedadId },
      estadoPublicacion: "ACTIVA",
      OR: [{ tipoPropiedadId }, { tipoOperacion }],
    },
    include: {
      imagenes: { orderBy: { orden: "asc" }, take: 1 },
      tipoPropiedad: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

/** Tipos de propiedad que efectivamente tienen al menos una propiedad activa, para armar el menú dinámico. */
export async function getTiposConPropiedadesActivas(operacion?: TipoOperacion) {
  const tipos = await prisma.tipoPropiedad.findMany({
    where: {
      propiedades: {
        some: {
          estadoPublicacion: "ACTIVA",
          ...(operacion ? { tipoOperacion: operacion } : {}),
        },
      },
    },
    orderBy: { nombre: "asc" },
  });
  return tipos;
}

export async function getPropiedadesDestacadasHome() {
  return prisma.propiedad.findMany({
    where: { estadoPublicacion: "ACTIVA", destacadaHome: true },
    include: {
      imagenes: { orderBy: { orden: "asc" }, take: 1 },
      tipoPropiedad: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

/** Todos los tipos de propiedad (para selects del admin, sin filtrar por si tienen publicaciones activas). */
export async function getTodosTiposPropiedad() {
  return prisma.tipoPropiedad.findMany({ orderBy: { nombre: "asc" } });
}

export async function getSiguienteCodigo(): Promise<string> {
  const ultima = await prisma.propiedad.findFirst({
    orderBy: { createdAt: "desc" },
    select: { codigo: true },
  });
  if (!ultima) return "DM-1001";
  const match = ultima.codigo.match(/(\d+)$/);
  const siguiente = match ? parseInt(match[1], 10) + 1 : 1001;
  return `DM-${siguiente}`;
}
