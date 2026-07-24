import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EmployeeToolbar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Cari nama, NIK, atau email..."
          className="pl-9"
        />
      </div>

      <Button>
        <Plus className="mr-2 size-4" />
        Tambah Karyawan
      </Button>
    </div>
  );
}