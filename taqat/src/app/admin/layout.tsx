import { requireAdmin } from "@/lib/auth";
import { AdminLinks } from "@/components/admin-nav";
import Link from "next/link";
export const metadata = {
  title: { default: "لوحة التحكم", template: "%s | إدارة طاقات" },
  robots: { index: false, follow: false },
};
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="logo light">
          <span>ط</span>
          <b>طاقات</b>
          <small>الإدارة</small>
        </Link>
        <nav>
          <AdminLinks />
        </nav>
      </aside>
      <nav className="mobile-admin-nav" aria-label="قائمة الإدارة">
        <AdminLinks />
      </nav>
      <div className="admin-main">{children}</div>
    </div>
  );
}
