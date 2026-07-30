import { prisma } from "@/lib/prisma";

export type DeductionInput = {
  nama: string;
  tipe: string;
  nilai: number;
  isActive?: boolean;
};

export async function getDeductions() {
  return prisma.deduction.findMany({
    orderBy: {
      nama: "asc",
    },
  });
}

export async function getDeductionById(id: number) {
  return prisma.deduction.findUnique({
    where: { id },
  });
}

export async function createDeduction(data: DeductionInput) {
  return prisma.deduction.create({
    data: {
      nama: data.nama,
      tipe: data.tipe,
      nilai: data.nilai,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateDeduction(id: number, data: DeductionInput) {
  return prisma.deduction.update({
    where: { id },
    data: {
      nama: data.nama,
      tipe: data.tipe,
      nilai: data.nilai,
    },
  });
}

export async function toggleDeductionStatus(id: number, isActive: boolean) {
  return prisma.deduction.update({
    where: { id },
    data: { isActive },
  });
}

export async function deleteDeduction(id: number) {
  const deduction = await prisma.deduction.findUnique({
    where: { id },
    include: {
      _count: {
        select: { details: true },
      },
    },
  });

  if (deduction && deduction._count.details > 0) {
    throw new Error(
      `Tidak dapat menghapus potongan "${deduction.nama}" karena sudah memiliki riwayat transaksi penggajian. Anda dapat menonaktifkannya saja.`
    );
  }

  return prisma.deduction.delete({
    where: { id },
  });
}