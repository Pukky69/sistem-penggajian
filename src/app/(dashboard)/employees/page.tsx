import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeToolbar } from "@/components/employees/employee-toolbar";
import { EmployeePagination } from "@/components/employees/employee-pagination";

import { requireAdmin } from "@/lib/session";
import {
  getEmployees,
  getGrades,
  getPositions,
} from "@/services/employee.service";
import { EmployeeStatus } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    search?: string;
    positionId?: string;
    gradeId?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function EmployeesPage({ searchParams }: Props) {
  await requireAdmin();

  const resolvedParams = await searchParams;

  const search = resolvedParams.search || undefined;
  const positionId = resolvedParams.positionId
    ? Number(resolvedParams.positionId)
    : undefined;
  const gradeId = resolvedParams.gradeId
    ? Number(resolvedParams.gradeId)
    : undefined;
  const status = resolvedParams.status as EmployeeStatus | undefined;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  // Fetch data paralel
  const [employeesResult, positions, grades] = await Promise.all([
    getEmployees({ search, positionId, gradeId, status, page, limit: 10 }),
    getPositions(),
    getGrades(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Karyawan</h1>

        <p className="text-muted-foreground">
          Kelola seluruh data karyawan perusahaan.
        </p>
      </div>

      <EmployeeToolbar positions={positions} grades={grades} />

      <EmployeeTable employees={employeesResult.data} />

      <EmployeePagination meta={employeesResult.meta} />
    </div>
  );
}