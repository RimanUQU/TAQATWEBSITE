import type { Metadata } from "next";
import { db } from "@/lib/db";
import { FeedbackForm } from "@/components/feedback-form";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = { title: "شاركينا رأيك" };

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "الرجاء إدخال بريد إلكتروني صحيح.",
  message_short: "رأيك قصير جدًا، أضيفي بعض التفاصيل من فضلك.",
  missing_program: "الرجاء اختيار البرنامج الذي يخص رأيك.",
  duplicate: "استلمنا رأيك قبل قليل، شكرًا لتفاعلك 💛",
  too_fast: "حدث خطأ، الرجاء المحاولة مرة أخرى.",
  invalid: "حدث خطأ، الرجاء المحاولة مرة أخرى.",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  const [programs, currentUser] = await Promise.all([
    db.program.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, price: true },
      orderBy: { startDate: "desc" },
    }),
    getUser(),
  ]);

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
              صوتك يهمنا
            </span>
            <h1>شاركينا رأيك</h1>
            <p className="staff-hero-sub">
              رأيك يساعدنا نطوّر طاقات أكثر. اكتبي بصراحة، سواء كان إعجابًا، اقتراحًا، أو ملاحظة تحتاج تحسينًا.
            </p>
          </div>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="two-col">
            <div>
              {sent === "1" && (
                <div className="alert alert-success">
                  شكرًا لمشاركتنا رأيك 🩷 وصل فريق طاقات وبنراجعه قريبًا.
                </div>
              )}
              {error && (
                <div className="alert alert-error">
                  {ERROR_MESSAGES[error] || "حدث خطأ، الرجاء المحاولة مرة أخرى."}
                </div>
              )}

              <FeedbackForm
                programs={programs}
                defaultName={currentUser?.name}
                defaultEmail={currentUser?.email}
              />
            </div>

            <div style={{ position: "sticky", top: 104, display: "grid", gap: 16 }}>
              <div className="card card-body">
                <h3>ليش رأيك يهمنا؟</h3>
                <p>
                  كل رأي يوصلنا يساعد فريق طاقات يفهم شو يعجبكِ وشو يحتاج تطوير، سواء
                  كان عن برنامج معين أو عن تجربتكِ العامة معنا.
                </p>
              </div>
            
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
