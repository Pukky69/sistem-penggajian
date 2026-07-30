import { requireAdmin } from "@/lib/session";
import { getPayrollReport } from "@/services/report.service";
import { ReportFilter } from "@/components/reports/report-filter";
import { ReportSummaryCards } from "@/components/reports/report-summary-cards";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";

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

type Props = {
  searchParams: Promise<{
    bulan?: string;
    tahun?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: Props) {
  await requireAdmin();

  const resolvedParams = await searchParams;
  const bulan = resolvedParams.bulan ? Number(resolvedParams.bulan) : new Date().getMonth() + 1;
  const tahun = resolvedParams.tahun ? Number(resolvedParams.tahun) : new Date().getFullYear();

  const report = await getPayrollReport({ bulan, tahun });

  return (
    <div className="space-y-6">
      {/* Header Print Only */}
      <div className="hidden print:flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">PT. PERUSAHAAN INDONESIA</h1>
            <p className="text-xs text-muted-foreground">
              LAPORAN REKAPITULASI PENGGAJIAN KARYAWAN
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">
            PERIODE: {NAMA_BULAN[bulan]} {tahun}
          </p>
        </div>
      </div>

      {/* Title & Toolbar */}
      <div className="flex flex-col gap-1 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Laporan & Rekapitulasi</h1>
        <p className="text-muted-foreground">
          Ringkasan eksekutif dan rincian alokasi biaya penggajian bulanan.
        </p>
      </div>

      <ReportFilter />

      <ReportSummaryCards summary={report.summary} />

      {/* Tabel Detail Penggajian Karyawan */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Rincian Penggajian Karyawan — {NAMA_BULAN[bulan]} {tahun}
        </h2>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>NIK & Nama Karyawan</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead className="text-right">Gaji Pokok</TableHead>
                <TableHead className="text-right">Tunjangan</TableHead>
                <TableHead className="text-right">Potongan</TableHead>
                <TableHead className="text-right">Take Home Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.payrolls.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-muted-foreground"
                  >
                    Belum ada transaksi gaji diproses/selesai pada periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                report.payrolls.map((p, idx) => {
                  const totalPotongan =
                    Number(p.bpjs) + Number(p.pph21) + Number(p.potonganLain);

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>
                        <p className="font-semibold">{p.employee.nama}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.employee.nik}
                        </p>
                      </TableCell>
                      <TableCell>{p.employee.position.nama}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatRupiah(Number(p.gajiPokok))}
                      </TableCell>
                      <TableCell className="text-right font-mono text-emerald-600">
                        +{formatRupiah(Number(p.totalTunjangan))}
                      </TableCell>
                      <TableCell className="text-right font-mono text-rose-600">
                        -{formatRupiah(totalPotongan)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {formatRupiah(Number(p.takeHomePay))}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}