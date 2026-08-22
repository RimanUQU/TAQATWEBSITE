import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SectionTitle, Card } from "@/components/ui";
export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرّفي على رؤية ورسالة نادي طاقات للفتيات.",
};
export default async function AboutPage() {
  const about = await db.aboutContent.findUnique({ where: { id: "main" } });
  if (!about) return null;
  const parts = [
    ["نبذة عن النادي", about.introduction],
    ["رؤيتنا", about.vision],
    ["رسالتنا", about.mission],
    ["أهدافنا", about.goals],
    ["قيمنا", about.values],
  ];
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">حكايتنا</span>
          <h1>من نحن</h1>
          <p>نؤمن أن في كل فتاة طاقة تستحق المساحة والدعم لتتحول إلى أثر.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          <SectionTitle title="نصنع الفرص، ونحتفي بالإنجاز" />
          <div className="content-cards">
            {parts.map(([title, text], i) => (
              <Card className="content-card" key={title}>
                <span className="badge badge-teal">0{i + 1}</span>
                <h2>{title}</h2>
                <p>{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
