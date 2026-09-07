/**
 * Datos de ejemplo para poder ver el sitio funcionando de inmediato.
 * Todo el contenido (propiedades, textos, imágenes) es ficticio/genérico:
 * NO proviene de ninguna inmobiliaria real. Reemplazalo desde el panel
 * /admin por tus propiedades e imágenes reales.
 *
 * Las fotos son placeholders libres de picsum.photos (servicio público de
 * imágenes de relleno). Subí tus propias fotos desde el admin para
 * reemplazarlas.
 */
import { PrismaClient, TipoOperacion, EstadoDestacado, EstadoPublicacion } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify, generarCodigo } from "../src/lib/utils";

const prisma = new PrismaClient();

const TIPOS = [
  { nombre: "Casa", slug: "casa" },
  { nombre: "Departamento", slug: "departamento" },
  { nombre: "Terreno", slug: "terreno" },
  { nombre: "Campo", slug: "campo" },
  { nombre: "Local Comercial", slug: "local" },
  { nombre: "Oficina", slug: "oficina" },
  { nombre: "Galpón", slug: "galpon" },
  { nombre: "Quincho", slug: "quincho" },
];

const PLACEHOLDER_IDS = [1011, 1015, 1016, 1018, 1020, 1021, 1024, 1031, 1033, 1043, 1048, 1052];

function placeholderUrl(seed: number, w = 1200, h = 800) {
  return `https://picsum.photos/id/${seed}/${w}/${h}`;
}

const PROPIEDADES: Array<{
  titulo: string;
  descripcion: string;
  tipoOperacion: TipoOperacion;
  tipoSlug: string;
  estadoDestacado: EstadoDestacado;
  direccion: string;
  zona: string;
  superficieTotal: number;
  superficieCubierta: number | null;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  cochera: boolean;
  antiguedad: number | null;
  precio: number | null;
  moneda: string;
  consultarPrecio: boolean;
  destacadaHome: boolean;
  imagenes: number[];
}> = [
  {
    titulo: "Casa de 3 dormitorios con parque y pileta",
    descripcion:
      "Amplia casa de una planta en zona residencial tranquila. Living comedor con acceso directo a galería, parque parquizado con pileta y quincho independiente. Cocina integrada con muebles a medida, dormitorio en suite y placares en todas las habitaciones. Ideal para familia numerosa que busca comodidad y espacios verdes.",
    tipoOperacion: TipoOperacion.VENTA,
    tipoSlug: "casa",
    estadoDestacado: EstadoDestacado.DESTACADA,
    direccion: "Calle Los Naranjos 245",
    zona: "Barrio Parque",
    superficieTotal: 450,
    superficieCubierta: 180,
    ambientes: 5,
    dormitorios: 3,
    banos: 2,
    cochera: true,
    antiguedad: 8,
    precio: 145000,
    moneda: "USD",
    consultarPrecio: false,
    destacadaHome: true,
    imagenes: [PLACEHOLDER_IDS[0], PLACEHOLDER_IDS[1], PLACEHOLDER_IDS[2]],
  },
  {
    titulo: "Departamento a estrenar con balcón",
    descripcion:
      "Departamento de 2 ambientes a estrenar en edificio con acceso controlado. Excelente iluminación natural, cocina abierta al living comedor, balcón terraza y baño completo con ventilación al exterior. A pocas cuadras del centro, ideal para inversión o primera vivienda.",
    tipoOperacion: TipoOperacion.VENTA,
    tipoSlug: "departamento",
    estadoDestacado: EstadoDestacado.EXCELENTE,
    direccion: "Av. Centenario 780, piso 3°",
    zona: "Zona Centro",
    superficieTotal: 52,
    superficieCubierta: 48,
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    cochera: false,
    antiguedad: 0,
    precio: 62000,
    moneda: "USD",
    consultarPrecio: false,
    destacadaHome: true,
    imagenes: [PLACEHOLDER_IDS[3], PLACEHOLDER_IDS[4]],
  },
  {
    titulo: "Terreno en esquina apto para emprendimiento",
    descripcion:
      "Excelente lote en esquina, todos los servicios en la puerta (agua, luz, cloacas, pavimento). Muy buena ubicación con alto flujo vehicular, apto para vivienda o local comercial. Medidas y documentación al día.",
    tipoOperacion: TipoOperacion.VENTA,
    tipoSlug: "terreno",
    estadoDestacado: EstadoDestacado.BUENA,
    direccion: "Esquina Ruta 12 y Calle San Martín",
    zona: "Acceso Norte",
    superficieTotal: 600,
    superficieCubierta: null,
    ambientes: null,
    dormitorios: null,
    banos: null,
    cochera: false,
    antiguedad: null,
    precio: 38000,
    moneda: "USD",
    consultarPrecio: false,
    destacadaHome: true,
    imagenes: [PLACEHOLDER_IDS[5]],
  },
  {
    titulo: "Casa céntrica en alquiler, lista para mudarse",
    descripcion:
      "Casa de 2 dormitorios en pleno centro, a metros de bancos, comercios y colegios. Living comedor amplio, cocina reciclada, patio trasero con lavadero independiente. Se entrega con instalación de aire acondicionado en dormitorio principal.",
    tipoOperacion: TipoOperacion.ALQUILER,
    tipoSlug: "casa",
    estadoDestacado: EstadoDestacado.EXCELENTE,
    direccion: "Calle Belgrano 512",
    zona: "Zona Centro",
    superficieTotal: 220,
    superficieCubierta: 110,
    ambientes: 4,
    dormitorios: 2,
    banos: 1,
    cochera: true,
    antiguedad: 25,
    precio: 320000,
    moneda: "ARS",
    consultarPrecio: false,
    destacadaHome: true,
    imagenes: [PLACEHOLDER_IDS[6], PLACEHOLDER_IDS[7]],
  },
  {
    titulo: "Departamento 1 dormitorio amoblado en alquiler",
    descripcion:
      "Monoambiente amplio totalmente amoblado y equipado, ideal para estudiantes o profesionales. Incluye wifi, TV y electrodomésticos. Edificio con portero eléctrico, a 3 cuadras de la plaza principal.",
    tipoOperacion: TipoOperacion.ALQUILER,
    tipoSlug: "departamento",
    estadoDestacado: EstadoDestacado.BUENA,
    direccion: "Calle Colón 1120, piso 1°",
    zona: "Zona Centro",
    superficieTotal: 38,
    superficieCubierta: 38,
    ambientes: 1,
    dormitorios: 1,
    banos: 1,
    cochera: false,
    antiguedad: 12,
    precio: 180000,
    moneda: "ARS",
    consultarPrecio: false,
    destacadaHome: false,
    imagenes: [PLACEHOLDER_IDS[8]],
  },
  {
    titulo: "Casa de campo con quincho para alquiler temporario",
    descripcion:
      "Casa de fin de semana a orillas del río, ideal para descanso familiar. Cuenta con quincho techado, parrilla, pileta y amplio parque con árboles añosos. Capacidad para 8 personas, ropa de cama incluida.",
    tipoOperacion: TipoOperacion.ALQUILER_TEMPORARIO,
    tipoSlug: "quincho",
    estadoDestacado: EstadoDestacado.DESTACADA,
    direccion: "Costanera Sur s/n",
    zona: "Zona Río",
    superficieTotal: 900,
    superficieCubierta: 95,
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    cochera: true,
    antiguedad: 15,
    precio: 45000,
    moneda: "ARS",
    consultarPrecio: false,
    destacadaHome: true,
    imagenes: [PLACEHOLDER_IDS[9], PLACEHOLDER_IDS[10], PLACEHOLDER_IDS[11]],
  },
  {
    titulo: "Local comercial sobre avenida principal",
    descripcion:
      "Local a la calle con amplia vidriera, salón principal, depósito y baño. Excelente esquina de alto tránsito peatonal y vehicular, ideal para cualquier rubro comercial o gastronómico.",
    tipoOperacion: TipoOperacion.ALQUILER,
    tipoSlug: "local",
    estadoDestacado: EstadoDestacado.NINGUNO,
    direccion: "Av. San Martín 890",
    zona: "Zona Centro",
    superficieTotal: 120,
    superficieCubierta: 120,
    ambientes: 2,
    dormitorios: null,
    banos: 1,
    cochera: false,
    antiguedad: 20,
    precio: null,
    moneda: "USD",
    consultarPrecio: true,
    destacadaHome: false,
    imagenes: [PLACEHOLDER_IDS[0], PLACEHOLDER_IDS[6]],
  },
  {
    titulo: "Campo productivo con casco y monte natural",
    descripcion:
      "Establecimiento rural con casco de estancia, galpones de chapa y aguadas naturales. Apto para ganadería o agricultura. Fácil acceso por camino consolidado, a 20 minutos del centro de la ciudad.",
    tipoOperacion: TipoOperacion.VENTA,
    tipoSlug: "campo",
    estadoDestacado: EstadoDestacado.NINGUNO,
    direccion: "Paraje Rural km 14",
    zona: "Zona Rural",
    superficieTotal: 850000,
    superficieCubierta: 210,
    ambientes: null,
    dormitorios: null,
    banos: null,
    cochera: false,
    antiguedad: null,
    precio: null,
    moneda: "USD",
    consultarPrecio: true,
    destacadaHome: false,
    imagenes: [PLACEHOLDER_IDS[5], PLACEHOLDER_IDS[9]],
  },
];

async function main() {
  console.log("Sembrando base de datos de DM Inmobiliaria...");

  // --- Usuario administrador de prueba ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@dminmobiliaria.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "CambiarEstaClave123";
  const adminNombre = process.env.ADMIN_NAME ?? "Administrador DM Inmobiliaria";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, nombre: adminNombre },
    create: { email: adminEmail, passwordHash, nombre: adminNombre },
  });
  console.log(`Usuario admin listo: ${adminEmail}`);

  // --- Configuración general del sitio ---
  await prisma.configuracionSitio.upsert({
    where: { id: "config" },
    update: {},
    create: {
      id: "config",
      telefono: "+54 3777 40-1234",
      whatsapp: process.env.WHATSAPP_NUMBER ?? "5493777123456",
      email: "contacto@dminmobiliaria.com.ar",
      direccion: "Av. Colón 456, Goya, Corrientes",
      facebookUrl: "https://facebook.com/",
      instagramUrl: "https://instagram.com/",
      horarios: "Lunes a viernes de 8 a 12 y de 16 a 20 hs. Sábados de 9 a 12 hs.",
      textoQuienesSomos:
        "DM Inmobiliaria es una empresa familiar dedicada a la compraventa y alquiler de propiedades en Goya y la región. Con años de trayectoria acompañando a nuestros clientes, combinamos atención personalizada, conocimiento del mercado local y transparencia en cada operación. Nuestro objetivo es ayudarte a encontrar el lugar ideal, ya sea tu próximo hogar, una inversión o un espacio para tu negocio.",
    },
  });
  console.log("Configuración del sitio lista.");

  // --- Tipos de propiedad ---
  const tiposCreados = new Map<string, string>();
  for (const tipo of TIPOS) {
    const creado = await prisma.tipoPropiedad.upsert({
      where: { slug: tipo.slug },
      update: { nombre: tipo.nombre },
      create: tipo,
    });
    tiposCreados.set(tipo.slug, creado.id);
  }
  console.log(`${TIPOS.length} tipos de propiedad listos.`);

  // --- Propiedades de ejemplo ---
  let count = 0;
  for (const [index, p] of PROPIEDADES.entries()) {
    const tipoPropiedadId = tiposCreados.get(p.tipoSlug);
    if (!tipoPropiedadId) continue;

    const codigo = generarCodigo(index + 1);
    const slug = `${slugify(p.titulo)}-${codigo.toLowerCase()}`;

    const propiedad = await prisma.propiedad.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        slug,
        titulo: p.titulo,
        descripcion: p.descripcion,
        tipoOperacion: p.tipoOperacion,
        estadoDestacado: p.estadoDestacado,
        tipoPropiedadId,
        direccion: p.direccion,
        zona: p.zona,
        localidad: "Goya, Corrientes",
        superficieTotal: p.superficieTotal,
        superficieCubierta: p.superficieCubierta,
        ambientes: p.ambientes,
        dormitorios: p.dormitorios,
        banos: p.banos,
        cochera: p.cochera,
        antiguedad: p.antiguedad,
        precio: p.precio,
        moneda: p.moneda,
        consultarPrecio: p.consultarPrecio,
        estadoPublicacion: EstadoPublicacion.ACTIVA,
        destacadaHome: p.destacadaHome,
        imagenes: {
          create: p.imagenes.map((seed, i) => ({
            url: placeholderUrl(seed),
            orden: i,
            esPortada: i === 0,
          })),
        },
      },
    });
    count++;
    console.log(`Propiedad creada: ${propiedad.codigo} - ${propiedad.titulo}`);
  }
  console.log(`${count} propiedades de ejemplo listas.`);
  console.log("Seed finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
