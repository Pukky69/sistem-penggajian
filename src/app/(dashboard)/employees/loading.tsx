import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEmployees() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}