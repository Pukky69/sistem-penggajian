import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { requireAuth } from "@/lib/session";
import { canAccess } from "@/lib/permissions";

export default async function SettingsPage() {
  const user = await requireAuth();

  if (!canAccess(user.role, [Role.ADMIN])) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Pengaturan</h1>
      <p className="text-muted-foreground">
        Halaman settings.
      </p>
    </div>
  );
}