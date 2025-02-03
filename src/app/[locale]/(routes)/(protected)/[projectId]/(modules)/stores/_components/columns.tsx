"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/shared/data-table/cell-action";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { deleteStore } from "@/actions/stores";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export type StoresProps = {
  id: string;
  title: string;
  createdAt: Date;
};

export const useColumns = (
  projectId: string,
  locale: string,
): ColumnDef<StoresProps>[] => {
  const t = useTranslations("stores");
  const { toast } = useToast();
  const router = useRouter();

  return [
    {
      accessorKey: "title",
      header: () => <>{t("title")}</>,
      cell: ({ row }) => <span>{row.getValue("title")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: () => <>{t("createdAt")}</>,
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <span>{formatDate(date, locale)}</span>;
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
            actions={[
              {
                label: t("settings"),
                icon: <Settings className="w-4 h-4" />,
                onClick: () =>
                  router.push(`stores/${row.getValue("id")}/settings`),
              },
            ]}
            editContext="stores"
            basePath={`/${projectId}`}
            onDelete={async () => {
              try {
                const result = await deleteStore(
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
