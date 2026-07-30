"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmployeePaginationProps = {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function EmployeePagination({ meta }: EmployeePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, totalPages, total, limit } = meta;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("page", String(newPage));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-medium text-foreground">{startItem}</span> -{" "}
        <span className="font-medium text-foreground">{endItem}</span> dari{" "}
        <span className="font-medium text-foreground">{total}</span> karyawan
      </p>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1 || isPending}
        >
          <ChevronLeft className="mr-1 size-4" />
          Sebelumnya
        </Button>

        <span className="text-sm font-medium px-2">
          Halaman {page} dari {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || isPending}
        >
          Selanjutnya
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}