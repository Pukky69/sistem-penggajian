import { prisma } from "@/lib/prisma";
import { PayrollStatus } from "@prisma/client";

export type GetPayrollsParams = {
  bulan?: number;
  tahun?: number;
  status?: PayrollStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export async function getPayrolls(params?: GetPayrollsParams) {
  const {
    bulan,
    tahun,
    status,
    search,
    page = 1,
    limit = 10,
  } = params || {};

  const where: any = {};

  if (bulan) where.bulan = bulan;
  if (tahun) where.tahun = tahun;
  if (status) where.status = status;

  if (search) {
    where.employee = {
      OR: [
        { nama: { contains: search } },
        { nik: { contains: search } },
      ],
    };
  }

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.payroll.count({ where }),
    prisma.payroll.findMany({
      where,
      skip,
      take: limit,
      include: {
        employee: {
          include: {
            position: true,
            grade: true,
          },
        },
      },
      orderBy: [
        { tahun: "desc" },
        { bulan: "desc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getPayrollById(id: number) {
  return prisma.payroll.findUnique({
    where: { id },
    include: {
      employee: {
        include: {
          position: true,
          grade: true,
        },
      },
      details: {
        include: {
          earning: true,
          deduction: true,
        },
      },
    },
  });
}

export async function generateMonthlyPayroll(bulan: number, tahun: number) {
  // 1. Ambil semua karyawan AKTIF beserta Grade & Position
  const activeEmployees = await prisma.employee.findMany({
    where: { status: "AKTIF" },
    include: {
      grade: true,
      position: true,
    },
  });

  if (activeEmployees.length === 0) {
    throw new Error("Tidak ada karyawan aktif untuk diproses penggajiannya.");
  }

  // 2. Ambil semua Tunjangan & Potongan yang AKTIF
  const [activeEarnings, activeDeductions] = await Promise.all([
    prisma.earning.findMany({ where: { isActive: true } }),
    prisma.deduction.findMany({ where: { isActive: true } }),
  ]);

  let createdCount = 0;
  let skippedCount = 0;

  // 3. Iterasi tiap karyawan
  for (const emp of activeEmployees) {
    // Cek apakah draf/penggajian karyawan di bulan & tahun ini sudah ada
    const existing = await prisma.payroll.findUnique({
      where: {
        employeeId_bulan_tahun: {
          employeeId: emp.id,
          bulan,
          tahun,
        },
      },
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    // Gaji pokok dari Grade
    const gajiPokok = Number(emp.grade.gajiPokok);

    // Hitung total tunjangan
    let totalTunjangan = 0;
    const detailRecords: Array<{ earningId?: number; deductionId?: number; jumlah: number }> = [];

    for (const earn of activeEarnings) {
      const nilai = Number(earn.nilai);
      totalTunjangan += nilai;
      detailRecords.push({
        earningId: earn.id,
        jumlah: nilai,
      });
    }

    // Hitung total potongan
    let totalPotongan = 0;
    let bpjs = 0;
    let pph21 = 0;
    let potonganLain = 0;

    for (const ded of activeDeductions) {
      let nominalPotongan = 0;

      if (ded.tipe === "PERSENTASE") {
        nominalPotongan = (gajiPokok * Number(ded.nilai)) / 100;
      } else {
        nominalPotongan = Number(ded.nilai);
      }

      totalPotongan += nominalPotongan;

      // Kategori potongan untuk summary
      const lowerName = ded.nama.toLowerCase();
      if (lowerName.includes("bpjs")) {
        bpjs += nominalPotongan;
      } else if (lowerName.includes("pph") || lowerName.includes("pajak")) {
        pph21 += nominalPotongan;
      } else {
        potonganLain += nominalPotongan;
      }

      detailRecords.push({
        deductionId: ded.id,
        jumlah: nominalPotongan,
      });
    }

    const totalBonus = 0;
    const totalLembur = 0;

    // Kalkulasi Take Home Pay
    const takeHomePay = gajiPokok + totalTunjangan + totalBonus + totalLembur - totalPotongan;

    // Simpan ke database dengan transaksi
    await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        bulan,
        tahun,
        gajiPokok,
        totalTunjangan,
        totalBonus,
        totalLembur,
        bpjs,
        pph21,
        potonganLain,
        takeHomePay,
        status: "DRAFT",
        details: {
          createMany: {
            data: detailRecords,
          },
        },
      },
    });

    createdCount++;
  }

  return {
    createdCount,
    skippedCount,
    totalProcessed: activeEmployees.length,
  };
}

export async function updatePayrollStatus(id: number, status: PayrollStatus) {
  return prisma.payroll.update({
    where: { id },
    data: { status },
  });
}

export async function deletePayroll(id: number) {
  return prisma.payroll.delete({
    where: { id },
  });
}