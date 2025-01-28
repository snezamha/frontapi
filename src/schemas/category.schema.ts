import { z } from "zod";

export const categorySchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(),
    title: z.string().min(1, t("titleRequired")),
    parentId: z.string().optional().nullable(),
    type: z.string(),
    projectId: z.string(),
  });
};
