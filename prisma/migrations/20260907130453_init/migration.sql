-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipoOperacion" TEXT NOT NULL,
    "estadoDestacado" TEXT NOT NULL DEFAULT 'NINGUNO',
    "tipoPropiedadId" TEXT NOT NULL,
    "direccion" TEXT,
    "zona" TEXT,
    "localidad" TEXT NOT NULL DEFAULT 'Goya, Corrientes',
    "latitud" REAL,
    "longitud" REAL,
    "superficieTotal" REAL,
    "superficieCubierta" REAL,
    "ambientes" INTEGER,
    "dormitorios" INTEGER,
    "banos" INTEGER,
    "cochera" BOOLEAN NOT NULL DEFAULT false,
    "antiguedad" INTEGER,
    "precio" REAL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "consultarPrecio" BOOLEAN NOT NULL DEFAULT false,
    "estadoPublicacion" TEXT NOT NULL DEFAULT 'BORRADOR',
    "destacadaHome" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Propiedad_tipoPropiedadId_fkey" FOREIGN KEY ("tipoPropiedadId") REFERENCES "TipoPropiedad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImagenPropiedad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propiedadId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImagenPropiedad_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TipoPropiedad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "mensaje" TEXT NOT NULL,
    "propiedadId" TEXT,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mensaje_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConfiguracionSitio" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'config',
    "telefono" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "horarios" TEXT NOT NULL DEFAULT '',
    "textoQuienesSomos" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_codigo_key" ON "Propiedad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_slug_key" ON "Propiedad"("slug");

-- CreateIndex
CREATE INDEX "Propiedad_tipoOperacion_idx" ON "Propiedad"("tipoOperacion");

-- CreateIndex
CREATE INDEX "Propiedad_estadoPublicacion_idx" ON "Propiedad"("estadoPublicacion");

-- CreateIndex
CREATE INDEX "Propiedad_tipoPropiedadId_idx" ON "Propiedad"("tipoPropiedadId");

-- CreateIndex
CREATE INDEX "ImagenPropiedad_propiedadId_idx" ON "ImagenPropiedad"("propiedadId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPropiedad_nombre_key" ON "TipoPropiedad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPropiedad_slug_key" ON "TipoPropiedad"("slug");

-- CreateIndex
CREATE INDEX "Mensaje_leido_idx" ON "Mensaje"("leido");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
