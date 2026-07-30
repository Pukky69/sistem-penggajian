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
import { createGradeAction, updateGradeAction } from "@/actions/grade.action";

type Grade = {
  id: number;
  nama: string;
  gajiPokok: number | string | any;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade?: Grade | null;
};

export function GradeDialog({ open, onOpenChange, grade }: Props) {
  const [nama, setNama] = useState("");
  const [gajiPokok, setGajiPokok] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!grade;

  useEffect(() => {
    if (grade) {
      setNama(grade.nama);
      setGajiPokok(String(grade.gajiPokok));
    } else {
      setNama("");
      setGajiPokok("");
    }
  }, [grade, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama golongan wajib diisi");
      return;
    }

    const numGaji = Number(gajiPokok);
    if (isNaN(numGaji) || numGaji < 0) {
      toast.error("Gaji pokok harus berupa angka valid");
      return;
    }

    setIsLoading(true);

    try {
      const res = isEdit
        ? await updateGradeAction(grade.id, { nama, gajiPokok: numGaji })
        : await createGradeAction({ nama, gajiPokok: numGaji });

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
            {isEdit ? "Edit Golongan" : "Tambah Golongan Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Golongan</Label>
            <Input
              id="nama"
              placeholder="Contoh: Golongan III-A, Grade 1"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gajiPokok">Gaji Pokok (Rp)</Label>
            <Input
              id="gajiPokok"
              type="number"
              placeholder="Contoh: 5000000"
              value={gajiPokok}
              onChange={(e) => setGajiPokok(e.target.value)}
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