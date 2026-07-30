"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Printer, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BULAN_LIST = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();

export function ReportFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const bulan = searchParams.get("bulan") ?? String(new Date().getMonth() + 1);
  const tahun = searchParams.get("tahun") ?? String(currentYear);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set(key, value);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Periode Laporan:</span>

        <Select value={bulan} onValueChange={(val) => updateFilter("bulan", val ?? "")}>
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="Pilih Bulan" />
  </SelectTrigger>
  <SelectContent>
    {BULAN_LIST.map((b) => (
      <SelectItem key={b.value} value={b.value}>
        {b.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        <Select value={tahun} onValueChange={(val) => updateFilter("tahun", val ?? "")}>
  <SelectTrigger className="w-[110px]">
    <SelectValue placeholder="Tahun" />
  </SelectTrigger>
  <SelectContent>
    {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((t) => (
      <SelectItem key={t} value={String(t)}>
        {t}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
      </div>

      <Button onClick={() => window.print()} variant="outline">
        <Printer className="mr-2 size-4" />
        Cetak Laporan PDF
      </Button>
    </div>
  );
}