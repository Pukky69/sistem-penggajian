"use server";

import { revalidatePath } from "next/cache";
import { updateCompanySettings, CompanySettings } from "@/services/settings.service";

export async function updateSettingsAction(data: CompanySettings) {
  try {
    if (!data.companyName.trim()) {
      return { success: false, message: "Nama perusahaan wajib diisi" };
    }

    await updateCompanySettings(data);

    revalidatePath("/settings");
    revalidatePath("/payroll/[id]", "page");
    revalidatePath("/salary/[id]", "page");
    revalidatePath("/reports");

    return {
      success: true,
      message: "Pengaturan profil perusahaan berhasil diperbarui",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui pengaturan",
    };
  }
}