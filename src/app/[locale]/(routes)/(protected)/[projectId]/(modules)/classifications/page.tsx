import React from "react";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { CategoriesClient } from "./_components/client";
import { CategoriesProps } from "./_components/columns";
import { getAllCategories } from "@/actions/categories";
import ClassificationsApiDocs from "./_components/ClassificationApiDocs";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.classifications"),
  };
}

interface ClassificationsProps {
  params: Promise<{ projectId: string }>;
}

export default async function Classifications(props: ClassificationsProps) {
  const params = await props.params;
  const { projectId } = params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("classifications"), link: `/${projectId}/classifications` },
  ];
  try {
    const response = await getAllCategories(projectId);
    if (!Array.isArray(response)) {
      throw new Error("Invalid response from getAllCategories");
    }
    const formattedCategories: CategoriesProps[] = response.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: item.type,
      parentName: response.find((category) => category.id === item.parentId)
        ?.title,
      projectId: item.projectId,
    }));

    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card className="my-4">
          <CategoriesClient data={formattedCategories} projectId={projectId} />
        </Card>
        <ClassificationsApiDocs />
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories.</div>;
  }
}
