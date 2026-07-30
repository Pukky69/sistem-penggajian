"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PayrollStatus } from "@prisma/client";
import {
  deletePayroll,
  generateMonthlyPayroll,
  updatePayrollStatus,
} from "@/services/payroll.service";

const generateSchema = z.object({
  bulan: z.number().min(1).max(12, "Bulan harus antara 1 - 12"),
  tahun: z.number().min(2000, "Tahun tidak valid"),
});

export async function generatePayrollAction(formData: {
  bulan: number;
  tahun: number;
}) {
  try {
    const validated = generateSchema.parse(formData);

    const result = await generateMonthlyPayroll(
      validated.bulan,
      validated.tahun
    );

    revalidatePath("/payroll");
    revalidatePath("/history");

    if (result.createdCount === 0 && result.skippedCount > 0) {
      return {
        success: false,
        message: `Penggajian untuk periode ${validated.bulan}/${validated.tahun} sudah pernah diproses sebelumnya (${result.skippedCount} karyawan).`,
      };
    }

    return {
      success: true,
      message: `Berhasil memproses gaji ${result.createdCount} karyawan untuk periode ${validated.bulan}/${validated.tahun}. (${result.skippedCount} karyawan dilewati/sudah ada)`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    const message =
      error instanceof Error ? error.message : "Gagal memproses penggajian";

    return {
      success: false,
      message,
    };
  }
}

export async function updatePayrollStatusAction(
  id: number,
  status: PayrollStatus
) {
  try {
    await updatePayrollStatus(id, status);

    revalidatePath("/payroll");
    revalidatePath(`/payroll/${id}`);
    revalidatePath("/history");

    return {
      success: true,
      message: `Status penggajian berhasil diperbarui menjadi ${status}`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui status penggajian",
    };
  }
}

export async function deletePayrollAction(id: number) {
  try {
    await deletePayroll(id);

    revalidatePath("/payroll");

    return {
      success: true,
      message: "Draf penggajian berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus draf penggajian",
    };
  }
}