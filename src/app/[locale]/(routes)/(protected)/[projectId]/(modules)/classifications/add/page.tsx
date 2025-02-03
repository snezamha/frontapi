import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import CategoryFormWrapper from "../_components/CategoryFormWrapper";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.addClassification"),
  };
}

interface ClassificationsProps {
  params: Promise<{ projectId: string }>;
}

export default async function ClassificationPage(props: ClassificationsProps) {
  const params = await props.params;
  const { projectId } = params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("classifications"), link: `/${projectId}/classifications` },
    { title: t("addClassification"), link: `/${projectId}/classifications` },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="my-4">
        <CategoryFormWrapper />
      </Card>
    </div>
  );
}
