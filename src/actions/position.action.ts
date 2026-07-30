"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPosition,
  deletePosition,
  updatePosition,
} from "@/services/position.service";

const positionSchema = z.object({
  nama: z.string().min(2, "Nama jabatan minimal 2 karakter"),
});

export async function createPositionAction(formData: { nama: string }) {
  try {
    const validated = positionSchema.parse(formData);

    await createPosition(validated);

    revalidatePath("/positions");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Jabatan berhasil ditambahkan",
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
      message: "Gagal menambahkan jabatan",
    };
  }
}

export async function updatePositionAction(
  id: number,
  formData: { nama: string }
) {
  try {
    const validated = positionSchema.parse(formData);

    await updatePosition(id, validated);

    revalidatePath("/positions");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Jabatan berhasil diperbarui",
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
      message: "Gagal memperbarui jabatan",
    };
  }
}

export async function deletePositionAction(id: number) {
  try {
    await deletePosition(id);

    revalidatePath("/positions");
    revalidatePath("/employees");

    return {
      success: true,
      message: "Jabatan berhasil dihapus",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus jabatan";

    return {
      success: false,
      message,
    };
  }
}