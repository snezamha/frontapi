import React from "react";
import { createTranslator } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { UsersClient } from "./_components/client";
import { UsersProps } from "./_components/columns";
import { getAllUsers } from "@/actions/users";
import { getProjectApiKey } from "@/actions/projects";
import UserApiDocs from "./_components/UserApiDocs";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("breadcrumb.users"),
  };
}

interface LocalUsersProps {
  params: Promise<{ projectId: string }>;
}

export default async function Users(props: LocalUsersProps) {
  const { projectId } = await props.params;
  const t = await getTranslations("breadcrumb");
  const breadcrumbItems = [
    { title: t("dashboard"), link: `/${projectId}/dashboard` },
    { title: t("users"), link: `/${projectId}/users` },
  ];

  try {
    const response = await getAllUsers(projectId);
    if (!Array.isArray(response)) {
      throw new Error("Invalid response from getAllUsers");
    }
    const formattedUsers: UsersProps[] = response.map((item) => ({
      id: item.id,
      phoneNumber: item.phoneNumber,
      fullName: item.fullName || "",
      createdAt: item.createdAt,
    }));

    const apiKeyResponse = await getProjectApiKey(projectId);
    const apiKey = apiKeyResponse.apiKey;

    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <Card>
          <UsersClient data={formattedUsers} projectId={projectId} />
        </Card>
        <UserApiDocs apiKey={apiKey} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading users.</div>;
  }
}
