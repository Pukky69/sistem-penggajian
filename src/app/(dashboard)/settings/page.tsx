import { requireAdmin } from "@/lib/session";
import { getCompanySettings } from "@/services/settings.service";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi profil perusahaan dan parameter aplikasi penggajian.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}