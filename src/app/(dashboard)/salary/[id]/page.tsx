import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Printer, Building2 } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { getEmployeeSalaryDetail } from "@/services/employee-portal.service";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  params: Promise<{ id: string }>;
};

export default async function EmployeeSalaryDetailPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user || !user.employeeId) {
    redirect("/salary");
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) notFound();

  // Memastikan karyawan hanya bisa lihat slip miliknya dan bertipe SELESAI
  const payroll = await getEmployeeSalaryDetail(id, user.employeeId);
  if (!payroll) notFound();

  const earnings = payroll.details.filter((d) => d.earningId !== null);
  const deductions = payroll.details.filter((d) => d.deductionId !== null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/salary">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Kembali ke Slip Gaji Saya
          </Button>
        </Link>

        <Button onClick={() => window.print()} variant="outline" size="sm">
          <Printer className="mr-2 size-4" />
          Cetak Slip Gaji
        </Button>
      </div>

      {/* Card Slip Gaji */}
      <div className="rounded-lg border bg-card p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Kop Perusahaan */}
        <div className="flex items-start justify-between border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Building2 className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">PT. PERUSAHAAN INDONESIA</h2>
              <p className="text-xs text-muted-foreground">
                Jl. Raya Utama No. 123, Jakarta Selatan • info@perusahaan.co.id
              </p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-lg font-bold tracking-tight">SLIP GAJI KARYAWAN</h3>
            <p className="text-sm font-medium text-muted-foreground">
              PERIODE: {NAMA_BULAN[payroll.bulan]} {payroll.tahun}
            </p>
            <Badge className="mt-1 bg-emerald-600">DIBAYARKAN</Badge>
          </div>
        </div>

        {/* Informasi Karyawan */}
        <div className="grid grid-cols-2 gap-4 py-6 text-sm">
          <div className="space-y-1">
            <p>
              <span className="text-muted-foreground">NIK:</span>{" "}
              <span className="font-semibold">{payroll.employee.nik}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Nama Karyawan:</span>{" "}
              <span className="font-semibold">{payroll.employee.nama}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span>{payroll.employee.email}</span>
            </p>
          </div>
          <div className="space-y-1 text-right sm:text-left">
            <p>
              <span className="text-muted-foreground">Jabatan:</span>{" "}
              <span className="font-semibold">
                {payroll.employee.position.nama}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Golongan:</span>{" "}
              <span className="font-semibold">
                {payroll.employee.grade.nama}
              </span>
            </p>
          </div>
        </div>

        <Separator />

        {/* Breakdown Gaji & Tunjangan vs Potongan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Sisi Kiri: Pendapatan */}
          <div className="space-y-3">
            <h4 className="font-bold border-b pb-2 text-emerald-600">
              PENDAPATAN (EARNINGS)
            </h4>
            <div className="flex justify-between text-sm py-1">
              <span>Gaji Pokok</span>
              <span className="font-mono font-semibold">
                {formatRupiah(Number(payroll.gajiPokok))}
              </span>
            </div>

            {earnings.map((e) => (
              <div key={e.id} className="flex justify-between text-sm py-1">
                <span>{e.earning?.nama ?? "Tunjangan"}</span>
                <span className="font-mono font-semibold text-emerald-600">
                  +{formatRupiah(Number(e.jumlah))}
                </span>
              </div>
            ))}

            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-sm">
              <span>Total Pendapatan Gross</span>
              <span className="font-mono">
                {formatRupiah(
                  Number(payroll.gajiPokok) + Number(payroll.totalTunjangan)
                )}
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Potongan */}
          <div className="space-y-3">
            <h4 className="font-bold border-b pb-2 text-rose-600">
              POTONGAN (DEDUCTIONS)
            </h4>
            {deductions.map((d) => (
              <div key={d.id} className="flex justify-between text-sm py-1">
                <span>{d.deduction?.nama ?? "Potongan"}</span>
                <span className="font-mono font-semibold text-rose-600">
                  -{formatRupiah(Number(d.jumlah))}
                </span>
              </div>
            ))}

            {deductions.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-2">
                Tidak ada potongan gaji.
              </p>
            )}

            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-sm">
              <span>Total Potongan</span>
              <span className="font-mono text-rose-600">
                -
                {formatRupiah(
                  Number(payroll.bpjs) +
                    Number(payroll.pph21) +
                    Number(payroll.potonganLain)
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Take Home Pay Box */}
        <div className="rounded-lg bg-muted p-4 flex items-center justify-between mt-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              TOTAL GAJI BERSIH (TAKE HOME PAY)
            </p>
            <p className="text-2xl font-bold text-foreground font-mono">
              {formatRupiah(Number(payroll.takeHomePay))}
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-right hidden sm:block">
            Transfer via Bank Mandiri / BCA
          </p>
        </div>
      </div>
    </div>
  );
}