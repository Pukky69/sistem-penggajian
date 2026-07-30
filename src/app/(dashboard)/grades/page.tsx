import { requireAdmin } from "@/lib/session";
import { getGrades } from "@/services/grade.service";
import { GradeList } from "@/components/grades/grade-list";

export default async function GradesPage() {
  await requireAdmin();

  const grades = await getGrades();

  return <GradeList grades={grades} />;
}