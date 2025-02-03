import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import StoreSettingsFormWrapper from "../../_components/StoreSettingsFormWrapper";
import { getStoreSettings } from "@/actions/stores";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.storeSettings"),
  };
}

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ projectId: string; storeId: string }>;
}) => {
  const projectId = (await params).projectId;
  const storeId = (await params).storeId;

  try {
    const t = await getTranslations("breadcrumb");
    const storeSettings = await getStoreSettings(storeId);
    const breadcrumbItems = [
      {
        title: t("dashboard"),
        link: `/${projectId}/dashboard`,
      },
      { title: t("stores"), link: `/${projectId}/stores` },
      {
        title: t("storeSettings"),
        link: `/${projectId}/stores/${storeId}/settings`,
      },
    ];
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card className="my-4">
          <StoreSettingsFormWrapper
            initData={storeSettings.data}
            storeId={storeId}
          />
        </Card>
      </div>
    );
  } catch (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
};
export default ProjectPage;
