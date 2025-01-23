"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  modalTitle?: string;
  modalDescription?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  modalTitle,
  modalDescription,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader className="pt-5 space-y-2">
          <DialogTitle className="text-start">{modalTitle}</DialogTitle>
          <DialogDescription className="text-start">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
