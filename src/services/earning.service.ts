import { prisma } from "@/lib/prisma";

export type EarningInput = {
  nama: string;
  tipe: string;
  nilai: number;
  isActive?: boolean;
};

export async function getEarnings() {
  return prisma.earning.findMany({
    orderBy: {
      nama: "asc",
    },
  });
}

export async function getEarningById(id: number) {
  return prisma.earning.findUnique({
    where: { id },
  });
}

export async function createEarning(data: EarningInput) {
  return prisma.earning.create({
    data: {
      nama: data.nama,
      tipe: data.tipe,
      nilai: data.nilai,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateEarning(id: number, data: EarningInput) {
  return prisma.earning.update({
    where: { id },
    data: {
      nama: data.nama,
      tipe: data.tipe,
      nilai: data.nilai,
    },
  });
}

export async function toggleEarningStatus(id: number, isActive: boolean) {
  return prisma.earning.update({
    where: { id },
    data: { isActive },
  });
}

export async function deleteEarning(id: number) {
  // Cek apakah tunjangan pernah digunakan di riwayat payroll_details
  const earning = await prisma.earning.findUnique({
    where: { id },
    include: {
      _count: {
        select: { details: true },
      },
    },
  });

  if (earning && earning._count.details > 0) {
    throw new Error(
      `Tidak dapat menghapus tunjangan "${earning.nama}" karena sudah memiliki riwayat transaksi penggajian. Anda dapat menonaktifkannya saja.`
    );
  }

  return prisma.earning.delete({
    where: { id },
  });
}