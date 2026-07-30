"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createEmployeeAction, updateEmployeeAction } from "@/actions/employee.action"; // Tambahkan update action
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  employeeSchema,
  type EmployeeFormValues,
} from "@/validations/employee";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  id: number;
  nama: string;
};

// Tambahkan initialData dan employeeId
type EmployeeFormProps = {
  positions: Option[];
  grades: Option[];
  initialData?: EmployeeFormValues; 
  employeeId?: number; 
};

export function EmployeeForm({
  positions,
  grades,
  initialData,
  employeeId,
}: EmployeeFormProps) {
  const router = useRouter();
  
  // Deteksi apakah sedang dalam mode edit
  const isEditMode = !!initialData && !!employeeId;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema), // Pastikan resolver aktif
    defaultValues: initialData || {
      nama: "",
      nik: "",
      email: "",
      positionId: 0,
      gradeId: 0,
      tanggalLahir: "",
      tanggalMasuk: "",
      status: "AKTIF",
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    // Eksekusi action sesuai mode
    const result = isEditMode
      ? await updateEmployeeAction(employeeId, values)
      : await createEmployeeAction(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/employees");
    router.refresh();
  };

  const onError = (errors: unknown) => {
    console.log("ERROR VALIDATION", errors);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Informasi Karyawan" : "Informasi Karyawan"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">

            {/* LEFT */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  placeholder="Masukkan nama lengkap"
                  {...form.register("nama")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  placeholder="Masukkan NIK"
                  {...form.register("nik")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  {...form.register("email")}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  {...form.register("tanggalLahir")}
                />
              </div>

              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Controller
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jabatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem
                            key={position.id}
                            value={String(position.id)}
                          >
                            {position.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Golongan</Label>
                <Controller
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih golongan" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem
                            key={grade.id}
                            value={String(grade.id)}
                          >
                            {grade.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
                <Input
                  id="tanggalMasuk"
                  type="date"
                  {...form.register("tanggalMasuk")}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AKTIF">AKTIF</SelectItem>
                        <SelectItem value="NONAKTIF">NONAKTIF</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/employees")} // Beri aksi untuk Batal
            >
              Batal
            </Button>

            <Button type="submit">
              {isEditMode ? "Simpan Perubahan" : "Simpan Karyawan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}