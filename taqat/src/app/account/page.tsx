import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountForm, ChangePasswordForm, DeleteAccount } from "@/components/account-form";
import { AccountTabs } from "@/components/account-tabs";
import { FavoritesList } from "@/components/favorites-list";
import { FeedbackList } from "@/components/feedback-list";
import { Alert, ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "حسابي الشخصي", robots: { index: false } };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordChanged?: string }>;
}) {
  const user = await requireUser();
  const { passwordChanged } = await searchParams;

  const [favorites, feedbacks] = await Promise.all([
    db.favorite.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { createdAt: "desc" },
    }),
    db.feedback.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const sections = {
    profile: (
      <section className="panel">
        <h2>البيانات الشخصية</h2>
        <AccountForm user={user} />
      </section>
    ),

    favorites: (
      <section className="panel">
        <h2>البرامج المفضلة</h2>
        <FavoritesList favorites={favorites} />
      </section>
    ),

    feedback: (
      <section className="panel">
        <h2>آرائي ومقترحاتي</h2>
        <FeedbackList feedbacks={feedbacks} />
      </section>
    ),

    security: (
      <>
        {passwordChanged && <Alert type="success">تم تغيير كلمة المرور بنجاح.</Alert>}
        <section className="panel">
          <h2>تغيير كلمة المرور</h2>
          <ChangePasswordForm />
        </section>

        <section className="panel account-delete">
          <h2>حذف الحساب</h2>
          <p>هذا إجراء نهائي يزيل بياناتك من المنصة، ولا يمكن التراجع عنه.</p>
          <DeleteAccount />
        </section>
      </>
    ),
  };

  return (
    <>
      <div className="page-hero staff-hero">
        <span className="staff-hero-decor staff-hero-sprig-left" aria-hidden="true">
          <svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 200 C 70 150, 78 110, 60 70" stroke="var(--pink-400)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="60" cy="70" rx="16" ry="10" fill="var(--teal-500)" transform="rotate(-35 60 70)" />
            <ellipse cx="72" cy="96" rx="14" ry="9" fill="var(--pink-400)" transform="rotate(-20 72 96)" />
            <ellipse cx="68" cy="130" rx="15" ry="9" fill="var(--teal-300)" transform="rotate(-30 68 130)" />
            <ellipse cx="78" cy="160" rx="13" ry="8" fill="var(--pink-300)" transform="rotate(-15 78 160)" />
          </svg>
        </span>
        <span className="staff-hero-decor staff-hero-sprig-right" aria-hidden="true">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 90 C 30 70, 45 55, 55 20" stroke="var(--teal-500)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="55" cy="20" rx="11" ry="7" fill="var(--pink-400)" transform="rotate(-40 55 20)" />
            <ellipse cx="44" cy="42" rx="10" ry="6" fill="var(--teal-300)" transform="rotate(-25 44 42)" />
          </svg>
        </span>
        <span className="staff-hero-dot staff-hero-dot-a" aria-hidden="true" />
        <span className="staff-hero-dot staff-hero-dot-b" aria-hidden="true" />
        <div className="container">
          <div className="staff-hero-inner">
            <span className="staff-hero-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M12 21c0-7-4-12-8-13 1 7 4 12 8 13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              فريق طاقات
            </span>
            <h1>حسابي الشخصي</h1>
            <p className="staff-hero-sub">أديري بياناتك وتابعي برامجك المفضلة.</p>
            {user.role === "ADMIN" && (
              <ButtonLink href="/admin" variant="outline" className="account-admin-link">
                <LayoutDashboard size={18} aria-hidden="true" />
                الانتقال إلى لوحة التحكم
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <AccountTabs sections={sections} defaultTab={passwordChanged ? "security" : "profile"} />
        </div>
      </section>
    </>
  );
}
