import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSlider } from "@/components/hero-slider";
import { PartnerLogoCard, TestimonialCard } from "@/components/cards";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { ProgramsCarousel } from "@/components/programs-carousel";

export default async function HomePage() {
  const [slides, programs, partners, statistics, testimonials, featuredComments, settings] =
    await Promise.all([
    db.program.findMany({
      where: { status: "PUBLISHED", showInSlider: true },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    db.program.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { _count: { select: { registrations: true } } },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    db.partner.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 4 }),
    db.statistic.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    db.testimonial.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 3 }),
    // نفس ميزة "التعليقات المُبرزة" اللي بنتها غلا - تعليقات معتمدة اختارت
    // الأدمن تبرزها، تنعرض مع آراء العميلات بالرئيسية
    db.programComment.findMany({
      where: { status: "APPROVED", featured: true },
      include: { user: true, program: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getSettings(),
  ]);
  return (
    <>
      <PageHero
        eyebrow="جمعية طاقات الشبابية – مكة المكرمة"
        title="نادي طاقات للفتيات"
        subtitle="مركز تربوي يفتح لكِ أبواب النمو والانطلاق، ينمّي مهاراتكِ ويرسّخ قيمكِ ضمن بيئة آمنة وجاذبة تواكب روح العصر — لتكتشفي طاقتكِ الحقيقية وتصنعي أثرك الخاص معنا."
      />
      <HeroSlider slides={slides} />
      {settings.showPrograms === "true" && (
        <section className="page-section soft-section">
          <div className="container">
            <SectionTitle
              title={settings.programsHeading}
              subtitle={settings.programsSubtitle}
              eyebrow={settings.sectionEyebrow}
            />
            <ProgramsCarousel programs={programs} />
            <div className="home-section-cta">
              <ButtonLink href="/programs" variant="outline">
                {settings.programsCta}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
      {settings.showPartners === "true" && (
        <section className="page-section">
          <div className="container">
            <SectionTitle
              title={settings.partnersHeading}
              subtitle={settings.partnersSubtitle}
              eyebrow={settings.sectionEyebrow}
            />
            <div className="grid-4">
              {partners.map((p) => (
                <PartnerLogoCard key={p.id} item={p} />
              ))}
            </div>
            <p className="home-section-cta">
              <Link className="card-link" href="/about">
                {settings.partnersCta}
              </Link>
            </p>
          </div>
        </section>
      )}
      {settings.showStatistics === "true" && (
        <section className="page-section soft-section">
          <div className="container">
            <SectionTitle title={settings.statisticsHeading} eyebrow={settings.sectionEyebrow} />
            <div className="grid-4">
              {statistics.map((s) => (
                <div className="stat-card" key={s.id}>
                  <strong>
                    {s.prefix}
                    {s.value.toLocaleString("ar-SA")}
                    {s.suffix}
                  </strong>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {settings.showTestimonials === "true" && (
        <section className="page-section">
          <div className="container">
            <SectionTitle
              title={settings.testimonialsHeading}
              subtitle={settings.testimonialsSubtitle}
              eyebrow={settings.sectionEyebrow}
            />
            <div className="grid-3">
              {[
                ...featuredComments.map((c) => ({
                  id: `comment-${c.id}`,
                  quote: c.body,
                  name: c.user.name,
                  title: c.program.title,
                  rating: 5,
                })),
                ...testimonials,
              ]
                .slice(0, 3)
                .map((t) => (
                  <TestimonialCard key={t.id} item={t} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
