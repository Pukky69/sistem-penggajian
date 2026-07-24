import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeToolbar } from "@/components/employees/employee-toolbar";
import { EmployeePagination } from "@/components/employees/employee-pagination";

import { requireAdmin } from "@/lib/session";
import { getEmployees } from "@/services/employee.service";

export default async function EmployeesPage() {
  await requireAdmin();

  const employees = await getEmployees();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Karyawan</h1>

        <p className="text-muted-foreground">
          Kelola seluruh data karyawan perusahaan.
        </p>
      </div>

      <EmployeeToolbar />

  <EmployeeTable employees={employees} />

  <EmployeePagination />
</div>
  );
}