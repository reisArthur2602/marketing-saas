import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "./prisma";
import { cache } from "react";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.defaultFallbackMessage = user.defaultFallbackMessage;
      return session;
    },
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET!,
});

export const currentUser = cache(async (): Promise<User | null> => {
  const session = await auth();
  if (!session) return null;
  return session.user || null;
});
