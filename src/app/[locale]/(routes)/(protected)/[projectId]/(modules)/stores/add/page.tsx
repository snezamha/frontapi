import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import StoreFormWrapper from "../_components/StoreFormWrapper";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.stores"),
  };
}

interface StoresProps {
  params: Promise<{ projectId: string }>;
}

export default async function StoresPage(props: StoresProps) {
  const params = await props.params;
  const { projectId } = params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("stores"), link: `/${projectId}/stores` },
    { title: t("addStore"), link: `/${projectId}/stores` },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="my-4">
        <StoreFormWrapper />
      </Card>
    </div>
  );
}
