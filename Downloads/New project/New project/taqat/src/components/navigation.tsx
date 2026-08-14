"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [["/", "الرئيسية"], ["/about", "من نحن"], ["/programs", "البرامج"], ["/staff", "الكادر الوظيفي"]];
export function Navigation({ user }: { user: { name: string; role: string } | null }) {
  const path = usePathname(), [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav-wrap"><Link href="/" className="logo" aria-label="نادي طاقات للفتيات"><span>ط</span><b>طاقات</b><small>للفتيات</small></Link><nav className={`main-nav ${open ? "open" : ""}`} aria-label="التنقل الرئيسي"><button className="nav-close" onClick={() => setOpen(false)} aria-label="إغلاق القائمة"><X /></button>{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}>{label}</Link>)}<div className="mobile-auth">{user ? <><Link href="/account">حسابي</Link>{user.role === "ADMIN" && <Link href="/admin">الإعدادات</Link>}<form action="/api/logout" method="post"><button>تسجيل الخروج</button></form></> : <><Link href="/register">إنشاء حساب</Link><Link href="/login">تسجيل الدخول</Link></>}</div></nav><div className="auth-links">{user ? <><Link href="/account">مرحبًا، {user.name.split(" ")[0]}</Link>{user.role === "ADMIN" && <Link className="btn btn-outline btn-sm" href="/admin">الإعدادات</Link>}<form action="/api/logout" method="post"><button className="link-button">تسجيل الخروج</button></form></> : <><Link href="/register">إنشاء حساب</Link><Link className="btn btn-primary btn-sm" href="/login">تسجيل الدخول</Link></>}</div><button className="nav-toggle" onClick={() => setOpen(true)} aria-label="فتح القائمة" aria-expanded={open}><Menu /></button>{open && <button className="nav-backdrop" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />}</div></header>;
}
