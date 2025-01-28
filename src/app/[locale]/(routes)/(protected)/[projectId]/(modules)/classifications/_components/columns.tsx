"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/shared/data-table/cell-action";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "@/actions/categories";

export type CategoriesProps = {
  id: string;
  title: string;
  parentName?: string;
  type: string;
  projectId: string;
};

export const useColumns = (projectId: string): ColumnDef<CategoriesProps>[] => {
  const t = useTranslations("classifications");
  const { toast } = useToast();

  return [
    {
      accessorKey: "title",
      header: () => <>{t("title")}</>,
      cell: ({ row }) => <span>{row.getValue("title")}</span>,
    },
    {
      accessorKey: "parentName",
      header: () => <>{t("parentCategory")}</>,
      cell: ({ row }) => <span>{row.getValue("parentName")}</span>,
    },
    {
      accessorKey: "type",
      header: () => <>{t("type")}</>,
      cell: ({ row }) => {
        const value = row.getValue("type");
        switch (value) {
          case "product":
            return t("product");
          case "blog":
            return t("blog");
          default:
            return value;
        }
      },
    },
    {
      id: "id",
      accessorKey: "id",
      header: () => <>{t("actions")}</>,
      enableHiding: false,
      cell: ({ row }) => (
        <>
          <CellAction
            id={row.getValue("id")}
            actions={[]}
            editContext="classifications"
            basePath={`/${projectId}`}
            onDelete={async () => {
              try {
                const result = await deleteCategory(
                  projectId,
                  row.getValue("id") as string,
                );
                if (result.success) {
                  toast({
                    description: t(result.success),
                  });
                } else {
                  toast({
                    variant: "destructive",
                    description: t(result.error),
                  });
                }
              } catch (error) {
                toast({
                  variant: "destructive",
                  description: "An error occurred: " + (error as Error).message,
                });
              }
            }}
          />
        </>
      ),
    },
  ];
};
