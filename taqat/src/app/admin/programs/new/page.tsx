import { db } from "@/lib/db";
import { ProgramAdminForm } from "@/components/program-admin-form";
export default async function NewProgram() {
  const [categories, sliderCount] = await Promise.all([
    db.programCategory.findMany(),
    db.program.count({ where: { showInSlider: true } }),
  ]);
  return <ProgramAdminForm categories={categories} sliderCount={sliderCount} />;
}
