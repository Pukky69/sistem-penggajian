import { prisma } from "@/lib/prisma";

export type PositionInput = {
  nama: string;
};

export async function getPositions() {
  return prisma.position.findMany({
    include: {
      _count: {
        select: {
          employees: true,
        },
      },
    },
    orderBy: {
      nama: "asc",
    },
  });
}

export async function getPositionById(id: number) {
  return prisma.position.findUnique({
    where: { id },
  });
}

export async function createPosition(data: PositionInput) {
  return prisma.position.create({
    data: {
      nama: data.nama,
    },
  });
}

export async function updatePosition(id: number, data: PositionInput) {
  return prisma.position.update({
    where: { id },
    data: {
      nama: data.nama,
    },
  });
}

export async function deletePosition(id: number) {
  const position = await prisma.position.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (position && position._count.employees > 0) {
    throw new Error(
      `Tidak dapat menghapus jabatan "${position.nama}" karena masih digunakan oleh ${position._count.employees} karyawan.`
    );
  }

  return prisma.position.delete({
    where: { id },
  });
}