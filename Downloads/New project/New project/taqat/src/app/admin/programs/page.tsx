import Link from "next/link";
import { db } from "@/lib/db";
import { archiveProgramAction } from "@/actions/admin";
import { AdminHeader } from "@/components/admin-ui";
import { Alert, Badge, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";
export default async function AdminPrograms({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [programs, sp] = await Promise.all([
    db.program.findMany({
      include: { _count: { select: { registrations: true } } },
      orderBy: { createdAt: "desc" },
    }),
    searchParams,
  ]);
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
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>البرنامج</th>
              <th>البداية</th>
              <th>التسجيلات</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                </td>
                <td>{formatDate(p.startDate)}</td>
                <td>
                  {p._count.registrations} / {p.capacity}
                </td>
                <td>
                  <Badge tone={p.status === "PUBLISHED" ? "teal" : "gray"}>
                    {p.status === "PUBLISHED" ? "منشور" : p.status === "DRAFT" ? "مسودة" : "مؤرشف"}
                  </Badge>
                </td>
                <td className="table-actions">
                  <Link className="btn btn-outline btn-sm" href={`/admin/programs/${p.id}/edit`}>
                    تعديل
                  </Link>
                  {p.status !== "ARCHIVED" && (
                    <form action={archiveProgramAction.bind(null, p.id)}>
                      <Button variant="text" size="sm">
                        أرشفة
                      </Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
