"use client";
import { DataTable } from "@/components/shared/data-table";
import { StoresProps, useColumns } from "./columns";
import { useLocale, useTranslations } from "next-intl";
interface DataProps {
  data: StoresProps[];
  projectId: string;
}
export const StoresCient: React.FC<DataProps> = ({ data, projectId }) => {
  const t = useTranslations("stores");
  const locale = useLocale();
  const columns = useColumns(projectId, locale);
  return (
    <>
      <DataTable
        searchKeys={["title"]}
        name={t("stores")}
        columns={columns}
        data={data}
        addNewLink="stores/add"
      />
    </>
  );
};
