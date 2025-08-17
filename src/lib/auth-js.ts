import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";
import { cache } from "react";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET!,
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});

export const currentUser = cache(async (): Promise<User | null> => {
  const session = await auth();
  if (!session) return null;
  return session.user || null;
});
