import type { Metadata } from "next";
import { db } from "@/lib/db";
import { StaffCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "الكادر الوظيفي" };

export default async function StaffPage() {
  const groups = await db.staffGroup.findMany({
    orderBy: { displayOrder: "asc" },
    include: { members: { where: { active: true }, orderBy: { displayOrder: "asc" } } },
  });
  const hasMembers = groups.some((group) => group.members.length);

  let sectionIndex = 0;

  return (
    <>
      <div className="page-hero staff-hero">
        <span className="blob-a" aria-hidden="true" />
        <span className="blob-b" aria-hidden="true" />
        <span className="blob-c" aria-hidden="true" />
        <div className="container">
          <h1>الكادر الوظيفي</h1>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          {hasMembers ? (
            <div className="staff-groups">
              {groups.map((group) => {
                if (!group.members.length) return null;

                const tone: "pink" | "teal" = sectionIndex === 0 ? "pink" : "teal";
                const isLead = sectionIndex === 0;
                sectionIndex += 1;

                return (
                  <section
                    key={group.id}
                    className={`staff-section${group.name ? "" : " staff-section-unnamed"}`}
                  >
                    {group.name && <h2 className="staff-group-title">{group.name}</h2>}
                    <div className={`staff-grid${isLead ? " staff-grid-lg" : ""}`}>
                      {group.members.map((member) => (
                        <StaffCard key={member.id} member={member} tone={tone} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <EmptyState title="سيتم تحديث الفريق قريبًا" text="نعود إليك بمعلومات فريقنا." />
          )}
        </div>
      </section>
    </>
  );
}
