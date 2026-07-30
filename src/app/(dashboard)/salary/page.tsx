import Link from "next/link";
import { Eye, FileText, Calendar, Wallet } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { getEmployeeSalaryHistory } from "@/services/employee-portal.service";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default async function EmployeeSalaryPage() {
  const user = await getCurrentUser();

  if (!user || !user.employeeId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-lg border">
        <FileText className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Data Karyawan Tidak Ditemukan</h2>
        <p className="text-muted-foreground mt-1 max-w-md">
          Akun Anda belum terhubung dengan data karyawan. Silakan hubungi tim HR/Administrator.
        </p>
      </div>
    );
  }

  const history = await getEmployeeSalaryHistory(user.employeeId);

  // Ambil gaji bulan terbaru jika ada
  const latestSalary = history[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Slip Gaji Saya</h1>
        <p className="text-muted-foreground">
          Lihat riwayat penggajian bulanan dan unduh slip gaji resmi Anda.
        </p>
      </div>

      {/* Summary Card Gaji Terakhir */}
      {latestSalary && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="size-4 text-primary" />
              Gaji Diterima Bulan Terakhir ({NAMA_BULAN[latestSalary.bulan]} {latestSalary.tahun})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-3xl font-bold font-mono text-primary">
                  {formatRupiah(Number(latestSalary.takeHomePay))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: Dibayarkan via Transfer Bank
                </p>
              </div>

              <Link href={`/salary/${latestSalary.id}`}>
                <Button>
                  <Eye className="mr-2 size-4" />
                  Lihat Detail Slip
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabel Riwayat Penggajian */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode</TableHead>
              <TableHead>Gaji Pokok</TableHead>
              <TableHead>Total Tunjangan</TableHead>
              <TableHead>Total Potongan</TableHead>
              <TableHead>Take Home Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  Belum ada riwayat slip gaji yang diterbitkan.
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => {
                const totalPotongan =
                  Number(item.bpjs) +
                  Number(item.pph21) +
                  Number(item.potonganLain);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span>
                          {NAMA_BULAN[item.bulan]} {item.tahun}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatRupiah(Number(item.gajiPokok))}
                    </TableCell>
                    <TableCell className="font-mono text-emerald-600">
                      +{formatRupiah(Number(item.totalTunjangan))}
                    </TableCell>
                    <TableCell className="font-mono text-rose-600">
                      -{formatRupiah(totalPotongan)}
                    </TableCell>
                    <TableCell className="font-mono font-bold">
                      {formatRupiah(Number(item.takeHomePay))}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-600">DIBAYARKAN</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/salary/${item.id}`}>
                        <Button variant="ghost" size="icon" title="Lihat Slip Gaji">
                          <Eye className="size-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}