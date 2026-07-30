import { requireAdmin } from "@/lib/session";
import { getPositions } from "@/services/position.service";
import { PositionList } from "@/components/positions/position-list";

export default async function PositionsPage() {
  await requireAdmin();

  const positions = await getPositions();

  return <PositionList positions={positions} />;
}