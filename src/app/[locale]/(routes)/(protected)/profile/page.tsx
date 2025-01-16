import React from "react";
import { createTranslator, useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "./_components/ProfileForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("profile.title"),
  };
}
export default function Profile() {
  const t = useTranslations("profile");

  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b mb-6">
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
