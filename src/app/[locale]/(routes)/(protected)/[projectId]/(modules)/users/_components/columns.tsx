"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "@/components/shared/data-table/cell-action";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { deleteUser } from "@/actions/users";

export type UsersProps = {
  id: string;
  phoneNumber: string;
  fullName?: string;
  createdAt: Date;
};

export const useColumns = (
  projectId: string,
  locale: string,
): ColumnDef<UsersProps>[] => {
  const t = useTranslations("users");
  const { toast } = useToast();

  return [
    {
      accessorKey: "phoneNumber",
      header: () => <>{t("phoneNumber")}</>,
      cell: ({ row }) => <span>{row.getValue("phoneNumber")}</span>,
    },
    {
      accessorKey: "fullName",
      header: () => <>{t("fullName")}</>,
      cell: ({ row }) => <span>{row.getValue("fullName")}</span>,
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
            actions={[]}
            editContext="users"
            basePath={`/${projectId}`}
            onDelete={async () => {
              try {
                const result = await deleteUser(
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
