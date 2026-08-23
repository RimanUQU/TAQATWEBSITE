"use client";
import { useState } from "react";
import type { Program } from "@prisma/client";
import { Button, EmptyState } from "./ui";
import { AdminProgramCard } from "./admin-program-card";

type AdminProgram = Program & { _count: { registrations: number } };

export function AdminProgramGrid({ programs }: { programs: AdminProgram[] }) {
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
          {creating && <AdminProgramCard onCancelNew={() => setCreating(false)} />}
          {programs.map((program) => (
            <AdminProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <EmptyState title="ما فيه برامج" text="ما فيه برامج مطابقة لهذا الفلتر حاليًا." />
      )}
    </>
  );
}
