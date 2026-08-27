import type { ReactNode } from "react";

/**
 * هيدر مزخرف موحّد لكل صفحات الموقع (وأيضًا الرئيسية).
 * نفس لغة التصميم المستخدمة بصفحة الكادر الوظيفي وصفحة الحساب (شارة علوية،
 * عنوان بخط سفلي متدرج، نص فرعي، رسومات نباتية خفيفة) — بس بكلاسات جديدة
 * (club-hero) مستقلة عن كلاساتهما (staff-hero / account-hero) حتى ما نأثر
 * على تلك الصفحتين أو نضطر نلمسهما.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-hero club-hero">
      <span className="club-hero-decor club-hero-sprig-left" aria-hidden="true">
        <svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M75 200 C 70 150, 78 110, 60 70"
            stroke="var(--pink-400)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="60" cy="70" rx="16" ry="10" fill="var(--teal-500)" transform="rotate(-35 60 70)" />
          <ellipse cx="72" cy="96" rx="14" ry="9" fill="var(--pink-400)" transform="rotate(-20 72 96)" />
          <ellipse cx="68" cy="130" rx="15" ry="9" fill="var(--teal-300)" transform="rotate(-30 68 130)" />
          <ellipse cx="78" cy="160" rx="13" ry="8" fill="var(--pink-300)" transform="rotate(-15 78 160)" />
        </svg>
      </span>
      <span className="club-hero-decor club-hero-sprig-right" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 90 C 30 70, 45 55, 55 20"
            stroke="var(--teal-500)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="55" cy="20" rx="11" ry="7" fill="var(--pink-400)" transform="rotate(-40 55 20)" />
          <ellipse cx="44" cy="42" rx="10" ry="6" fill="var(--teal-300)" transform="rotate(-25 44 42)" />
        </svg>
      </span>
      <span className="club-hero-dot club-hero-dot-a" aria-hidden="true" />
      <span className="club-hero-dot club-hero-dot-b" aria-hidden="true" />
      <div className="container">
        <div className="club-hero-inner">
          {eyebrow && (
            <span className="club-hero-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 21c0-7-4-12-8-13 1 7 4 12 8 13Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {eyebrow}
            </span>
          )}
          <h1>{title}</h1>
          {subtitle && <p className="club-hero-sub">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
