"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Modal from ".";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations("alertModal");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const handleConfirm = async () => {
    if (!onConfirm) {
      return;
    }
    onConfirm();
  };
  return (
    <Modal
      modalTitle={t("areYouSure")}
      modalDescription={t("thisActionCannotBeUndone")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 rtl:space-x-reverse flex items-center justify-end w-full ">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          className={isPending ? "pointer-events-none" : ""}
          disabled={loading}
          variant={"destructive"}
          onClick={() =>
            startTransition(() => {
              handleConfirm();
            })
          }
        >
          {isPending ? "" : t("continue")}
          {isPending && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
