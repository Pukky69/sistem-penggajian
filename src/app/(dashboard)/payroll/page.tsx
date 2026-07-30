import { requireAdmin } from "@/lib/session";
import { getPayrolls } from "@/services/payroll.service";
import { PayrollToolbar } from "@/components/payroll/payroll-toolbar";
import { PayrollTable } from "@/components/payroll/payroll-table";
import { EmployeePagination } from "@/components/employees/employee-pagination";
import { PayrollStatus } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    search?: string;
    bulan?: string;
    tahun?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function PayrollPage({ searchParams }: Props) {
  await requireAdmin();

  const resolvedParams = await searchParams;

  const search = resolvedParams.search || undefined;
  const bulan = resolvedParams.bulan ? Number(resolvedParams.bulan) : undefined;
  const tahun = resolvedParams.tahun
    ? Number(resolvedParams.tahun)
    : new Date().getFullYear();
  const status = resolvedParams.status as PayrollStatus | undefined;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const result = await getPayrolls({
    search,
    bulan,
    tahun,
    status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pemrosesan Gaji</h1>
        <p className="text-muted-foreground">
          Kelola kalkulasi penggajian bulanan dan status slip gaji karyawan.
        </p>
      </div>

      <PayrollToolbar />

      <PayrollTable payrolls={result.data} />

      <EmployeePagination meta={result.meta} />
    </div>
  );
}