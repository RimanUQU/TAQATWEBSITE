import Link from "next/link";
import { db } from "@/lib/db";
import { deleteCategoryAction, saveCategoryAction } from "@/actions/admin";
import { AdminHeader, TextField } from "@/components/admin-ui";
import { Button } from "@/components/ui";
export default async function Categories({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [items, current] = await Promise.all([
    db.programCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { programs: true } } },
    }),
    edit ? db.programCategory.findUnique({ where: { id: edit } }) : null,
  ]);
  return (
    <>
      <AdminHeader
        title="تصنيفات البرامج"
        subtitle="التصنيفات تُستخدم لتصفية صفحة البرامج وربط كل برنامج بتصنيفه."
      />
      <form action={saveCategoryAction} className="panel admin-form">
        <input type="hidden" name="id" value={current?.id || ""} />
        <TextField name="name" label="اسم التصنيف" value={current?.name} required />
        <TextField
          name="slug"
          label="الرابط المختصر"
          value={current?.slug || ""}
          hint="يُولّد تلقائيًا من الاسم عند تركه فارغًا"
        />
        <Button>{current ? "حفظ التعديل" : "إضافة التصنيف"}</Button>
        {current && (
          <Link className="btn btn-outline" href="/admin/categories">
            إلغاء
          </Link>
        )}
      </form>
      <section className="page-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>التصنيف</th>
                <th>الرابط</th>
                <th>عدد البرامج</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.slug}</td>
                  <td>{i._count.programs}</td>
                  <td className="table-actions">
                    <Link className="btn btn-outline btn-sm" href={`/admin/categories?edit=${i.id}`}>
                      تعديل
                    </Link>
                    <form action={deleteCategoryAction.bind(null, i.id)}>
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
