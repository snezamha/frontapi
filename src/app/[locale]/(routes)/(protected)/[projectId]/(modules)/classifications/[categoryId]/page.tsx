import { Card } from "@/components/ui/card";
import CategoryFormWrapper from "../_components/CategoryFormWrapper";
import { getMessages, getTranslations } from "next-intl/server";
import { createTranslator } from "next-intl";
import { Categories } from "@prisma/client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getCategory } from "@/actions/categories";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.editClassification"),
  };
}

interface ClassificationsProps {
  params: Promise<{ projectId: string; categoryId: string }>;
}

export default async function ClassificationPage(props: ClassificationsProps) {
  const params = await props.params;
  const { projectId } = params;
  const categoryId = params.categoryId;
  const category = (await getCategory(projectId, categoryId)) as Categories;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("classifications"), link: `/${projectId}/classifications` },
    {
      title: t("editClassification"),
      link: `/${projectId}/classifications/${projectId}`,
    },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="my-4">
        <CategoryFormWrapper initData={category} />
      </Card>
    </div>
  );
}
