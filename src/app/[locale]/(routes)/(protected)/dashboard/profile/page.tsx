import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "./_components/ProfileForm";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getMessages, getTranslations } from "next-intl/server";
import { createTranslator } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.profile"),
  };
}

export default async function Profile() {
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    { title: t("dashboard"), link: "/dashboard" },
    { title: t("profile"), link: "/dashboardprofile" },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b mb-6">
            <CardTitle>{t("profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
