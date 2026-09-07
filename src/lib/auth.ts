import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Autenticación del panel /admin: un único usuario administrador
// (o los que se creen a mano en la tabla AdminUser) validado contra
// la base de datos con su contraseña hasheada (bcrypt). Sesión por JWT,
// sin adapter: no hace falta persistir sesiones en la base para un solo
// usuario, así que este enfoque es el más simple posible.
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const valido = await bcrypt.compare(password, user.passwordHash);
        if (!valido) return null;

        return { id: user.id, email: user.email, name: user.nombre };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
