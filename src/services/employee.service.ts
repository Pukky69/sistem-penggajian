import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: {
    position: true;
    grade: true;
  };
}>;

export async function getEmployees(): Promise<EmployeeWithRelations[]> {
  return prisma.employee.findMany({
    include: {
      position: true,
      grade: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
}

export async function getEmployeeById(id: number) {
  return prisma.employee.findUnique({
    where: {
      id,
    },
    include: {
      position: true,
      grade: true,
      user: true,
    },
  });
}

export async function getPositions() {
  return prisma.position.findMany({
    select: {
      id: true,
      nama: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
}

export async function getGrades() {
  return prisma.grade.findMany({
    select: {
      id: true,
      nama: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
}