"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createPositionAction,
  updatePositionAction,
} from "@/actions/position.action";

type Position = {
  id: number;
  nama: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: Position | null;
};

export function PositionDialog({ open, onOpenChange, position }: Props) {
  const [nama, setNama] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!position;

  useEffect(() => {
    if (position) {
      setNama(position.nama);
    } else {
      setNama("");
    }
  }, [position, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama jabatan wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = isEdit
        ? await updatePositionAction(position.id, { nama })
        : await createPositionAction({ nama });

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Jabatan" : "Tambah Jabatan Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Jabatan</Label>
            <Input
              id="nama"
              placeholder="Contoh: Software Engineer, HR Specialist"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}