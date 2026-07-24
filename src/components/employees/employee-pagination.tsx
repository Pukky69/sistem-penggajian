import { Button } from "@/components/ui/button";

export function EmployeePagination() {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <Button variant="outline" disabled>
        Previous
      </Button>

      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">1</span> of{" "}
        <span className="font-medium text-foreground">1</span>
      </p>

      <Button variant="outline" disabled>
        Next
      </Button>
    </div>
  );
}