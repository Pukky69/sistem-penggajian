import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export function EmptyState({
  title = "Belum ada data",
  description = "Belum ada rekaman data yang tersimpan untuk kategori ini.",
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 mb-4 text-muted-foreground">
        {icon || <FolderOpen className="size-7" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          <Plus className="mr-2 size-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}