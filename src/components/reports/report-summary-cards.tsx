import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { Wallet, Users, TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  summary: {
    totalEmployees: number;
    totalGajiPokok: number;
    totalTunjangan: number;
    totalPotongan: number;
    totalTakeHomePay: number;
  };
};

export function ReportSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Pengeluaran THP */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Take Home Pay
          </CardTitle>
          <Wallet className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-primary">
            {formatRupiah(summary.totalTakeHomePay)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total gaji bersih dibayarkan
          </p>
        </CardContent>
      </Card>

      {/* Total Karyawan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Karyawan
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalEmployees} orang</div>
          <p className="text-xs text-muted-foreground mt-1">
            Karyawan diproses pada periode ini
          </p>
        </CardContent>
      </Card>

      {/* Total Tunjangan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Tunjangan
          </CardTitle>
          <TrendingUp className="size-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            +{formatRupiah(summary.totalTunjangan)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gaji Pokok: {formatRupiah(summary.totalGajiPokok)}
          </p>
        </CardContent>
      </Card>

      {/* Total Potongan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Potongan
          </CardTitle>
          <TrendingDown className="size-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-rose-600">
            -{formatRupiah(summary.totalPotongan)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Termasuk BPJS & PPh21
          </p>
        </CardContent>
      </Card>
    </div>
  );
}