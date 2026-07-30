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
  createEarningAction,
  updateEarningAction,
} from "@/actions/earning.action";

type Earning = {
  id: number;
  nama: string;
  tipe: string;
  nilai: number | string | any;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  earning?: Earning | null;
};

export function EarningDialog({ open, onOpenChange, earning }: Props) {
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("TETAP");
  const [nilai, setNilai] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!earning;

  useEffect(() => {
    if (earning) {
      setNama(earning.nama);
      setTipe(earning.tipe);
      setNilai(String(earning.nilai));
    } else {
      setNama("");
      setTipe("TETAP");
      setNilai("");
    }
  }, [earning, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama tunjangan wajib diisi");
      return;
    }

    const numNilai = Number(nilai);
    if (isNaN(numNilai) || numNilai < 0) {
      toast.error("Nilai tunjangan harus berupa angka valid");
      return;
    }

    setIsLoading(true);

    try {
      const res = isEdit
        ? await updateEarningAction(earning.id, {
            nama,
            tipe,
            nilai: numNilai,
          })
        : await createEarningAction({
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
            {isEdit ? "Edit Tunjangan" : "Tambah Tunjangan Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Tunjangan</Label>
            <Input
              id="nama"
              placeholder="Contoh: Tunjangan Makan, Tunjangan Transport"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipe">Tipe Tunjangan</Label>
            <Select
              value={tipe}
              onValueChange={(val) => setTipe(val ?? "TETAP")}
              disabled={isLoading}
            >
              <SelectTrigger id="tipe">
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TETAP">TETAP (Bulanan)</SelectItem>
                <SelectItem value="VARIABEL">VARIABEL (Kehadiran/Kinerja)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nilai">Nilai Nominal (Rp)</Label>
            <Input
              id="nilai"
              type="number"
              placeholder="Contoh: 500000"
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