import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProjectById } from "@/actions/projects";
import { Project } from "@prisma/client";
import ProjectFormWrapper from "../_components/ProjectFormWrapper";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.editProject"),
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

    const project = (await getProjectById(projectId)) as Project;
    if (!project) {
      return <div></div>;
    }
    const breadcrumbItems = [
      { title: t("projects"), link: "/projects" },
      {
        title: t("editProject"),
        link: `/projects/${projectId}`,
      },
    ];
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card>
          <ProjectFormWrapper initData={project} />
        </Card>
      </div>
    );
  } catch (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
};
export default ProjectPage;
