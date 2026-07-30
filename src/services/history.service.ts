import { prisma } from "@/lib/prisma";

export async function getPayrollHistoryLogs() {
  // Mengambil agregasi riwayat penggajian yang dikelompokkan berdasarkan Bulan & Tahun
  const groupLogs = await prisma.payroll.groupBy({
    by: ["bulan", "tahun", "status"],
    _count: {
      id: true,
    },
    _sum: {
      takeHomePay: true,
      gajiPokok: true,
      totalTunjangan: true,
    },
    _max: {
      updatedAt: true,
    },
    orderBy: [
      { tahun: "desc" },
      { bulan: "desc" },
    ],
  });

  return groupLogs;
}