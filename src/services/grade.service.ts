import { prisma } from "@/lib/prisma";

export type GradeInput = {
  nama: string;
  gajiPokok: number;
};

export async function getGrades() {
  return prisma.grade.findMany({
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

export async function getGradeById(id: number) {
  return prisma.grade.findUnique({
    where: { id },
  });
}

export async function createGrade(data: GradeInput) {
  return prisma.grade.create({
    data: {
      nama: data.nama,
      gajiPokok: data.gajiPokok,
    },
  });
}

export async function updateGrade(id: number, data: GradeInput) {
  return prisma.grade.update({
    where: { id },
    data: {
      nama: data.nama,
      gajiPokok: data.gajiPokok,
    },
  });
}

export async function deleteGrade(id: number) {
  const grade = await prisma.grade.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (grade && grade._count.employees > 0) {
    throw new Error(
      `Tidak dapat menghapus golongan "${grade.nama}" karena masih digunakan oleh ${grade._count.employees} karyawan.`
    );
  }

  return prisma.grade.delete({
    where: { id },
  });
}