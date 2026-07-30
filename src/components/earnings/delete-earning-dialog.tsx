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
import { deleteEarningAction } from "@/actions/earning.action";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  earning: {
    id: number;
    nama: string;
  } | null;
};

export function DeleteEarningDialog({ open, onOpenChange, earning }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!earning) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await deleteEarningAction(earning.id);

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
          <AlertDialogTitle>Hapus Tunjangan?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus tunjangan{" "}
            <span className="font-semibold text-foreground">
              "{earning.nama}"
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