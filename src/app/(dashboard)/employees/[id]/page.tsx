import { notFound } from "next/navigation";

import { getEmployeeById } from "@/services/employee.service";
import { EmployeeDetailCard } from "@/components/employees/employee-detail-card";


type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function EmployeeDetailPage({
  params,
}: PageProps) {


  const { id } = await params;


  const employeeId = Number(id);


  if (isNaN(employeeId)) {
    notFound();
  }


  const employee = await getEmployeeById(
    employeeId
  );


  if (!employee) {
    notFound();
  }


  return (
  <div className="space-y-6">

    <div>
      <h1 className="text-2xl font-bold">
        Detail Karyawan
      </h1>

      <p className="text-muted-foreground">
        Informasi lengkap data karyawan
      </p>
    </div>


    <EmployeeDetailCard
      employee={employee}
    />


  </div>
);
}