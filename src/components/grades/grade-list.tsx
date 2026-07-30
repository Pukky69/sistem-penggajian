"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { GradeDialog } from "@/components/grades/grade-dialog";
import { DeleteGradeDialog } from "@/components/grades/delete-grade-dialog";

type GradeWithCount = {
  id: number;
  nama: string;
  gajiPokok: number | string | any;
  _count: {
    employees: number;
  };
};

type Props = {
  grades: GradeWithCount[];
};

export function GradeList({ grades }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeWithCount | null>(
    null
  );

  const handleCreate = () => {
    setSelectedGrade(null);
    setDialogOpen(true);
  };

  const handleEdit = (grade: GradeWithCount) => {
    setSelectedGrade(grade);
    setDialogOpen(true);
  };

  const handleDelete = (grade: GradeWithCount) => {
    setSelectedGrade(grade);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Golongan</h1>
          <p className="text-muted-foreground">
            Kelola master data golongan dan besaran gaji pokok.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Golongan
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Nama Golongan</TableHead>
              <TableHead>Gaji Pokok</TableHead>
              <TableHead>Jumlah Karyawan</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data golongan.
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade, index) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{grade.nama}</TableCell>
                  <TableCell className="font-mono text-emerald-600 font-semibold">
                    {formatRupiah(Number(grade.gajiPokok))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-4" />
                      <span>{grade._count.employees} Karyawan</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(grade)}
                      >
                        <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(grade)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <GradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        grade={selectedGrade}
      />

      <DeleteGradeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        grade={selectedGrade}
      />
    </div>
  );
}