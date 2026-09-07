import { Prisma } from "@prisma/client";

export type PropiedadConPortada = Prisma.PropiedadGetPayload<{
  include: { imagenes: true; tipoPropiedad: true };
}>;

export type PropiedadCompleta = Prisma.PropiedadGetPayload<{
  include: { imagenes: true; tipoPropiedad: true };
}>;
