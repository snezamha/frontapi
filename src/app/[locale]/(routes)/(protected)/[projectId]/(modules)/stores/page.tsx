import React from "react";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { StoresCient } from "./_components/client";
import { StoresProps } from "./_components/columns";
import { getAllStores } from "@/actions/stores";
import { getProjectApiKey } from "@/actions/projects";
import StoreApiDocs from "./_components/StoreApiDocs";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.stores"),
  };
}

interface LocalStoresProps {
  params: Promise<{ projectId: string }>;
}

export default async function Stores(props: LocalStoresProps) {
  const { projectId } = await props.params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    { title: t("dashboard"), link: `/${projectId}/dashboard` },
    { title: t("stores"), link: `/${projectId}/stores` },
  ];

  try {
    const response = await getAllStores(projectId);
    if (!Array.isArray(response)) {
      throw new Error("Invalid response from getAllStores");
    }
    const formattedStores: StoresProps[] = response.map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt,
    }));

    const apiKeyResponse = await getProjectApiKey(projectId);
    const apiKey = apiKeyResponse.apiKey;

    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card className="my-4">
          <StoresCient data={formattedStores} projectId={projectId} />
        </Card>
        <StoreApiDocs apiKey={apiKey} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching stores:", error);
    return <div>Error loading stores.</div>;
  }
}
