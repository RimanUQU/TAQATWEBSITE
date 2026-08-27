import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AccountForm, DeleteAccount } from "@/components/account-form";
import { Badge } from "@/components/ui";

export const metadata: Metadata = { title: "حسابي الشخصي", robots: { index: false } };

export default async function AccountPage() {
  const user = await requireUser();
  const registrations = await db.programRegistration.findMany({
    where: { userId: user.id },
    include: { program: true },
    orderBy: { createdAt: "desc" },
  });

  return <>
    <div className="page-hero account-hero">
      <span className="account-hero-decor account-hero-sprig-left" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 92 C 32 74, 46 58, 52 22" stroke="var(--teal-500)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="52" cy="22" rx="11" ry="7" fill="var(--pink-400)" transform="rotate(-38 52 22)" />
          <ellipse cx="40" cy="46" rx="10" ry="6" fill="var(--teal-300)" transform="rotate(-22 40 46)" />
        </svg>
      </span>
      <span className="account-hero-decor account-hero-sprig-right" aria-hidden="true">
        <svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M75 200 C 70 150, 82 110, 66 70" stroke="var(--pink-400)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="66" cy="70" rx="16" ry="10" fill="var(--teal-500)" transform="rotate(35 66 70)" />
          <ellipse cx="55" cy="98" rx="14" ry="9" fill="var(--pink-400)" transform="rotate(20 55 98)" />
          <ellipse cx="60" cy="132" rx="15" ry="9" fill="var(--teal-300)" transform="rotate(30 60 132)" />
        </svg>
      </span>
      <span className="account-hero-dot account-hero-dot-a" aria-hidden="true" />
      <span className="account-hero-dot account-hero-dot-b" aria-hidden="true" />
      <div className="container">
        <div className="account-hero-inner">
          <span className="account-hero-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 21c1.2-4.2 4.4-7 8-7s6.8 2.8 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            حسابك في طاقات
          </span>
          <h1>حسابي الشخصي</h1>
          <p className="account-hero-sub">أديري بياناتك وتابعي البرامج التي انضممتِ إليها.</p>
        </div>
      </div>
    </div>

    <section className="page-section">
      <div className="container account-grid">
        <section className="panel">
          <h2>البيانات الشخصية</h2>
          <AccountForm user={user} />
        </section>

        <section className="panel account-programs">
          <h2>برامجي</h2>
          {registrations.length ? (
            <div className="registration-list">
              {registrations.map((r) => (
                <div className="registration-item" key={r.id}>
                  <span className="registration-icon" aria-hidden="true">
                    <CalendarDays size={18} />
                  </span>
                  <div className="registration-info">
                    <Link href={`/programs/${r.program.slug}`}>
                      <strong>{r.program.title}</strong>
                    </Link>
                    <small>سُجل في {formatDate(r.createdAt)}</small>
                  </div>
                  <Badge tone={r.status === "CONFIRMED" ? "teal" : "gray"}>
                    {r.status === "CONFIRMED" ? "مؤكد" : r.status === "WAITLIST" ? "انتظار" : "ملغي"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="registration-empty">
              لم تسجلي في أي برنامج بعد. <Link className="card-link" href="/programs">اكتشفي البرامج ←</Link>
            </p>
          )}
        </section>
      </div>

      <div className="container">
        <section className="panel account-delete">
          <h2>حذف الحساب</h2>
          <p>هذا إجراء نهائي يزيل بياناتك وتسجيلاتك من المنصة، ولا يمكن التراجع عنه.</p>
          <DeleteAccount />
        </section>
      </div>
    </section>
  </>;
}
