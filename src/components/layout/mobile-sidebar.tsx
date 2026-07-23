"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Role } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  ADMIN_MENU,
  EMPLOYEE_MENU,
} from "@/constants/sidebar-menu";

export function MobileSidebar() {
  const user = useCurrentUser();

  const menus =
    user?.role === Role.ADMIN
      ? ADMIN_MENU
      : user?.role === Role.KARYAWAN
        ? EMPLOYEE_MENU
        : [];

  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-muted lg:hidden">
        <Menu size={20} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 px-6"
      >
        <div className="mt-6">
          <h1 className="mb-10 text-xl font-bold">
            Sistem Penggajian
          </h1>

          <nav className="space-y-3">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm transition hover:bg-muted"
                >
                  <Icon size={18} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}