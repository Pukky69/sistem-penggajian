"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createEarning,
  deleteEarning,
  toggleEarningStatus,
  updateEarning,
} from "@/services/earning.service";

const earningSchema = z.object({
  nama: z.string().min(2, "Nama tunjangan minimal 2 karakter"),
  tipe: z.string().min(1, "Tipe tunjangan wajib dipilih"),
  nilai: z.number().min(0, "Nilai nominal tidak boleh negatif"),
});

export async function createEarningAction(formData: {
  nama: string;
  tipe: string;
  nilai: number;
}) {
  try {
    const validated = earningSchema.parse(formData);

    await createEarning(validated);

    revalidatePath("/earnings");

    return {
      success: true,
      message: "Tunjangan berhasil ditambahkan",
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
      message: "Gagal menambahkan tunjangan",
    };
  }
}

export async function updateEarningAction(
  id: number,
  formData: {
    nama: string;
    tipe: string;
    nilai: number;
  }
) {
  try {
    const validated = earningSchema.parse(formData);

    await updateEarning(id, validated);

    revalidatePath("/earnings");

    return {
      success: true,
      message: "Tunjangan berhasil diperbarui",
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
      message: "Gagal memperbarui tunjangan",
    };
  }
}

export async function toggleEarningStatusAction(
  id: number,
  isActive: boolean
) {
  try {
    await toggleEarningStatus(id, isActive);

    revalidatePath("/earnings");

    return {
      success: true,
      message: `Status tunjangan berhasil diubah menjadi ${
        isActive ? "Aktif" : "Nonaktif"
      }`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengubah status tunjangan",
    };
  }
}

export async function deleteEarningAction(id: number) {
  try {
    await deleteEarning(id);

    revalidatePath("/earnings");

    return {
      success: true,
      message: "Tunjangan berhasil dihapus",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus tunjangan";

    return {
      success: false,
      message,
    };
  }
}