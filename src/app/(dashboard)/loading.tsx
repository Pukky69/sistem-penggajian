import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Summary Cards Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-5 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table / Content Skeleton */}
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Rows Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}