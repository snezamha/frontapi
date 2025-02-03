import { ProjectsClient } from "./_components/client";
import { ProjectsProps } from "./_components/columns";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getAllProjects } from "@/actions/projects";
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
    title: t("breadcrumb.listOfProjects"),
  };
}

const Projects = async () => {
  try {
    const projects = await getAllProjects();
    const formattedProjects: ProjectsProps[] = projects.map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt,
    }));
    const t = await getTranslations("breadcrumb");
    const breadcrumbItems = [{ title: t("listOfProjects"), link: "/projects" }];
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card className="my-4">
          <ProjectsClient data={formattedProjects} />
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects.</div>;
  }
};

export default Projects;
