import { z } from "zod";

export const storeSettingsSchema = (t: (key: string) => string) =>
  z.object({
    pageSize: z
      .number({ invalid_type_error: t("pageSizeTypeError") })
      .min(1, { message: t("pageSizeError") }),
    isShippingFee: z.boolean(),
    shippingFee: z
      .number({ invalid_type_error: t("shippingFeeTypeError") })
      .nonnegative({ message: t("shippingFeeError") }),
    freeShippingMoreThan: z
      .number({ invalid_type_error: t("freeShippingMoreThanTypeError") })
      .nonnegative({ message: t("freeShippingMoreThanError") }),
    taxPercent: z
      .number({ invalid_type_error: t("taxPercentTypeError") })
      .min(0, { message: t("taxPercentMin") }),
  });
