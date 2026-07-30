"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calculator } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePayrollAction } from "@/actions/payroll.action";

const BULAN_LIST = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const currentYear = new Date().getFullYear();
const TAHUN_LIST = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GeneratePayrollDialog({ open, onOpenChange }: Props) {
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState<number>(currentYear);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      const res = await generatePayrollAction({ bulan, tahun });

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat memproses penggajian");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            Generate Penggajian Bulanan
          </DialogTitle>
          <DialogDescription>
            Sistem akan secara otomatis menghitung Gaji Pokok, Tunjangan, dan Potongan untuk seluruh karyawan aktif.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Pilih Bulan</Label>
            <Select
              value={String(bulan)}
              onValueChange={(val) => setBulan(Number(val))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {BULAN_LIST.map((b) => (
                  <SelectItem key={b.value} value={String(b.value)}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pilih Tahun</Label>
            <Select
              value={String(tahun)}
              onValueChange={(val) => setTahun(Number(val))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_LIST.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Prosesing..." : "Jalankan Kalkulasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}