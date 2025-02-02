"use client";
import { DataTable } from "@/components/shared/data-table";
import { UsersProps, useColumns } from "./columns";
import { useLocale, useTranslations } from "next-intl";
interface DataProps {
  data: UsersProps[];
  projectId: string;
}
export const UsersClient: React.FC<DataProps> = ({ data, projectId }) => {
  const t = useTranslations("users");
  const locale = useLocale();
  const columns = useColumns(projectId, locale);
  return (
    <>
      <DataTable
        searchKeys={["fullName", "phoneNumber"]}
        name={t("users")}
        columns={columns}
        data={data}
        addNewLink="users/add"
      />
    </>
  );
};
