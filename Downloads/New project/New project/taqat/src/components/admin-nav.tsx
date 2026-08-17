import Link from "next/link";

const items = [
  ["/admin", "لوحة التحكم"], ["/admin/settings", "الإعدادات العامة"], ["/admin/homepage", "الصفحة الرئيسية"],
  ["/admin/programs", "البرامج"], ["/admin/partners", "الشركاء"], ["/admin/statistics", "الإحصائيات"],
  ["/admin/testimonials", "قالوا عنا"], ["/admin/staff", "الكادر الوظيفي"], ["/admin/about", "من نحن"],
  ["/admin/comments", "تعليقات البرامج"], ["/admin/users", "المستخدمون"], ["/admin/registrations", "التسجيلات"], ["/account", "الحساب"],
];
export function AdminLinks(){return <>{items.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</>}
