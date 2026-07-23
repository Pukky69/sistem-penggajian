import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { requireAuth } from "@/lib/session";
import { canAccess } from "@/lib/permissions";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (!canAccess(user.role, [Role.ADMIN, Role.KARYAWAN])) {
    redirect("/login");
  }

  return (
    "dashboard content"
  );
}