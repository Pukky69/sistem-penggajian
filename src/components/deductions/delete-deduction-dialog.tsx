"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteDeductionAction } from "@/actions/deduction.action";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deduction: {
    id: number;
    nama: string;
  } | null;
};

export function DeleteDeductionDialog({ open, onOpenChange, deduction }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!deduction) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await deleteDeductionAction(deduction.id);

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Potongan?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus potongan{" "}
            <span className="font-semibold text-foreground">
              "{deduction.nama}"
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}