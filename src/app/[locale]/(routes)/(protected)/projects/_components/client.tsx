"use client";
import { DataTable } from "@/components/shared/data-table";
import { ProjectsProps, useColumns } from "./columns";
import { useLocale, useTranslations } from "next-intl";
interface DataProps {
  data: ProjectsProps[];
}
export const ProjectsClient: React.FC<DataProps> = ({ data }) => {
  const t = useTranslations("projects");
  const locale = useLocale();
  const columns = useColumns(locale);
  return (
    <>
      <DataTable
        searchKeys={["title"]}
        name={t("projects")}
        columns={columns}
        data={data}
        addNewLink="/projects/add"
      />
    </>
  );
};
