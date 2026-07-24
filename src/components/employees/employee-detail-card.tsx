import { EmployeeStatus } from "@prisma/client";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { EmployeeStatusBadge } from "./employee-status-badge";

type EmployeeDetailCardProps = {
  employee: {
    nama: string;
    nik: string;
    email: string;
    status: EmployeeStatus;

    tanggalLahir: Date;
    tanggalMasuk: Date;

    position: {
      nama: string;
    };

    grade: {
      nama: string;
    };
  };
};

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="font-medium">
        {value}
      </div>
    </div>
  );
}

export function EmployeeDetailCard({
  employee,
}: EmployeeDetailCardProps) {


  return (
  <div className="space-y-6">


    <Card>
      <CardHeader>
        <CardTitle>
          Informasi Personal
        </CardTitle>
      </CardHeader>


      <CardContent>

        <div className="grid gap-4 md:grid-cols-2">

          <InfoItem
            label="Nama"
            value={employee.nama}
          />


          <InfoItem
            label="NIK"
            value={employee.nik}
          />


          <InfoItem
            label="Email"
            value={employee.email}
          />


          <InfoItem
            label="Tanggal Lahir"
            value={
              format(
                employee.tanggalLahir,
                "dd MMMM yyyy"
              )
            }
          />


          <InfoItem
            label="Tanggal Masuk"
            value={
              format(
                employee.tanggalMasuk,
                "dd MMMM yyyy"
              )
            }
          />

        </div>

      </CardContent>

    </Card>




    <Card>

      <CardHeader>

        <CardTitle>
          Informasi Pekerjaan
        </CardTitle>

      </CardHeader>


      <CardContent>

        <div className="grid gap-4 md:grid-cols-2">


          <InfoItem
            label="Jabatan"
            value={
              employee.position.nama
            }
          />


          <InfoItem
            label="Golongan"
            value={
              employee.grade.nama
            }
          />


          <InfoItem
            label="Status"
            value={
              <EmployeeStatusBadge
                status={employee.status}
              />
            }
          />


        </div>

      </CardContent>

    </Card>


  </div>
);
}