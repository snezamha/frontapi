"use server";
import { revalidatePath } from "next/cache";
import db from "@/server/db";
import { currentUser } from "@/lib/auth";

export interface Payload {
  name: string;
}

export const updateProfile = async (id: string, payload: Payload) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (user.id !== id && !["ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized: User not allowed to update this profile");
  }

  await db.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidatePath("/profile");
};
