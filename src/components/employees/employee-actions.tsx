"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog";

type Props = {
  employee: {
    id: number;
    nama: string;
  };
};

export function EmployeeActions({ employee }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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