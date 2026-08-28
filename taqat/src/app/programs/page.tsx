import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProgramCard } from "@/components/cards";
import { EmptyState, Input, Pagination, Select } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
export const metadata: Metadata = {
  title: "البرامج",
  description: "تصفحي برامج نادي طاقات للفتيات وسجلي في البرنامج الأنسب لك.",
};
export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1),
    take = 6;
  const where = {
    status: "PUBLISHED" as const,
    ...(sp.q
      ? { OR: [{ title: { contains: sp.q } }, { shortDescription: { contains: sp.q } }] }
      : {}),
    ...(sp.category ? { category: { slug: sp.category } } : {}),
  };
  const [programs, total, categories] = await Promise.all([
    db.program.findMany({
      where,
      include: { _count: { select: { registrations: true } } },
      orderBy: { startDate: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    db.program.count({ where }),
    db.programCategory.findMany(),
  ]);
  return (
    <>
      <PageHero title="تصفّح البرامج" subtitle="اكتشفي تجربة تناسب شغفك وخطوتك القادمة." />
      <section className="page-section">
        <div className="container">
          <form className="search-bar" role="search">
            <Input
              name="q"
              defaultValue={sp.q}
              placeholder="ابحثي باسم البرنامج..."
              aria-label="البحث في البرامج"
            />
            <Select name="category" defaultValue={sp.category} aria-label="تصفية حسب التصنيف">
              <option value="">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
            <button className="btn btn-primary" type="submit">
              بحث وتصفية
            </button>
          </form>
          {programs.length ? (
            <>
              <div className="grid-3 programs-listing-grid">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
              <Pagination
                page={page}
                total={Math.ceil(total / take)}
                base={`/programs${sp.q ? `?q=${encodeURIComponent(sp.q)}` : ""}`}
              />
            </>
          ) : (
            <EmptyState
              title="لا توجد نتائج"
              text={sp.q ? "لم يتم العثور على برامج مطابقة لبحثك." : "لا توجد برامج متاحة حاليًا."}
            />
          )}
        </div>
      </section>
    </>
  );
}
