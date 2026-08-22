import { db } from "@/lib/db";
import { updateUserAction } from "@/actions/admin";
import { AdminHeader } from "@/components/admin-ui";
import { Button, Input, Select } from "@/components/ui";
import { formatDate } from "@/lib/utils";
export default async function Users({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await db.user.findMany({
    where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {},
    include: { _count: { select: { registrations: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <AdminHeader title="المستخدمون" />
      <form className="search-bar">
        <Input name="q" defaultValue={q} placeholder="بحث بالاسم أو البريد" />
        <Button>بحث</Button>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>المستخدمة</th>
              <th>التسجيلات</th>
              <th>تاريخ الانضمام</th>
              <th>الصلاحية والحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>
                  <strong>{i.name}</strong>
                  <small style={{ display: "block" }}>{i.email}</small>
                </td>
                <td>{i._count.registrations}</td>
                <td>{formatDate(i.createdAt)}</td>
                <td>
                  <form action={updateUserAction.bind(null, i.id)} className="table-actions">
                    <Select name="role" defaultValue={i.role}>
                      <option value="USER">مستخدمة</option>
                      <option value="ADMIN">مديرة</option>
                    </Select>
                    <label className="check">
                      <input type="checkbox" name="active" defaultChecked={i.active} /> نشط
                    </label>
                    <Button size="sm">حفظ</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
