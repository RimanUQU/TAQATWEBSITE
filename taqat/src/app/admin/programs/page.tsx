import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin-ui";
import { AdminProgramCard } from "@/components/admin-program-card";
import { Alert, EmptyState } from "@/components/ui";

const tabs = [
  { key: "", label: "الكل" },
  { key: "PUBLISHED", label: "منشور" },
  { key: "DRAFT", label: "مسودة" },
  { key: "ARCHIVED", label: "مؤرشف" },
] as const;

export default async function AdminPrograms({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const status = tabs.some((t) => t.key === sp.status) ? sp.status : "";
  const programs = await db.program.findMany({
    where: status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {},
    include: { _count: { select: { registrations: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <AdminHeader
        title="البرامج"
        subtitle="إنشاء ونشر وأرشفة البرامج."
        actions={
          <Link className="btn btn-primary" href="/admin/programs/new">
            إضافة برنامج
          </Link>
        }
      />
      {sp.saved && <Alert type="success">تم حفظ البرنامج بنجاح.</Alert>}
      <div className="admin-program-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key ? `/admin/programs?status=${tab.key}` : "/admin/programs"}
            className={`btn btn-sm ${status === tab.key ? "btn-primary" : "btn-outline"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {programs.length ? (
        <div className="grid-3 admin-program-grid">
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
