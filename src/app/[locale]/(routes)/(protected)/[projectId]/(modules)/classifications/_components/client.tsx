"use client";
import { DataTable } from "@/components/shared/data-table";
import { CategoriesProps, useColumns } from "./columns";
import { useTranslations } from "next-intl";
interface DataProps {
  data: CategoriesProps[];
  projectId: string;
}
export const CategoriesClient: React.FC<DataProps> = ({ data, projectId }) => {
  const t = useTranslations("classifications");
  const columns = useColumns(projectId);
  return (
    <>
      <DataTable
        searchKeys={["title"]}
        name={t("classifications")}
        columns={columns}
        data={data}
        addNewLink="classifications/add"
      />
    </>
  );
};
