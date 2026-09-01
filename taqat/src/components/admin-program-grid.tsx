"use client";
import { useState } from "react";
import type { Program, ProgramCategory, TargetAudience } from "@prisma/client";
import { Button, EmptyState } from "./ui";
import { AdminProgramCard } from "./admin-program-card";

type AdminProgram = Program & {
  _count: { registrations: number };
  category: ProgramCategory | null;
  targetAudience: TargetAudience | null;
};

export function AdminProgramGrid({
  programs,
  categories,
  audiences,
  sliderCount,
}: {
  programs: AdminProgram[];
  categories: ProgramCategory[];
  audiences: TargetAudience[];
  sliderCount: number;
}) {
  const [creating, setCreating] = useState(false);
  return (
    <>
      <div className="admin-program-tabs-row">
        <Button size="sm" onClick={() => setCreating(true)} disabled={creating}>
          + إضافة برنامج
        </Button>
      </div>
      {programs.length || creating ? (
        <div className="grid-3 admin-program-grid">
          {creating && (
            <AdminProgramCard
              categories={categories}
              audiences={audiences}
              sliderCount={sliderCount}
              onCancelNew={() => setCreating(false)}
            />
          )}
          {programs.map((program) => (
            <AdminProgramCard
              key={program.id}
              program={program}
              categories={categories}
              audiences={audiences}
              sliderCount={sliderCount}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="ما فيه برامج" text="ما فيه برامج مطابقة لهذا الفلتر حاليًا." />
      )}
    </>
  );
}
