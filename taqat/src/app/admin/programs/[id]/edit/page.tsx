import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProgramAdminForm } from "@/components/program-admin-form";
export default async function EditProgram({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [program, categories, sliderCount] = await Promise.all([
    db.program.findUnique({ where: { id } }),
    db.programCategory.findMany(),
    db.program.count({ where: { showInSlider: true, id: { not: id } } }),
  ]);
  if (!program) notFound();
  return <ProgramAdminForm program={program} categories={categories} sliderCount={sliderCount} />;
}
