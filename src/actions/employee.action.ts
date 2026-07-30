"use server";

import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { updateEmployee, deleteEmployee, toggleEmployeeStatus } from "@/services/employee.service";
import { EmployeeStatus } from "@prisma/client";
import {
  employeeSchema,
  type EmployeeFormValues,
} from "@/validations/employee";

export async function createEmployeeAction(values: EmployeeFormValues) {
  try {
    // 1. Validasi ulang di server
    const validatedData = employeeSchema.parse(values);

    // 2. Hash default password untuk akun login portal karyawan
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 3. Transaksi Prisma: Buat record Employee dan User Account sekaligus
    const result = await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          nik: validatedData.nik,
          nama: validatedData.nama,
          email: validatedData.email,
          tanggalLahir: new Date(validatedData.tanggalLahir),
          tanggalMasuk: new Date(validatedData.tanggalMasuk),
          positionId: Number(validatedData.positionId),
          gradeId: Number(validatedData.gradeId),
          status: EmployeeStatus.AKTIF,
        },
      });

      const user = await tx.user.create({
        data: {
          name: employee.nama,
          email: employee.email,
          password: hashedPassword,
          role: Role.KARYAWAN,
          isActive: true,
          employeeId: employee.id,
        },
      });

      return { employee, user };
    });

    // Revalidate halaman karyawan
    revalidatePath("/employees");

    return {
      success: true,
      data: {
        id: result.employee.id,
        nik: result.employee.nik,
        nama: result.employee.nama,
        email: result.employee.email,
      },
      message: `Karyawan berhasil ditambahkan! Akun login otomatis dibuat (Email: ${result.user.email}, Password: ${defaultPassword})`,
    };
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);

    // Handle duplicate unique field
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = String(error.meta?.target);

      if (target.toLowerCase().includes("nik")) {
        return {
          success: false,
          message: "NIK sudah digunakan",
        };
      }

      if (target.toLowerCase().includes("email")) {
        return {
          success: false,
          message: "Email sudah digunakan",
        };
      }
    }

    return {
      success: false,
      message: "Gagal menambahkan karyawan",
    };
  }
}

export async function updateEmployeeAction(
  id: number,
  values: EmployeeFormValues
) {
  try {
    // Validasi ulang di server
    const validatedData = employeeSchema.parse(values);

    const employee = await updateEmployee(id, validatedData);

    // Update email di akun User jika terikat
    await prisma.user.updateMany({
      where: { employeeId: id },
      data: {
        name: employee.nama,
        email: employee.email,
      },
    });

    // Revalidate cache agar data di tabel & detail terupdate
    revalidatePath("/employees");
    revalidatePath(`/employees/${id}`);

    return {
      success: true,
      data: {
        id: employee.id,
        nik: employee.nik,
        nama: employee.nama,
        email: employee.email,
      },
      message: "Data karyawan berhasil diperbarui",
    };
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    // Handle duplicate unique field
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = String(error.meta?.target);

      if (target.toLowerCase().includes("nik")) {
        return {
          success: false,
          message: "NIK sudah digunakan",
        };
      }

      if (target.toLowerCase().includes("email")) {
        return {
          success: false,
          message: "Email sudah digunakan",
        };
      }
    }

    return {
      success: false,
      message: "Gagal memperbarui karyawan",
    };
  }
}

export async function deleteEmployeeAction(id: number) {
  try {
    // Hapus akun User terkait terlebih dahulu dalam transaction
    const deletedEmployee = await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany({
        where: { employeeId: id },
      });

      return await deleteEmployee(id);
    });

    revalidatePath("/employees");

    return {
      success: true,
      data: {
        id: deletedEmployee.id,
        nama: deletedEmployee.nama,
      },
      message: `Karyawan ${deletedEmployee.nama} berhasil dihapus`,
    };
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);

    // Prisma error jika data terikat dengan tabel lain (misal payroll)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        message:
          "Gagal menghapus! Data karyawan ini terikat dengan riwayat gaji/transaksi lain.",
      };
    }

    return {
      success: false,
      message: "Gagal menghapus data karyawan",
    };
  }
}

export async function toggleEmployeeStatusAction(
  id: number,
  currentStatus: EmployeeStatus
) {
  try {
    const newStatus: EmployeeStatus =
      currentStatus === "AKTIF" ? "NONAKTIF" : "AKTIF";

    const employee = await toggleEmployeeStatus(id, newStatus);

    // Nonaktifkan/aktifkan juga akun user terkait
    await prisma.user.updateMany({
      where: { employeeId: id },
      data: { isActive: newStatus === "AKTIF" },
    });

    revalidatePath("/employees");
    revalidatePath(`/employees/${id}`);

    return {
      success: true,
      message: `Status ${employee.nama} berhasil diubah menjadi ${newStatus}`,
    };
  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    return {
      success: false,
      message: "Gagal mengubah status karyawan",
    };
  }
}