import { z } from "zod";

export const employeeSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter"),

  nik: z
    .string()
    .trim()
    .length(16, "NIK harus 16 digit"),

  email: z
    .string()
    .trim()
    .email("Email tidak valid"),

  positionId: z
    .number({
      error: "Jabatan wajib dipilih",
    })
    .positive(),

  gradeId: z
    .number({
      error: "Golongan wajib dipilih",
    })
    .positive(),

  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),

  tanggalMasuk: z.string().min(1, "Tanggal masuk wajib diisi"),

  status: z.enum(["AKTIF", "NONAKTIF"]),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;