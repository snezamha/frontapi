import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
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
    title: t("breadcrumb.addProject"),
  };
}

const ProjectPage = async () => {
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    { title: t("projects"), link: "/projects" },
    { title: t("addProject"), link: `/projects/add` },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="my-4">
        <ProjectFormWrapper />
      </Card>
    </div>
  );
};

export default ProjectPage;
