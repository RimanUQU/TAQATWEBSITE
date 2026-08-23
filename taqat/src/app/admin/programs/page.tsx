import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin-ui";
import { AdminProgramGrid } from "@/components/admin-program-grid";
import { SavedBanner } from "@/components/saved-banner";

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
      <AdminHeader title="البرامج" subtitle="إنشاء ونشر وأرشفة البرامج." />
      <SavedBanner />
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
      <AdminProgramGrid programs={programs} />
    </>
  );
}
