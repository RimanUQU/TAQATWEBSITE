import { db } from "@/lib/db";
import { Badge } from "@/components/ui";
export default async function Dashboard() {
  const [users, programs, active, registrations, pending, partners, testimonials, recent] =
    await Promise.all([
      db.user.count(),
      db.program.count(),
      db.program.count({ where: { status: "PUBLISHED" } }),
      db.programRegistration.count(),
      db.programComment.count({ where: { status: "PENDING" } }),
      db.partner.count(),
      db.testimonial.count(),
      db.programRegistration.findMany({
        include: { user: true, program: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);
  const cards = [
    ["المستخدمون", users],
    ["البرامج", programs],
    ["البرامج المنشورة", active],
    ["التسجيلات", registrations],
    ["تعليقات تنتظر المراجعة", pending],
    ["الشركاء", partners],
    ["الشهادات", testimonials],
  ];
  return (
    <>
      <div className="admin-top">
        <div>
          <span className="eyebrow">نظرة عامة</span>
          <h1>لوحة التحكم</h1>
        </div>
        <a className="btn btn-primary" href="/admin/programs">
          إدارة البرامج
        </a>
      </div>
      <div className="dashboard-cards">
        {cards.map(([label, value]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="page-section">
        <h2>أحدث التسجيلات</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>المستخدمة</th>
                <th>البرنامج</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.user.name}</td>
                  <td>{r.program.title}</td>
                  <td>
                    <Badge tone="teal">{r.status}</Badge>
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
