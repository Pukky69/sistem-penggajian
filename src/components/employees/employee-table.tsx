import type { EmployeeWithRelations } from "@/services/employee.service";
import { EmployeeActions } from "./employee-actions";
import { EmployeeStatusBadge } from "./employee-status-badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  employees: EmployeeWithRelations[];
};

export function EmployeeTable({ employees }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Golongan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <TableRow key={employee.id}>
  <TableCell>{index + 1}</TableCell>

  <TableCell className="font-medium">
    {employee.nama}
  </TableCell>

  <TableCell>{employee.nik}</TableCell>

  <TableCell>{employee.email}</TableCell>

  <TableCell>{employee.position.nama}</TableCell>

  <TableCell>{employee.grade.nama}</TableCell>

  <TableCell>
    <EmployeeStatusBadge status={employee.status} />
  </TableCell>

  <TableCell className="text-right">
    <EmployeeActions employeeId={employee.id} />
  </TableCell>
</TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-muted-foreground"
              >
                Belum ada data karyawan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}