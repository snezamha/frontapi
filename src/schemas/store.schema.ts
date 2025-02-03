import { z } from "zod";

export const storeSchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(),
    title: z.string().min(1, t("titleRequired")),
    description: z.string().optional().nullable(),
    projectId: z.string(),
  });
};
