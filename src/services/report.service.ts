import { prisma } from "@/lib/prisma";

export type ReportFilterParams = {
  bulan?: number;
  tahun?: number;
};

export async function getPayrollReport(params?: ReportFilterParams) {
  const bulan = params?.bulan ?? new Date().getMonth() + 1;
  const tahun = params?.tahun ?? new Date().getFullYear();

  // 1. Ambil semua payroll bertipe SELESAI atau DIPROSES pada periode tsb
  const payrolls = await prisma.payroll.findMany({
    where: {
      bulan,
      tahun,
      status: {
        in: ["DIPROSES", "SELESAI"],
      },
    },
    include: {
      employee: {
        include: {
          position: true,
          grade: true,
        },
      },
    },
    orderBy: {
      employee: {
        nama: "asc",
      },
    },
  });

  // 2. Hitung Total Agregat
  const totalEmployees = payrolls.length;
  let totalGajiPokok = 0;
  let totalTunjangan = 0;
  let totalBpjs = 0;
  let totalPph21 = 0;
  let totalPotonganLain = 0;
  let totalTakeHomePay = 0;

  for (const p of payrolls) {
    totalGajiPokok += Number(p.gajiPokok);
    totalTunjangan += Number(p.totalTunjangan);
    totalBpjs += Number(p.bpjs);
    totalPph21 += Number(p.pph21);
    totalPotonganLain += Number(p.potonganLain);
    totalTakeHomePay += Number(p.takeHomePay);
  }

  const totalPotongan = totalBpjs + totalPph21 + totalPotonganLain;

  // 3. Rekapitulasi Alokasi per Jabatan
  const positionSummaryMap = new Map<string, { count: number; totalThp: number }>();

  for (const p of payrolls) {
    const posName = p.employee.position.nama;
    const current = positionSummaryMap.get(posName) || { count: 0, totalThp: 0 };
    positionSummaryMap.set(posName, {
      count: current.count + 1,
      totalThp: current.totalThp + Number(p.takeHomePay),
    });
  }

  const positionBreakdown = Array.from(positionSummaryMap.entries()).map(
    ([positionName, data]) => ({
      positionName,
      count: data.count,
      totalThp: data.totalThp,
    })
  );

  return {
    periode: { bulan, tahun },
    summary: {
      totalEmployees,
      totalGajiPokok,
      totalTunjangan,
      totalBpjs,
      totalPph21,
      totalPotonganLain,
      totalPotongan,
      totalTakeHomePay,
    },
    payrolls,
    positionBreakdown,
  };
}