import { Card } from "@/components/ui/card";
import { getMessages, getTranslations } from "next-intl/server";
import { createTranslator } from "next-intl";
import { ProjectUser } from "@prisma/client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import UserFormWrapper from "../_components/UserFormWrapper";
import { getUserById } from "@/actions/users";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.users"),
  };
}

interface UsersPageProps {
  params: Promise<{ projectId: string; userId: string }>;
}

export default async function UsersPage(props: UsersPageProps) {
  const params = await props.params;
  const { projectId } = params;
  const userId = params.userId;
  const user = (await getUserById(projectId, userId)) as ProjectUser;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("users"), link: `/${projectId}/users` },
    {
      title: t("editUser"),
      link: `/${projectId}/users/${projectId}`,
    },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card>
        <UserFormWrapper initData={user} />
      </Card>
    </div>
  );
}
