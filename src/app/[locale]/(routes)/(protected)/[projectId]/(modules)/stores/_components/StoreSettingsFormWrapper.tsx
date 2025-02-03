"use client";

import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { storeSettingsSchema } from "@/schemas/storeSettings.schema";
import { updateStoreSettings, StoreSettingsFormData } from "@/actions/stores";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface StoreSettingsFormWrapperProps {
  storeId: string;
  initData?: {
    pageSize: number;
    isShippingFee: boolean;
    shippingFee: number;
    freeShippingMoreThan: number;
    taxPercent: number;
  } | null;
}

const StoreSettingsFormWrapper: React.FC<StoreSettingsFormWrapperProps> = ({
  storeId,
  initData,
}) => {
  const t = useTranslations("storeSettings");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<ReturnType<typeof storeSettingsSchema>>>({
    resolver: zodResolver(storeSettingsSchema(t)),
    defaultValues: {
      pageSize: initData?.pageSize ?? 10,
      isShippingFee: initData?.isShippingFee ?? false,
      shippingFee: initData?.shippingFee ?? 0,
      freeShippingMoreThan: initData?.freeShippingMoreThan ?? 0,
      taxPercent: initData?.taxPercent ?? 0,
    },
  });

  const onSubmit = async (
    values: z.infer<ReturnType<typeof storeSettingsSchema>>,
  ) => {
    try {
      const finalData: StoreSettingsFormData = { ...values, storeId };
      const result = await updateStoreSettings(finalData);
      if (result.success) {
        toast({
          description: t(result.success),
        });
      } else {
        toast({
          variant: "destructive",
          description: t(result.error || "An error occurred"),
        });
      }
      router.refresh();
    } catch (error: unknown) {
      toast({
        description: (error as Error)?.message
          ? t((error as Error).message)
          : t("somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <CardHeader className="mb-6 border-b">
        <CardTitle>{t("storeSettings")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="pageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pageSize")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("pageSize")}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue = parseInt(value, 10);
                          field.onChange(
                            !isNaN(parsedValue) ? parsedValue : "",
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="taxPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("taxPercent")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("taxPercent")}
                        value={field.value !== undefined ? field.value : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue = parseFloat(value);
                          field.onChange(
                            !isNaN(parsedValue) ? parsedValue : "",
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="isShippingFee"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("isShippingFee")}</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="isShippingFee"
                        render={({ field }) => {
                          const selected = field.value ? "active" : "deactive";
                          const handleSelect = (value: string) => {
                            field.onChange(value === "active");
                          };
                          return (
                            <div>
                              <RadioGroup
                                value={selected}
                                onValueChange={handleSelect}
                                className="flex flex-wrap gap-6"
                              >
                                <div
                                  className="flex items-center gap-2"
                                  key={field.name}
                                >
                                  <RadioGroupItem
                                    id="radio-active"
                                    value="active"
                                  />

                                  <Label
                                    htmlFor="radio-active"
                                    className="text-default-600"
                                  >
                                    {t("active")}
                                  </Label>
                                  <RadioGroupItem
                                    id="radio-deactive"
                                    value="deactive"
                                  />
                                  <Label
                                    htmlFor="radio-deactive"
                                    className="text-default-600"
                                  >
                                    {t("deactive")} ({t("free")})
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.watch("isShippingFee") && (
              <>
                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="shippingFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shippingFee")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("shippingFee")}
                            value={field.value !== undefined ? field.value : ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const parsedValue = parseFloat(value);
                              field.onChange(
                                !isNaN(parsedValue) ? parsedValue : "",
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          {formatPrice(field.value)}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="freeShippingMoreThan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("freeShippingMoreThan")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("freeShippingMoreThan")}
                            value={field.value !== undefined ? field.value : ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const parsedValue = parseFloat(value);
                              field.onChange(
                                !isNaN(parsedValue) ? parsedValue : "",
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          {formatPrice(field.value)}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            <div className="flex justify-between gap-2">
              <Button type="submit">{t("save")}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default StoreSettingsFormWrapper;
