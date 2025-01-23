import React from "react";
import { createTranslator } from "next-intl";
import { getMessages } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.dashboard"),
  };
}

export default function Dashboard() {
  const t = useTranslations("breadcrumb");
  const breadcrumbItems = [{ title: t("dashboard"), link: "/dashboard" }];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="space-y-6"></div>
    </div>
  );
}
