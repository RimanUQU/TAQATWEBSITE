import type { Metadata } from "next";
import { db } from "@/lib/db";
import { StaffGrid } from "@/components/staff-grid";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "الكادر الوظيفي" };

export default async function StaffPage() {
  const groups = await db.staffGroup.findMany({
    orderBy: { displayOrder: "asc" },
    include: { members: { where: { active: true }, orderBy: { displayOrder: "asc" } } },
  });
  const hasMembers = groups.some((group) => group.members.length);

  const groupsWithMembers = groups.filter((group) => group.members.length > 0);

  return <>
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
          <h1>الكادر الوظيفي</h1>
          <p className="staff-hero-sub">الفريق الذي يقف خلف أنشطة وبرامج النادي ويرافقكِ في رحلتك معنا.</p>
        </div>
      </div>
    </div>
    <section className="page-section">
      <div className="container">
        {hasMembers ? (
          <div className="staff-groups">
            {groupsWithMembers.map((group, sectionIndex) => {
              const tone: "pink" | "teal" = sectionIndex === 0 ? "pink" : "teal";
              const isLead = sectionIndex === 0;

              return (
                <section key={group.id} className={`staff-section${group.name ? "" : " staff-section-unnamed"}`}>
                  {group.name && <h2 className="staff-group-title">{group.name}</h2>}
                  <StaffGrid members={group.members} tone={tone} isLead={isLead} />
                </section>
              );
            })}
          </div>
        ) : (
          <EmptyState title="سيتم تحديث الفريق قريبًا" text="نعود إليك بمعلومات فريقنا." />
        )}
      </div>
    </section>
  </>;
}
