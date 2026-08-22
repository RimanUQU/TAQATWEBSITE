import { db } from "@/lib/db";
import { updateRegistrationAction } from "@/actions/admin";
import { AdminHeader } from "@/components/admin-ui";
import { Button, Input, Select } from "@/components/ui";
import { formatDate } from "@/lib/utils";
export default async function Registrations({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; program?: string }>;
}) {
  const sp = await searchParams;
  const [items, programs] = await Promise.all([
    db.programRegistration.findMany({
      where: {
        ...(sp.program ? { programId: sp.program } : {}),
        ...(sp.q
          ? { user: { OR: [{ name: { contains: sp.q } }, { email: { contains: sp.q } }] } }
          : {}),
      },
      include: { user: true, program: true },
      orderBy: { createdAt: "desc" },
    }),
    db.program.findMany({ select: { id: true, title: true } }),
  ]);
  return (
    <>
      <AdminHeader
        title="التسجيلات"
        actions={
          <a className="btn btn-outline" href="/api/admin/registrations.csv">
            تصدير CSV
          </a>
        }
      />
      <form className="search-bar">
        <Input name="q" defaultValue={sp.q} placeholder="بحث عن مستخدمة" />
        <Select name="program" defaultValue={sp.program}>
          <option value="">كل البرامج</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </Select>
        <Button>تصفية</Button>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>المستخدمة</th>
              <th>البرنامج</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>
                  {i.user.name}
                  <small style={{ display: "block" }}>{i.user.email}</small>
                </td>
                <td>{i.program.title}</td>
                <td>{formatDate(i.createdAt)}</td>
                <td>
                  <form
                    action={updateRegistrationAction.bind(null, i.id)}
                    className="table-actions"
                  >
                    <Select name="status" defaultValue={i.status}>
                      <option value="CONFIRMED">مؤكد</option>
                      <option value="WAITLIST">انتظار</option>
                      <option value="CANCELLED">ملغي</option>
                    </Select>
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
