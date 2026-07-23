import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Settings,
  User,
  Receipt,
  History,
} from "lucide-react";

export const ADMIN_MENU = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Karyawan",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Penggajian",
    href: "/payroll",
    icon: Wallet,
  },
  {
    title: "Laporan",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
];

export const EMPLOYEE_MENU = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profil Saya",
    href: "/profile",
    icon: User,
  },
  {
    title: "Slip Gaji",
    href: "/salary",
    icon: Receipt,
  },
  {
    title: "Riwayat Gaji",
    href: "/history",
    icon: History,
  },
];