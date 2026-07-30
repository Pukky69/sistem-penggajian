"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  id: number;
  nama: string;
};

type EmployeeToolbarProps = {
  positions: Option[];
  grades: Option[];
};

export function EmployeeToolbar({
  positions,
  grades,
}: EmployeeToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const positionId = searchParams.get("positionId") ?? "ALL";
  const gradeId = searchParams.get("gradeId") ?? "ALL";
  const status = searchParams.get("status") ?? "ALL";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");

    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

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
    !!search || positionId !== "ALL" || gradeId !== "ALL" || status !== "ALL";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Input Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIK, email..."
            className="pl-8"
            defaultValue={search}
            onChange={(e) => updateParams("search", e.target.value)}
          />
        </div>

        {/* Filter Jabatan */}
        <Select
          value={positionId}
          onValueChange={(val) => updateParams("positionId", val ?? "")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Jabatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Jabatan</SelectItem>
            {positions.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Golongan */}
        <Select
          value={gradeId}
          onValueChange={(val) => updateParams("gradeId", val ?? "")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Golongan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Golongan</SelectItem>
            {grades.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Status */}
        <Select
          value={status}
          onValueChange={(val) => updateParams("status", val ?? "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="AKTIF">AKTIF</SelectItem>
            <SelectItem value="NONAKTIF">NONAKTIF</SelectItem>
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
    </div>
  );
}