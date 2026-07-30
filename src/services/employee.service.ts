import { EmployeeStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: {
    position: true;
    grade: true;
  };
}>;

export type GetEmployeesParams = {
  search?: string;
  positionId?: number;
  gradeId?: number;
  status?: EmployeeStatus;
};

export async function getEmployees(
  params?: GetEmployeesParams
): Promise<EmployeeWithRelations[]> {
  const { search, positionId, gradeId, status } = params || {};

  const where: Prisma.EmployeeWhereInput = {};

  if (search) {
    where.OR = [
      { nama: { contains: search } },
      { nik: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (positionId) {
    where.positionId = positionId;
  }

  if (gradeId) {
    where.gradeId = gradeId;
  }

  if (status) {
    where.status = status;
  }

  return prisma.employee.findMany({
    where,
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

type CreateEmployeeInput = {
  nama: string;
  nik: string;
  email: string;
  tanggalLahir: string;
  tanggalMasuk: string;
  status: EmployeeWithRelations["status"];
  positionId: number;
  gradeId: number;
};

export async function createEmployee(data: CreateEmployeeInput) {
  return prisma.employee.create({
    data: {
      nama: data.nama,
      nik: data.nik,
      email: data.email,
      tanggalLahir: new Date(data.tanggalLahir),
      tanggalMasuk: new Date(data.tanggalMasuk),
      status: data.status,
      positionId: data.positionId,
      gradeId: data.gradeId,
    },
    include: {
      position: true,
      grade: true,
    },
  });
}

export async function updateEmployee(id: number, data: CreateEmployeeInput) {
  return prisma.employee.update({
    where: { id },
    data: {
      nama: data.nama,
      nik: data.nik,
      email: data.email,
      tanggalLahir: new Date(data.tanggalLahir),
      tanggalMasuk: new Date(data.tanggalMasuk),
      status: data.status,
      positionId: data.positionId,
      gradeId: data.gradeId,
    },
  });
}

export async function deleteEmployee(id: number) {
  return prisma.employee.delete({
    where: { id },
  });
}

export async function toggleEmployeeStatus(
  id: number,
  newStatus: EmployeeStatus
) {
  return prisma.employee.update({
    where: { id },
    data: {
      status: newStatus,
    },
  });
}