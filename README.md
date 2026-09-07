# DM Inmobiliaria

Sitio web inmobiliario completo para **DM Inmobiliaria**: catálogo de propiedades con filtros, fichas de detalle, formulario de contacto y botón de WhatsApp, más un **panel de administración privado** (`/admin`) para cargar, editar y borrar propiedades con imágenes, sin tocar código.

> Toda la información de ejemplo (propiedades, textos, teléfonos, nombres del equipo, fotos) es **ficticia y genérica**, pensada solo para que puedas ver el sitio funcionando desde el primer momento. Reemplazala por tus datos reales desde el panel `/admin` (o desde `.env` para lo que todavía no tiene pantalla propia).

---

## 1. Stack tecnológico

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** — paleta e identidad de marca DM Inmobiliaria (dorado / crema / charcoal)
- **Prisma ORM** + **PostgreSQL** (mismo motor en desarrollo y en producción — ver nota abajo)
- **NextAuth (Auth.js) v5** — login del panel admin con usuario y contraseña
- **Zod** — validación de formularios, en el navegador y en el servidor
- **react-hook-form**, **react-dropzone** (subida de imágenes) y **@dnd-kit** (reordenar imágenes arrastrando)

---

## 2. Requisitos previos

- [Node.js](https://nodejs.org/) versión 20 o superior
- npm (viene con Node)
- Una cuenta de [GitHub](https://github.com) y de [Vercel](https://vercel.com) si más adelante querés publicar el sitio en internet (paso 8)

---

## 3. Poner el proyecto a andar en tu computadora

### 3.1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL-DE-TU-REPOSITORIO>
cd DM-INMUEBLES
npm install
```

`npm install` también corre automáticamente `prisma generate` (está configurado en `package.json` como `postinstall`), así que no hace falta ningún paso extra ahí.

### 3.2. Crear tu archivo de variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

> **Nota:** el proyecto usa **PostgreSQL** tanto en desarrollo como en producción (así evitamos sorpresas de que algo funcione distinto en tu compu y en Vercel). Necesitás una base Postgres también para desarrollar localmente — la más simple es crear una gratis en [neon.tech](https://neon.tech) (2 minutos, ver también el paso 8.2) y usar esa misma connection string acá. Si preferís no depender de internet para programar, también podés instalar PostgreSQL en tu compu o correrlo con Docker.

Los valores más importantes de `.env` para desarrollo local:

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | Connection string de tu base PostgreSQL (Neon, local o Docker). Formato: `postgresql://usuario:password@host:5432/basededatos` |
| `NEXTAUTH_SECRET` | Clave secreta para las sesiones del admin. Cualquier texto largo y random sirve en desarrollo |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Con qué usuario y contraseña vas a entrar a `/admin` (se crean al correr el "seed", ver 3.4) |
| `WHATSAPP_NUMBER` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp para el botón flotante y "Consultar por WhatsApp" (formato: código de país + número, sin espacios ni signos, ej. `5493777123456`) |
| `STORAGE_PROVIDER` | Dónde se guardan las fotos que subís desde el admin. `local` para desarrollo (ver sección 8 para producción con Cloudinary) |

### 3.3. Crear las tablas en la base de datos

```bash
npx prisma db push
```

Esto crea todas las tablas (Propiedad, ImagenPropiedad, TipoPropiedad, Mensaje, AdminUser, ConfiguracionSitio) en la base que hayas puesto en `DATABASE_URL`. (`npm run build` también ejecuta este comando automáticamente antes de compilar, así que en Vercel se mantiene sincronizado en cada deploy sin que tengas que acordarte de correrlo a mano.)

### 3.4. Cargar datos de ejemplo (seed) y crear el usuario admin

```bash
npm run db:seed
```

Este comando:

- Crea el **usuario administrador** con el email y contraseña que pusiste en `ADMIN_EMAIL` / `ADMIN_PASSWORD` (`.env`).
- Carga 8 tipos de propiedad (Casa, Departamento, Terreno, Campo, Local, Oficina, Galpón, Quincho).
- Carga 8 propiedades de ejemplo con datos e imágenes de relleno (placeholders), para que el sitio se vea funcionando de inmediato.
- Carga la configuración general del sitio (teléfono, dirección, horarios, texto de "Quiénes somos") con datos genéricos de ejemplo.

Podés volver a correr `npm run db:seed` las veces que quieras: no duplica datos (usa upsert), solo actualiza lo que ya existe.

### 3.5. Levantar el sitio

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público, y [http://localhost:3000/admin](http://localhost:3000/admin/login) para entrar al panel (con el `ADMIN_EMAIL`/`ADMIN_PASSWORD` de tu `.env`).

### Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo |
| `npm run build` | Genera la versión de producción (valida que todo compile bien) |
| `npm run start` | Corre la versión de producción ya compilada |
| `npm run lint` | Revisa el código con ESLint |
| `npm run db:push` | Sincroniza la base de datos con `prisma/schema.prisma` cuando lo cambiás |
| `npm run db:seed` | Vuelve a cargar los datos de ejemplo y el usuario admin |
| `npm run db:studio` | Abre Prisma Studio, un panel visual para ver/editar la base de datos directamente |

---

## 4. Cómo cargar y administrar propiedades (sin tocar código)

1. Entrá a `/admin/login` con tu usuario y contraseña.
2. **Dashboard**: resumen de propiedades activas, en venta, en alquiler y mensajes sin leer.
3. **Propiedades → + Nueva propiedad**: completá los datos generales, ubicación, características y precio. Elegí **"Guardar como borrador"** (no se muestra en el sitio todavía) o **"Publicar"** (aparece inmediatamente en el sitio público).
4. Una vez creada la propiedad, más abajo en la misma pantalla vas a poder **subir las fotos**: arrastralas al recuadro punteado o hacé clic para elegirlas desde tu computadora (JPG, PNG o WEBP, hasta 8MB cada una). Podés arrastrar las miniaturas para reordenarlas, marcar cuál es la portada, o eliminarlas.
5. Desde el listado de **Propiedades** podés buscar, cambiar el estado (Activa/Inactiva/Vendida/Alquilada/Borrador), marcarla como destacada de portada, o eliminarla.
6. **Mensajes**: ahí llegan las consultas del formulario de contacto del sitio (con o sin propiedad asociada).
7. **Configuración**: teléfono, WhatsApp, email, dirección, redes sociales, horarios y el texto de "Quiénes somos" — se reflejan en todo el sitio al instante, sin tocar código.

Los tipos de propiedad del menú (Venta ▾ / Alquiler ▾) y las categorías se arman **automáticamente** según las propiedades que vayas cargando: no hay que editar código para agregar/quitar categorías del menú.

---

## 5. Reemplazar el logo real

Como no contábamos con el archivo de imagen del isotipo dentro de este entorno de desarrollo, el logo que ves hoy (`/public/logo-dm-inmobiliaria.svg`) es una **reconstrucción en SVG** fiel a tu descripción (círculo dorado, ícono de casa, "DM" en degradé dorado sobre fondo crema). Para poner tu archivo real:

1. Reemplazá el archivo `/public/logo-dm-inmobiliaria.svg` por tu logo (podés dejarlo en `.svg`, o si es `.png`, cambiá también la referencia en `src/components/brand/Logo.tsx`, `src/app/(public)/layout.tsx`... en realidad **solo hace falta reemplazar el archivo** si lo guardás con el mismo nombre `logo-dm-inmobiliaria.svg`; si preferís usar un `.png`, buscá las 3 referencias a `logo-dm-inmobiliaria.svg` en el código —con el buscador de tu editor— y cambiá la extensión).
2. El favicon (ícono de la pestaña del navegador) se genera automáticamente a partir del mismo diseño en `src/app/icon.tsx`. Si tenés el archivo oficial, lo más simple es reemplazar ese archivo por un `favicon.ico` estático en `src/app/` y borrar `icon.tsx`.

---

## 6. Decisiones de diseño (para que sepas por qué se hizo así)

Como pediste, ante decisiones no especificadas se priorizó siempre la opción más simple y mantenible:

- **Prisma 6.x en vez de 7**: al momento de armar el proyecto, Prisma 7 cambió su forma de configurar la base de datos (ya no alcanza con `DATABASE_URL` en `schema.prisma`, pide un archivo de configuración aparte con "adaptadores" de conexión). Se fijó la versión 6.19.3 (la última estable con el modelo clásico), que sigue soportando el enfoque simple de `DATABASE_URL` como variable de entorno.
- **PostgreSQL en desarrollo y producción (en vez de SQLite en desarrollo)**: el proyecto arrancó con SQLite en desarrollo por simplicidad (no requiere instalar nada), pero se pasó a PostgreSQL en ambos entornos para evitar diferencias de comportamiento entre "anda en mi compu" y "anda en Vercel". Como es el mismo motor en los dos lados, para programar localmente necesitás una base Postgres (la más simple: una gratis en Neon, la misma que usás en producción).
- **Server Actions en vez de API routes para el CRUD de propiedades/configuración del admin**: Next.js permite que los formularios llamen funciones del servidor directamente (`"use server"`), sin tener que escribir un endpoint REST a mano para cada acción. El resultado es el mismo (lógica de servidor, validada con Zod, protegida por sesión), con menos código para mantener. La subida de imágenes sí usa una API route propia (`/api/admin/properties/[id]/images`), porque ahí sí hace falta manejar archivos con `FormData`.
- **Almacenamiento de imágenes**: por defecto usa el disco local (`/public/uploads/propiedades`), que es lo más simple para desarrollo. Está preparado para Cloudinary con solo cambiar `STORAGE_PROVIDER` (ver sección 8: es imprescindible si vas a desplegar en Vercel).
- **Rate limiting del formulario de contacto**: es una limitación simple en memoria (máximo 5 envíos por minuto por IP). Frena spam básico; si el sitio recibe mucho tráfico y en un hosting con múltiples instancias (como Vercel), para un control más estricto convendría un servicio externo como Upstash Redis — no se agregó para no depender de un servicio pago adicional en un sitio de tráfico bajo/medio.

---

## 7. Estructura del proyecto (resumen)

```
prisma/
  schema.prisma        Modelo de datos
  seed.ts               Datos de ejemplo + usuario admin
src/
  app/
    (public)/            Sitio público: inicio, propiedades, quiénes somos, contacto
    admin/                Panel de administración (protegido)
    api/                  Rutas de API (auth, contacto, subida de imágenes)
    sitemap.ts, robots.ts SEO
  components/
    layout/               Header, Footer, botón de WhatsApp
    home/                 Secciones de la página de inicio
    properties/           Tarjetas, filtros, galería, formulario de contacto
    admin/                Formularios y componentes del panel admin
  lib/                    Prisma client, autenticación, validaciones Zod, utilidades
```

---

## 8. Desplegar el sitio gratis en Vercel (paso a paso)

Importante antes de empezar: en Vercel (hosting *serverless*), a diferencia de tu computadora, **el disco no es persistente ni escribible**. Eso afecta a la carpeta `public/uploads`, donde en desarrollo local se guardan las fotos que subís desde el admin. La solución (gratis) es usar Cloudinary para las imágenes, y una base de datos PostgreSQL en la nube (Neon) para los datos. Son dos cuentas gratuitas, ambas con planes más que suficientes para un sitio de este tamaño.

### 8.1. Subir el código a GitHub

Si todavía no lo hiciste:

```bash
git init
git add .
git commit -m "DM Inmobiliaria"
```

Creá un repositorio nuevo en GitHub y subí el código (GitHub te muestra los comandos exactos al crear el repo, algo como `git remote add origin ... && git push -u origin main`).

### 8.2. Crear la base de datos en Neon (PostgreSQL gratis)

1. Entrá a [neon.tech](https://neon.tech) y creá una cuenta gratis.
2. Creá un proyecto nuevo. Neon te va a dar una **connection string** (empieza con `postgresql://...`). Copiala — la vas a usar como `DATABASE_URL` en el paso 8.4.

(`prisma/schema.prisma` ya está configurado con `provider = "postgresql"`, así que no hace falta tocar nada de código para este paso.)

### 8.3. Crear la cuenta de Cloudinary (imágenes gratis)

1. Entrá a [cloudinary.com](https://cloudinary.com/users/register/free) y creá una cuenta gratis.
2. En el Dashboard vas a ver una variable llamada **"API Environment variable"**, con un formato como:
   ```
   cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@tu-cloud-name
   ```
   Copiala tal cual (la vas a necesitar en el paso siguiente).

### 8.4. Importar el proyecto en Vercel

1. Entrá a [vercel.com](https://vercel.com), creá una cuenta (podés usar tu cuenta de GitHub) y hacé clic en **"Add New... → Project"**.
2. Elegí el repositorio que subiste en el paso 8.1.
3. En **"Environment Variables"**, cargá las mismas variables que tenés en tu `.env` local, con estos valores para producción:

   | Variable | Valor en producción |
   |---|---|
   | `DATABASE_URL` | La connection string de Neon (paso 8.2) |
   | `NEXTAUTH_SECRET` | Un valor random distinto al de desarrollo (generalo con `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | La URL que te va a dar Vercel, ej. `https://dm-inmobiliaria.vercel.app` (podés completarla después del primer deploy y volver a desplegar) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Tus credenciales reales de administrador |
   | `WHATSAPP_NUMBER` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número real |
   | `NEXT_PUBLIC_SITE_URL` | La misma URL de Vercel |
   | `STORAGE_PROVIDER` | `cloudinary` |
   | `CLOUDINARY_URL` | El valor que copiaste en el paso 8.3 |

4. Hacé clic en **Deploy**. Vercel instala dependencias, corre `prisma generate` y `prisma db push` (crean/actualizan las tablas en Neon automáticamente) y compila el sitio — no hace falta ningún paso manual de migraciones.

### 8.5. Sembrar datos de ejemplo en la base de producción (opcional)

Si querés que el sitio arranque con las propiedades de ejemplo (en vez de vacío), corré esto una sola vez desde tu computadora apuntando a la base de Neon:

```bash
DATABASE_URL="postgresql://...tu-connection-string-de-neon..." ADMIN_EMAIL="tu-email" ADMIN_PASSWORD="tu-clave" npm run db:seed
```

Con esto ya tenés el sitio funcionando en tu URL de Vercel, con base de datos en la nube y subida de imágenes funcionando a través de Cloudinary.

> Cada vez que hagas `git push` a la rama principal, Vercel vuelve a desplegar el sitio automáticamente.

---

## 9. Problemas comunes

- **"Invalid `prisma...` invocation" o errores de Prisma Client desactualizado**: corré `npx prisma generate` y reiniciá `npm run dev`.
- **No puedo entrar a `/admin`**: verificá que `ADMIN_EMAIL` / `ADMIN_PASSWORD` en tu `.env` sean los mismos que usaste la última vez que corriste `npm run db:seed` (el seed es lo que crea/actualiza ese usuario).
- **Las imágenes que subo no se ven en producción (Vercel)**: revisá que `STORAGE_PROVIDER=cloudinary` y `CLOUDINARY_URL` estén cargadas en las variables de entorno de Vercel (sección 8.4). Con `STORAGE_PROVIDER=local` las imágenes solo persisten en tu computadora, no en Vercel.
- **Cambié `prisma/schema.prisma` y no se refleja**: corré `npm run db:push` para sincronizar la base de datos (en Vercel esto ya pasa solo en cada deploy).
