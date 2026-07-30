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
import { PositionDialog } from "@/components/positions/position-dialog";
import { DeletePositionDialog } from "@/components/positions/delete-position-dialog";

type PositionWithCount = {
  id: number;
  nama: string;
  _count: {
    employees: number;
  };
};

type Props = {
  positions: PositionWithCount[];
};

export function PositionList({ positions }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<PositionWithCount | null>(null);

  const handleCreate = () => {
    setSelectedPosition(null);
    setDialogOpen(true);
  };

  const handleEdit = (position: PositionWithCount) => {
    setSelectedPosition(position);
    setDialogOpen(true);
  };

  const handleDelete = (position: PositionWithCount) => {
    setSelectedPosition(position);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Jabatan</h1>
          <p className="text-muted-foreground">
            Kelola master data jabatan karyawan perusahaan.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Jabatan
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Nama Jabatan</TableHead>
              <TableHead>Jumlah Karyawan</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data jabatan.
                </TableCell>
              </TableRow>
            ) : (
              positions.map((pos, index) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{pos.nama}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-4" />
                      <span>{pos._count.employees} Karyawan</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(pos)}
                      >
                        <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(pos)}
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

      <PositionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        position={selectedPosition}
      />

      <DeletePositionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        position={selectedPosition}
      />
    </div>
  );
}