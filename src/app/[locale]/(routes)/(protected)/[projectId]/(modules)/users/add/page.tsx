import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import UserFormWrapper from "../_components/UserFormWrapper";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.addUser"),
  };
}

interface ClassificationsProps {
  params: Promise<{ projectId: string }>;
}

export default async function UsersPage(props: ClassificationsProps) {
  const params = await props.params;
  const { projectId } = params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    {
      title: t("dashboard"),
      link: `/${projectId}/dashboard`,
    },
    { title: t("users"), link: `/${projectId}/users` },
    { title: t("addUser"), link: `/${projectId}/users` },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <Card>
        <UserFormWrapper />
      </Card>
    </div>
  );
}
