"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createGrade,
  deleteGrade,
  updateGrade,
} from "@/services/grade.service";

const gradeSchema = z.object({
  nama: z.string().min(1, "Nama golongan wajib diisi"),
  gajiPokok: z.number().min(0, "Gaji pokok tidak boleh negatif"),
});

export async function createGradeAction(formData: {
  nama: string;
  gajiPokok: number;
}) {
  try {
    const validated = gradeSchema.parse(formData);

    await createGrade(validated);

    revalidatePath("/grades");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Golongan berhasil ditambahkan",
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
      message: "Gagal menambahkan golongan",
    };
  }
}

export async function updateGradeAction(
  id: number,
  formData: {
    nama: string;
    gajiPokok: number;
  }
) {
  try {
    const validated = gradeSchema.parse(formData);

    await updateGrade(id, validated);

    revalidatePath("/grades");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Golongan berhasil diperbarui",
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
      message: "Gagal memperbarui golongan",
    };
  }
}

export async function deleteGradeAction(id: number) {
  try {
    await deleteGrade(id);

    revalidatePath("/grades");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Golongan berhasil dihapus",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus golongan";

    return {
      success: false,
      message,
    };
  }
}