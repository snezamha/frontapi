"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import AlertModal from "../modal/alert-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
      router.refresh();
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : t("deleteFailed");
      toast({
        variant: "destructive",
        description: errMessage,
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  const handleEdit = () => {
    if (editContext) {
      const editUrl = `${basePath}/${editContext}/${id}`;
      router.push(editUrl);
      router.refresh();
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {editContext && (
            <DropdownMenuItem onClick={() => handleEdit()}>
              <Pencil className="w-4 h-4" />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setDropdownOpen(false);
                setOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
              {t("delete")}
            </DropdownMenuItem>
          )}
          {actions.map((action, index) => (
            <div key={`action-${index}`}>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={action.onClick}
                className={` ${action.className || ""}`}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
