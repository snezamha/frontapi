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

  await db.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidatePath("/profile");
};
