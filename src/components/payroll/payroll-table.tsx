"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { PayrollStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";
import {
  deletePayrollAction,
  updatePayrollStatusAction,
} from "@/actions/payroll.action";

const NAMA_BULAN = [
  "",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type PayrollItem = {
  id: number;
  bulan: number;
  tahun: number;
  gajiPokok: any;
  totalTunjangan: any;
  bpjs: any;
  pph21: any;
  potonganLain: any;
  takeHomePay: any;
  status: PayrollStatus;
  employee: {
    nama: string;
    nik: string;
    position: { nama: string };
    grade: { nama: string };
  };
};

type Props = {
  payrolls: PayrollItem[];
};

export function PayrollTable({ payrolls }: Props) {
  const handleStatusChange = async (id: number, newStatus: PayrollStatus) => {
    try {
      const res = await updatePayrollStatusAction(id, newStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Gagal memperbarui status penggajian");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus draf penggajian ini?")) return;

    try {
      const res = await deletePayrollAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Gagal menghapus draf penggajian");
    }
  };

  const getStatusBadge = (status: PayrollStatus) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">DRAFT</Badge>;
      case "DIPROSES":
        return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">DIPROSES</Badge>;
      case "SELESAI":
        return <Badge variant="default" className="bg-emerald-600">SELESAI</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Karyawan</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Gaji Pokok</TableHead>
            <TableHead>Tunjangan</TableHead>
            <TableHead>Take Home Pay</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[140px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-28 text-center text-muted-foreground"
              >
                Belum ada data penggajian untuk periode/filter ini.
              </TableCell>
            </TableRow>
          ) : (
            payrolls.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold">{p.employee.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.employee.nik} • {p.employee.position.nama}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {NAMA_BULAN[p.bulan]} {p.tahun}
                </TableCell>
                <TableCell className="font-mono">
                  {formatRupiah(Number(p.gajiPokok))}
                </TableCell>
                <TableCell className="font-mono text-emerald-600">
                  +{formatRupiah(Number(p.totalTunjangan))}
                </TableCell>
                <TableCell className="font-mono font-bold text-foreground">
                  {formatRupiah(Number(p.takeHomePay))}
                </TableCell>
                <TableCell>
                  <Select
                    value={p.status}
                    onValueChange={(val) =>
                      handleStatusChange(p.id, val as PayrollStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[110px] text-xs">
                      <SelectValue>{getStatusBadge(p.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">DRAFT</SelectItem>
                      <SelectItem value="DIPROSES">DIPROSES</SelectItem>
                      <SelectItem value="SELESAI">SELESAI</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
  <div className="flex items-center justify-end gap-1">
    <Link href={`/payroll/${p.id}`}>
      <Button variant="ghost" size="icon" title="Lihat Slip Gaji">
        <Eye className="size-4 text-muted-foreground hover:text-foreground" />
      </Button>
    </Link>
    {p.status === "DRAFT" && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(p.id)}
        title="Hapus Draf"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    )}
  </div>
</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}