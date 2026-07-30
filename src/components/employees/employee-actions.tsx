"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { EmployeeStatus } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog";
import { toggleEmployeeStatusAction } from "@/actions/employee.action";

type Props = {
  employee: {
    id: number;
    nama: string;
    status?: EmployeeStatus;
  };
};

export function EmployeeActions({ employee }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleToggleStatus = async () => {
    if (!employee.status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await toggleEmployeeStatusAction(
        employee.id,
        employee.status
      );

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/employees/${employee.id}`} className="flex w-full items-center">
              <Eye className="mr-2 size-4" />
              Detail
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={`/employees/${employee.id}/edit`} className="flex w-full items-center">
              <Pencil className="mr-2 size-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          {/* Toggle Status Menu */}
          {employee.status && (
            <DropdownMenuItem
              disabled={isUpdatingStatus}
              onClick={handleToggleStatus}
              className="cursor-pointer"
            >
              {employee.status === "AKTIF" ? (
                <>
                  <UserX className="mr-2 size-4 text-amber-600" />
                  Nonaktifkan
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 size-4 text-emerald-600" />
                  Aktifkan
                </>
              )}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteEmployeeDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        employee={employee}
      />
    </>
  );
}