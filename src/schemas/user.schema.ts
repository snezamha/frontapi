import { z } from "zod";

export const userSchema = (t: (key: string) => string) => {
  const REG = /^09\d{9}$/;
  return z.object({
    id: z.string().optional(),
    fullName: z.string().nullable(),
    phoneNumber: z
      .string()
      .length(11, {
        message: t("phoneNumberLength"),
      })
      .regex(REG, t("phoneNumberInvalid")),
    projectId: z.string(),
  });
};
