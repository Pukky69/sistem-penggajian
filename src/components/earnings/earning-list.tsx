"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { EarningDialog } from "@/components/earnings/earning-dialog";
import { DeleteEarningDialog } from "@/components/earnings/delete-earning-dialog";
import { toggleEarningStatusAction } from "@/actions/earning.action";

type Earning = {
  id: number;
  nama: string;
  tipe: string;
  nilai: number | string | any;
  isActive: boolean;
};

type Props = {
  earnings: Earning[];
};

export function EarningList({ earnings }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState<Earning | null>(null);

  const handleCreate = () => {
    setSelectedEarning(null);
    setDialogOpen(true);
  };

  const handleEdit = (earning: Earning) => {
    setSelectedEarning(earning);
    setDialogOpen(true);
  };

  const handleDelete = (earning: Earning) => {
    setSelectedEarning(earning);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await toggleEarningStatusAction(id, !currentStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Gagal mengubah status tunjangan");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Tunjangan</h1>
          <p className="text-muted-foreground">
            Kelola komponen tunjangan dan pendapatan karyawan.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Tunjangan
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Nama Tunjangan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Nominal Standard</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data tunjangan.
                </TableCell>
              </TableRow>
            ) : (
              earnings.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{item.nama}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.tipe}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-emerald-600 font-semibold">
                    {formatRupiah(Number(item.nilai))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, item.isActive)
                        }
                      />
                      <span className="text-xs font-medium">
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
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

      <EarningDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        earning={selectedEarning}
      />

      <DeleteEarningDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        earning={selectedEarning}
      />
    </div>
  );
}