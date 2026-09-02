import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
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
    // مضاعف عدد أعمدة .programs-listing-grid (4 بالديسكتوب) - يضمن صفوف
    // كاملة دايمًا بدل صف أخير ناقص يبين وكأن فيه مكان فاضي ما استُخدم
    take = 8;
  const where = {
    status: "PUBLISHED" as const,
    ...(sp.q
      ? { OR: [{ title: { contains: sp.q } }, { shortDescription: { contains: sp.q } }] }
      : {}),
    ...(sp.category ? { category: { slug: sp.category } } : {}),
  };
  const isFiltered = Boolean(sp.q || sp.category);
  // نبني رابط الأساس للترقيم بحيث يحافظ على كل من البحث والتصنيف مع بعض -
  // قبل كذا كان التصنيف يضيع لو انتقلتِ لصفحة ثانية أثناء التصفية
  const baseParams = new URLSearchParams();
  if (sp.q) baseParams.set("q", sp.q);
  if (sp.category) baseParams.set("category", sp.category);
  const baseQuery = baseParams.toString();
  const paginationBase = `/programs${baseQuery ? `?${baseQuery}` : ""}`;
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
            <div className="search-input-wrap">
              <Input
                name="q"
                defaultValue={sp.q}
                placeholder="ابحثي باسم البرنامج..."
                aria-label="البحث في البرامج"
                enterKeyHint="search"
              />
              {/* بدون زر "بحث وتصفية" الكبير - البحث يصير بالإنتر (بالجوال زر
                  "بحث" بلوحة المفاتيح نفسه يشتغل)، أو بالضغط على أيقونة العدسة هذي */}
              <button className="search-submit" type="submit" aria-label="بحث">
                <Search size={18} />
              </button>
            </div>
            <Select name="category" defaultValue={sp.category} aria-label="تصفية حسب التصنيف">
              <option value="">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </form>
          {isFiltered && (
            <p className="search-active-note">
              {total} نتيجة مطابقة
              <Link className="card-link" href="/programs">
                عرض جميع البرامج ←
              </Link>
            </p>
          )}
          {programs.length ? (
            <>
              <div className="grid-3 programs-listing-grid">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
              <Pagination page={page} total={Math.ceil(total / take)} base={paginationBase} />
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
