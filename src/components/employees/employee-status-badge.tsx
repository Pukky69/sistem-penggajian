import { Badge } from "@/components/ui/badge";
import { EmployeeStatus } from "@prisma/client";

type Props = {
  status: EmployeeStatus;
};

export function EmployeeStatusBadge({ status }: Props) {
  return (
    <Badge variant={status === EmployeeStatus.AKTIF ? "default" : "secondary"}>
      {status === EmployeeStatus.AKTIF ? "Aktif" : "Nonaktif"}
    </Badge>
  );
}