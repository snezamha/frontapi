import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import ShareProjectForm from "../../_components/share-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.projectSettings"),
  };
}

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const projectId = (await params).projectId;
  try {
    const t = await getTranslations("breadcrumb");

    const breadcrumbItems = [
      { title: t("dashboard"), link: "/" },
      { title: t("projects"), link: "/dashboard/projects" },
      {
        title: t("projectSettings"),
        link: `/dashboard/projects/${projectId}/settings`,
      },
    ];
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card>
          <ShareProjectForm projectId={projectId} />
        </Card>
      </div>
    );
  } catch (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
};
export default ProjectPage;
