"use client";

import Link from "next/link";
import { Role } from "@prisma/client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  ADMIN_MENU,
  EMPLOYEE_MENU,
} from "@/constants/sidebar-menu";

export function AppSidebar() {
  const user = useCurrentUser();

  const menus =
    user?.role === Role.ADMIN
      ? ADMIN_MENU
      : user?.role === Role.KARYAWAN
        ? EMPLOYEE_MENU
        : [];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:flex">
      <div className="w-full p-6">
        <h1 className="mb-8 text-xl font-bold">
          Sistem Penggajian
        </h1>

        <nav className="space-y-2">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}