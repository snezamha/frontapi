"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { updateProfile } from "@/actions/profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { profileSchema } from "@/schemas/profile.schema";

const ProfileForm = () => {
  const [pending, startTransition] = useTransition();
  const user = useCurrentUser();
  const t = useTranslations("profile");
  const formProfileSchema = profileSchema(t);
  type ProfileValues = z.infer<typeof formProfileSchema>;
  const form = useForm<ProfileValues>({
    resolver: zodResolver(formProfileSchema),
    mode: "onChange",
    values: {
      name: user?.name ?? "",
    },
  });
  const { toast } = useToast();

  const { formState } = form;

  function onSubmit(data: ProfileValues) {
    if (!user) return;

    if (!formState.isDirty) return;

    startTransition(() => {
      const payload = {
        name: data.name ?? "",
      };

      const updatePromise = updateProfile(user.id, payload);

      return updatePromise
        .then(() => {
          toast({
            description: t("updatedSuccessfully"),
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            description: t("somethingWentWrong"),
          });
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="inline-flex gap-x-4">
          <Button
            type="submit"
            disabled={formState.isSubmitting || pending || !formState.isDirty}
          >
            {formState.isSubmitting || pending ? (
              <>
                <span className="rounded-full animate-spin">
                  <Loader className="h-5 w-5" />
                </span>
                {t("updating")} ...
              </>
            ) : (
              t("update")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
