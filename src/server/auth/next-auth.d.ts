import { Permission, UserRole } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      picture: string;
      role: UserRole;
      permissions: Permission[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: UserRole;
    permissions: Permission[];
  }
}
