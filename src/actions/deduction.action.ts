"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createDeduction,
  deleteDeduction,
  toggleDeductionStatus,
  updateDeduction,
} from "@/services/deduction.service";

const deductionSchema = z.object({
  nama: z.string().min(2, "Nama potongan minimal 2 karakter"),
  tipe: z.string().min(1, "Tipe potongan wajib dipilih"),
  nilai: z.number().min(0, "Nilai potongan tidak boleh negatif"),
});

export async function createDeductionAction(formData: {
  nama: string;
  tipe: string;
  nilai: number;
}) {
  try {
    const validated = deductionSchema.parse(formData);

    await createDeduction(validated);

    revalidatePath("/deductions");

    return {
      success: true,
      message: "Potongan berhasil ditambahkan",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: "Gagal menambahkan potongan",
    };
  }
}

export async function updateDeductionAction(
  id: number,
  formData: {
    nama: string;
    tipe: string;
    nilai: number;
  }
) {
  try {
    const validated = deductionSchema.parse(formData);

    await updateDeduction(id, validated);

    revalidatePath("/deductions");

    return {
      success: true,
      message: "Potongan berhasil diperbarui",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: "Gagal memperbarui potongan",
    };
  }
}

export async function toggleDeductionStatusAction(
  id: number,
  isActive: boolean
) {
  try {
    await toggleDeductionStatus(id, isActive);

    revalidatePath("/deductions");

    return {
      success: true,
      message: `Status potongan berhasil diubah menjadi ${
        isActive ? "Aktif" : "Nonaktif"
      }`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengubah status potongan",
    };
  }
}

export async function deleteDeductionAction(id: number) {
  try {
    await deleteDeduction(id);

    revalidatePath("/deductions");

    return {
      success: true,
      message: "Potongan berhasil dihapus",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus potongan";

    return {
      success: false,
      message,
    };
  }
}