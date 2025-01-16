import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import db from "@/server/db";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
function getGoogleCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_SECRET");
  }

  return { clientId, clientSecret };
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },

    async session({ token, session }: { token: JWT; session: Session }) {
      const user = await db.user.findFirst({
        where: {
          email: token.email ?? "",
        },
      });

      if (!user) {
        try {
          const newUser = await db.user.create({
            data: {
              name: token.name,
              email: token.email || "",
              picture: token.picture,
              provider: token.provider as string,
              providerAccountId: token.providerAccountId as string,
              role: "USER",
              permissions: [],
            },
          });
          session.user.id = newUser.id;
          session.user.name = newUser.name || "";
          session.user.email = newUser.email;
          session.user.picture = newUser.picture || "";
          session.user.role = newUser.role;
          session.user.permissions = newUser.permissions;
          return session;
        } catch (error) {
          console.log(error);
          return session;
        }
      } else {
        if (
          user.provider !== token.provider ||
          user.providerAccountId !== token.providerAccountId
        ) {
          const updateUser = await db.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: token.name,
              email: token.email as string,
              picture: token.picture,
              provider: token.provider as string,
              providerAccountId: token.providerAccountId as string,
            },
          });
          session.user.id = updateUser.id;
          session.user.name = updateUser.name || "";
          session.user.email = updateUser.email;
          session.user.picture = updateUser.picture || "";
          session.user.role = updateUser.role;
          session.user.permissions = updateUser.permissions;
        } else {
          session.user.id = user.id;
          session.user.name = user.name || "";
          session.user.email = user.email;
          session.user.picture = user.picture || "";
          session.user.role = user.role;
          session.user.permissions = user.permissions;
        }
      }
      return session;
    },
  },
});
