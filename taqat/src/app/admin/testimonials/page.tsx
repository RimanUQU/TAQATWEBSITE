import Link from "next/link";
import { db } from "@/lib/db";
import { deleteTestimonialAction, saveTestimonialAction } from "@/actions/admin";
import { ActiveToggle, AdminHeader, AreaField, TextField } from "@/components/admin-ui";
import { Button } from "@/components/ui";
import { TestimonialDetailsDialog } from "@/components/testimonial-details-dialog";
export default async function Testimonials({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [items, current] = await Promise.all([
    db.testimonial.findMany({ orderBy: { displayOrder: "asc" } }),
    edit ? db.testimonial.findUnique({ where: { id: edit } }) : null,
  ]);
  return (
    <>
      <AdminHeader title="قالوا عنا" />
      <form action={saveTestimonialAction} className="panel admin-form">
        <input type="hidden" name="id" value={current?.id || ""} />
        <AreaField name="quote" label="النص" value={current?.quote} />
        <TextField name="name" label="الاسم" value={current?.name} required />
        <TextField name="title" label="الصفة أو المسمى" value={current?.title || ""} />
        <TextField name="rating" label="التقييم من 5" type="number" value={current?.rating ?? 5} />
        <TextField
          name="displayOrder"
          label="ترتيب العرض"
          type="number"
          value={current?.displayOrder ?? items.length + 1}
        />
        <ActiveToggle checked={current?.active ?? true} />
        <Button>{current ? "حفظ التعديل" : "إضافة الشهادة"}</Button>
        {current && (
          <Link className="btn btn-outline" href="/admin/testimonials">
            إلغاء
          </Link>
        )}
      </form>
      <section className="page-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>النص</th>
                <th>التقييم</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td className="text-preview-cell">
                    <TestimonialDetailsDialog
                      name={i.name}
                      title={i.title}
                      quote={i.quote}
                      rating={i.rating}
                      active={i.active}
                    />
                  </td>
                  <td>{i.rating}/5</td>
                  <td className="table-actions">
                    <Link
                      className="btn btn-outline btn-sm"
                      href={`/admin/testimonials?edit=${i.id}`}
                    >
                      تعديل
                    </Link>
                    <form action={deleteTestimonialAction.bind(null, i.id)}>
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
