import { Card } from "@/components/ui/card";
import StoreFormWrapper from "../_components/StoreFormWrapper";
import { getMessages, getTranslations } from "next-intl/server";
import { createTranslator } from "next-intl";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getStoreById } from "@/actions/stores";
import { Store } from "@prisma/client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.editStore"),
  };
}

interface StoresProps {
  params: Promise<{ projectId: string; storeId: string }>;
}

export default async function StorePage(props: StoresProps) {
  const params = await props.params;
  const { projectId } = params;
  const storeId = params.storeId;
  const store = (await getStoreById(projectId, storeId)) as Store;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("stores"), link: `/${projectId}/stores` },
    {
      title: t("editStore"),
      link: `/${projectId}/stores/${projectId}`,
    },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="my-4">
        <StoreFormWrapper initData={store} />
      </Card>
    </div>
  );
}
