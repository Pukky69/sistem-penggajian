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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDeductionAction,
  updateDeductionAction,
} from "@/actions/deduction.action";

type Deduction = {
  id: number;
  nama: string;
  tipe: string;
  nilai: number | string | any;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deduction?: Deduction | null;
};

export function DeductionDialog({ open, onOpenChange, deduction }: Props) {
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("TETAP");
  const [nilai, setNilai] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!deduction;

  useEffect(() => {
    if (deduction) {
      setNama(deduction.nama);
      setTipe(deduction.tipe);
      setNilai(String(deduction.nilai));
    } else {
      setNama("");
      setTipe("TETAP");
      setNilai("");
    }
  }, [deduction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama potongan wajib diisi");
      return;
    }

    const numNilai = Number(nilai);
    if (isNaN(numNilai) || numNilai < 0) {
      toast.error("Nilai potongan harus berupa angka valid");
      return;
    }

    setIsLoading(true);

    try {
      const res = isEdit
        ? await updateDeductionAction(deduction.id, {
            nama,
            tipe,
            nilai: numNilai,
          })
        : await createDeductionAction({
            nama,
            tipe,
            nilai: numNilai,
          });

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
            {isEdit ? "Edit Potongan" : "Tambah Potongan Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Potongan</Label>
            <Input
              id="nama"
              placeholder="Contoh: BPJS Kesehatan, Kasbon, PPh21"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipe">Tipe Potongan</Label>
            <Select
              value={tipe}
              onValueChange={(val) => setTipe(val ?? "TETAP")}
              disabled={isLoading}
            >
              <SelectTrigger id="tipe">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TETAP">TETAP (Nominal Rp)</SelectItem>
                <SelectItem value="PERSENTASE">PERSENTASE (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nilai">
              {tipe === "PERSENTASE" ? "Nilai Persentase (%)" : "Nilai Nominal (Rp)"}
            </Label>
            <Input
              id="nilai"
              type="number"
              placeholder={tipe === "PERSENTASE" ? "Contoh: 1 (artinya 1%)" : "Contoh: 100000"}
              value={nilai}
              onChange={(e) => setNilai(e.target.value)}
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