import { z } from "zod";

export const profileSchema = (t: (key: string) => string) => {
  return z.object({
    name: z
      .string({ required_error: t("nameRequired") })
      .min(3, { message: t("nameMinLength") })
      .max(50, { message: t("nameMaxLength") }),
  });
};
