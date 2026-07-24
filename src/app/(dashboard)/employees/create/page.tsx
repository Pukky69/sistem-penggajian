import { EmployeeForm } from "@/components/employees/employee-form";
import { getGrades, getPositions } from "@/services/employee.service";

export default async function CreateEmployeePage() {
  const [positions, grades] = await Promise.all([
    getPositions(),
    getGrades(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tambah Karyawan
        </h1>

        <p className="text-muted-foreground">
          Tambahkan data karyawan baru ke sistem.
        </p>
      </div>

      <EmployeeForm
        positions={positions}
        grades={grades}
      />
    </div>
  );
}