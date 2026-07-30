import { requireAdmin } from "@/lib/session";
import { getDeductions } from "@/services/deduction.service";
import { DeductionList } from "@/components/deductions/deduction-list";

export default async function DeductionsPage() {
  await requireAdmin();

  const deductions = await getDeductions();

  return <DeductionList deductions={deductions} />;
}