import React from "react";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProjectById } from "@/actions/projects";
import { Project } from "@prisma/client";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.dashboard"),
  };
}

interface DashboardProps {
  params: Promise<{ projectId: string }>;
}

export default async function Dashboard(props: DashboardProps) {
  const params = await props.params;
  const { projectId } = params;
  const project = (await getProjectById(projectId)) as Project;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboardTitle", { title: project.title }),
      link: `/projects/${projectId}`,
    },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="space-y-6"></div>
    </div>
  );
}
