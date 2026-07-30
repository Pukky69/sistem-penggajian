import { prisma } from "@/lib/prisma";

export async function getEmployeeSalaryHistory(employeeId: number) {
  return prisma.payroll.findMany({
    where: {
      employeeId,
      status: "SELESAI", // Karyawan HANYA bisa melihat slip gaji yang sudah SELESAI/Published
    },
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
    ],
  });
}

export async function getEmployeeSalaryDetail(payrollId: number, employeeId: number) {
  const payroll = await prisma.payroll.findFirst({
    where: {
      id: payrollId,
      employeeId, // Proteksi: Karyawan HANYA bisa mengakses slip gaji miliknya sendiri
      status: "SELESAI",
    },
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

  return payroll;
}

export async function getEmployeeProfile(employeeId: number) {
  return prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      position: true,
      grade: true,
      user: {
        select: {
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });
}