import { prisma } from "@/lib/prisma";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "PAYROLL" | "EMPLOYEE" | "SYSTEM";
};

export async function getNavbarNotifications(): Promise<NotificationItem[]> {
  const notifications: NotificationItem[] = [];

  // 1. Ambil 3 Gaji Terakhir yang bertipe SELESAI
  const recentPayrolls = await prisma.payroll.findMany({
    where: { status: "SELESAI" },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: {
      id: true,
      bulan: true,
      tahun: true,
      updatedAt: true,
    },
  });

  const NAMA_BULAN = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  recentPayrolls.forEach((p) => {
    notifications.push({
      id: `payroll-${p.id}`,
      title: "Gaji Berhasil Diterbitkan",
      message: `Penggajian periode ${NAMA_BULAN[p.bulan]} ${p.tahun} telah selesai diproses.`,
      time: new Date(p.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      type: "PAYROLL",
    });
  });

  // 2. Ambil 2 Karyawan Terbaru
  const recentEmployees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    take: 2,
    select: {
      id: true,
      nama: true,
      createdAt: true,
    },
  });

  recentEmployees.forEach((e) => {
    notifications.push({
      id: `emp-${e.id}`,
      title: "Karyawan Baru Terdaftar",
      message: `${e.nama} telah resmi didaftarkan ke dalam sistem.`,
      time: new Date(e.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      type: "EMPLOYEE",
    });
  });

  return notifications;
}