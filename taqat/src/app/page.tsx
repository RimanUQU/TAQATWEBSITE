import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSlider } from "@/components/hero-slider";
import { PartnerLogoCard, ProgramCard, TestimonialCard } from "@/components/cards";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { PageHero } from "@/components/page-hero";

export default async function HomePage() {
  const [slides, programs, partners, statistics, testimonials, settings] = await Promise.all([
    db.program.findMany({
      where: { status: "PUBLISHED", showInSlider: true },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    db.program.findMany({
      where: { status: "PUBLISHED" },
      include: { _count: { select: { registrations: true } } },
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
      take: 3,
    }),
    db.partner.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 4 }),
    db.statistic.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    db.testimonial.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 3 }),
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
            <div className="grid-3">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
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
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} item={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
