import { z } from "zod";

export const projectSchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(),
    title: z
      .string({ required_error: t("titleRequired") })
      .min(3, { message: t("titleMinLength") })
      .max(50, { message: t("titleMaxLength") })
      .nullable(),
  });
};

const userPermissionSchema = (t: (key: string) => string) =>
  z.object({
    userId: z.string().nonempty(t("userRequired")),
    permissions: z
      .array(z.enum(["FULLACCESS", "ADD", "EDIT", "DELETE", "VIEW"]))
      .min(1, t("permissionRequired")),
  });

export const shareProjectModalSchema = (t: (key: string) => string) => {
  return z.object({
    projectId: z.string(),
    items: z.array(userPermissionSchema(t)).nonempty(t("atLeastOneUser")),
  });
};
