import { getCurrentUser } from "@/lib/session";
import { getEmployeeProfile } from "@/services/employee-portal.service";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Briefcase, Award, Calendar, CreditCard } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user.employeeId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
          <p className="text-muted-foreground">Informasi akun pengguna sistem.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Akun System Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Nama:</span> {user?.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
            <p><span className="text-muted-foreground">Role:</span> <Badge>{user?.role}</Badge></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = await getEmployeeProfile(user.employeeId);

  if (!profile) {
    return <div>Data profil tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">
          Detail informasi kepegawaian dan akun terdaftar Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Identitas Utama */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
            {profile.nama.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.nama}</h2>
            <p className="text-sm text-muted-foreground">{profile.nik}</p>
            <Badge className="mt-2">{profile.status}</Badge>
          </div>
        </Card>

        {/* Card Rincian Kepegawaian */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kepegawaian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Jabatan</p>
                  <p className="font-semibold">{profile.position.nama}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Golongan</p>
                  <p className="font-semibold">{profile.grade.nama}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Gaji Pokok</p>
                  <p className="font-semibold font-mono text-emerald-600">
                    {formatRupiah(Number(profile.grade.gajiPokok))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Masuk</p>
                  <p className="font-semibold">
                    {new Date(profile.tanggalMasuk).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Kantor</p>
                  <p className="font-semibold">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role Akun</p>
                  <p className="font-semibold">{profile.user?.role ?? "KARYAWAN"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}