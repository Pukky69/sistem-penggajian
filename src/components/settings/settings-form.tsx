"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Building2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateSettingsAction } from "@/actions/settings.action";
import { CompanySettings } from "@/services/settings.service";

type Props = {
  initialSettings: CompanySettings;
};

export function SettingsForm({ initialSettings }: Props) {
  const [formData, setFormData] = useState<CompanySettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          Profil Perusahaan
        </CardTitle>
        <CardDescription>
          Informasi ini akan ditampilkan pada kop Slip Gaji Karyawan dan Laporan Rekapitulasi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nama Perusahaan</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
            <Textarea
              id="companyAddress"
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email Kontak</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">Nomor Telepon</Label>
              <Input
                id="companyPhone"
                value={formData.companyPhone}
                onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 size-4" />
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}