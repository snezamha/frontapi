"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import AlertModal from "../modal/alert-modal";

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

interface CellActionProps {
  id: string;
  actions: Action[];
  onDelete?: () => Promise<void>;
  editContext?: string;
  basePath?: string;
  deleteConfirmationText?: string;
  loadingText?: string;
}

export const CellAction = ({
  id,
  actions,
  onDelete,
  editContext,
  basePath,
}: CellActionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("cellActions");
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : t("deleteFailed");
      toast({
        variant: "destructive",
        description: errMessage,
      });
    } finally {
      setOpen(false);
      router.refresh();
      setLoading(false);
    }
  };
  const handleEdit = () => {
    if (editContext) {
      const editUrl = `${basePath}/${editContext}/${id}`;
      router.push(editUrl);
    }
  };
  return (
    <div className="flex justify-start space-x-2 rtl:space-x-reverse">
      {actions.map((action, index) =>
        action.href ? (
          <Link
            key={index}
            href={action.href}
            className={`${action.className || ""}`}
          >
            {action.icon}
            {action.label}
          </Link>
        ) : (
          <Button
            key={index}
            onClick={action.onClick}
            color="secondary"
            size="sm"
            variant="outline"
            className={` ${action.className || ""}`}
          >
            {action.icon}
            {action.label}
          </Button>
        ),
      )}

      {editContext && (
        <Button onClick={() => handleEdit()} variant="default" size="sm">
          <Pencil className="w-4 h-4" />
          {t("edit")}
        </Button>
      )}

      {onDelete && (
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={handleDelete}
            loading={loading}
          />
          <Button onClick={() => setOpen(true)} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4" />
            {t("delete")}
          </Button>
        </>
      )}
    </div>
  );
};
