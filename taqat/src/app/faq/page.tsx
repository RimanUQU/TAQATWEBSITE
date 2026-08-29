import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
export const metadata: Metadata = { title: "الأسئلة الشائعة" };
const items = [
  [
    "كيف أسجل في أحد البرامج؟",
    "أنشئي حسابًا أو سجلي الدخول، ثم افتحي صفحة البرنامج واضغطي زر التسجيل. ستظهر رسالة تأكيد فور نجاح العملية.",
  ],
  [
    "هل جميع البرامج مجانية؟",
    "تقدم طاقات برامج مجانية ومدفوعة. تظهر حالة السعر بوضوح على بطاقة البرنامج وصفحة التفاصيل.",
  ],
  [
    "هل يمكنني إلغاء تسجيلي؟",
    "تواصلي معنا قبل بداية البرنامج، وسيساعدك الفريق وفق سياسة البرنامج وعدد المقاعد.",
  ],
  [
    "كيف أستعيد كلمة المرور؟",
    "استخدمي صفحة نسيت كلمة المرور وأدخلي بريدك المسجل لتلقي تعليمات الاستعادة.",
  ],
];
export default function FaqPage() {
  return (
    <>
      <PageHero title="الأسئلة الشائعة" subtitle="إجابات سريعة عن أكثر ما يهمك قبل البدء." />
      <section className="page-section">
        <div className="container faq" style={{ maxWidth: 850 }}>
          {items.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
