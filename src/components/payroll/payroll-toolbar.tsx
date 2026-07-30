"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeneratePayrollDialog } from "@/components/payroll/generate-payroll-dialog";

const BULAN_LIST = [
  { value: "ALL", label: "Semua Bulan" },
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

export function PayrollToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const bulan = searchParams.get("bulan") ?? "ALL";
  const tahun = searchParams.get("tahun") ?? String(currentYear);
  const status = searchParams.get("status") ?? "ALL";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");

    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const isFiltered =
    !!search || bulan !== "ALL" || status !== "ALL" || tahun !== String(currentYear);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Input Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari karyawan / NIK..."
              className="pl-8"
              defaultValue={search}
              onChange={(e) => updateParams("search", e.target.value)}
            />
          </div>

          {/* Filter Bulan */}
          <Select
            value={bulan}
            onValueChange={(val) => updateParams("bulan", val ?? "ALL")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent>
              {BULAN_LIST.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Tahun */}
          <Select
            value={tahun}
            onValueChange={(val) => updateParams("tahun", val ?? String(currentYear))}
          >
            <SelectTrigger className="w-[120px]">
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

          {/* Filter Status */}
          <Select
            value={status}
            onValueChange={(val) => updateParams("status", val ?? "ALL")}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
              <SelectItem value="DIPROSES">DIPROSES</SelectItem>
              <SelectItem value="SELESAI">SELESAI</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
            >
              Reset
              <X className="ml-2 size-4" />
            </Button>
          )}
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Process Gaji Baru
        </Button>
      </div>

      <GeneratePayrollDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}