import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Protege todas las rutas /admin/* (páginas y API) excepto la de login.
// El login queda accesible sin sesión; todo lo demás redirige a /admin/login.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const esLogin = pathname === "/admin/login";
  const esApiAdmin = pathname.startsWith("/api/admin");

  if (!req.auth && !esLogin) {
    if (esApiAdmin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && esLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
