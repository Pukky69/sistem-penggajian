import { notFound } from "next/navigation";

import { EmployeeForm } from "@/components/employees/employee-form";
import {
  getEmployeeById,
  getGrades,
  getPositions,
} from "@/services/employee.service";
import type { EmployeeFormValues } from "@/validations/employee";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params;

  const employeeId = Number(id);

  if (Number.isNaN(employeeId)) {
    notFound();
  }

  const [employee, positions, grades] = await Promise.all([
    getEmployeeById(employeeId),
    getPositions(),
    getGrades(),
  ]);

  if (!employee) {
    notFound();
  }

  // Format Date dari Prisma (Object Date) ke string YYYY-MM-DD sesuai schema Zod & HTML Date Input
  const initialData: EmployeeFormValues = {
    nama: employee.nama,
    nik: employee.nik,
    email: employee.email,
    tanggalLahir: employee.tanggalLahir.toISOString().split("T")[0],
    tanggalMasuk: employee.tanggalMasuk.toISOString().split("T")[0],
    positionId: employee.positionId,
    gradeId: employee.gradeId,
    status: employee.status,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Karyawan
        </h1>

        <p className="text-muted-foreground">
          Perbarui data karyawan.
        </p>
      </div>

      <EmployeeForm
        initialData={initialData}
        employeeId={employee.id}
        positions={positions}
        grades={grades}
      />
    </div>
  );
}