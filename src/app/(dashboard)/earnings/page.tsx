import { requireAdmin } from "@/lib/session";
import { getEarnings } from "@/services/earning.service";
import { EarningList } from "@/components/earnings/earning-list";

export default async function EarningsPage() {
  await requireAdmin();

  const earnings = await getEarnings();

  return <EarningList earnings={earnings} />;
}