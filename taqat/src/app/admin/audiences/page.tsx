import Link from "next/link";
import { db } from "@/lib/db";
import { deleteAudienceAction, saveAudienceAction } from "@/actions/admin";
import { AdminHeader, TextField } from "@/components/admin-ui";
import { Button } from "@/components/ui";
export default async function Audiences({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [items, current] = await Promise.all([
    db.targetAudience.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { programs: true } } },
    }),
    edit ? db.targetAudience.findUnique({ where: { id: edit } }) : null,
  ]);
  return (
    <>
      <AdminHeader
        title="الفئات المستهدفة"
        subtitle="تُستخدم لتحديد الفئة المستهدفة لكل برنامج، وتقدرين تضيفين فئة جديدة أي وقت."
      />
      <form action={saveAudienceAction} className="panel admin-form">
        <input type="hidden" name="id" value={current?.id || ""} />
        <TextField name="name" label="اسم الفئة" value={current?.name} required />
        <Button>{current ? "حفظ التعديل" : "إضافة الفئة"}</Button>
        {current && (
          <Link className="btn btn-outline" href="/admin/audiences">
            إلغاء
          </Link>
        )}
      </form>
      <section className="page-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الفئة</th>
                <th>عدد البرامج</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i._count.programs}</td>
                  <td className="table-actions">
                    <Link className="btn btn-outline btn-sm" href={`/admin/audiences?edit=${i.id}`}>
                      تعديل
                    </Link>
                    <form action={deleteAudienceAction.bind(null, i.id)}>
                      <Button variant="text" size="sm">
                        حذف
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
