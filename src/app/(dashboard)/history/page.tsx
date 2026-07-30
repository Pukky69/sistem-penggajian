import { requireAdmin } from "@/lib/session";
import { getPayrollHistoryLogs } from "@/services/history.service";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Calendar, CheckCircle2, Clock } from "lucide-react";

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

export default async function HistoryPage() {
  await requireAdmin();

  const logs = await getPayrollHistoryLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Audit Penggajian</h1>
        <p className="text-muted-foreground">
          Log jejak audit pemrosesan dan penerbitan gaji karyawan per periode.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode Penggajian</TableHead>
              <TableHead>Jumlah Transaksi</TableHead>
              <TableHead>Total Take Home Pay</TableHead>
              <TableHead>Status Draf</TableHead>
              <TableHead>Pembaruan Terakhir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-muted-foreground"
                >
                  Belum ada riwayat pemrosesan gaji tercatat.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={`${log.tahun}-${log.bulan}-${log.status}-${index}`}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>
                        {NAMA_BULAN[log.bulan]} {log.tahun}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{log._count.id} karyawan</TableCell>
                  <TableCell className="font-mono font-bold text-primary">
                    {formatRupiah(Number(log._sum.takeHomePay ?? 0))}
                  </TableCell>
                  <TableCell>
                    {log.status === "SELESAI" ? (
                      <Badge className="bg-emerald-600 flex items-center gap-1 w-max">
                        <CheckCircle2 className="size-3" /> SELESAI
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 w-max">
                        <Clock className="size-3" /> {log.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log._max.updatedAt
                      ? new Date(log._max.updatedAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}