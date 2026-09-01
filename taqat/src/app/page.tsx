import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSlider } from "@/components/hero-slider";
import { PartnerLogoCard } from "@/components/cards";
import { ButtonLink, SectionTitle } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { ProgramsCarousel } from "@/components/programs-carousel";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { AnimatedStatValue } from "@/components/animated-stat-value";
import { AnimatedStatFlower } from "@/components/animated-stat-flower";
import { HOMEPAGE_STATS } from "@/lib/homepage-stats";

export default async function HomePage() {
  const [
    slides,
    programs,
    partners,
    testimonials,
    settings,
    beneficiariesCount,
    activePartnersCount,
    publishedProgramsCount,
    satisfactionAgg,
  ] = await Promise.all([
    db.program.findMany({
      where: { status: "PUBLISHED", showInSlider: true },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    // بدون حد أقصى للعدد عمدًا - كل البرامج المميزة تظهر (بعكس شريط
    // الإعلانات اللي محدود بـ5 كحد أقصى، مقيّد فعليًا من كرت الأدمن نفسه)
    db.program.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { _count: { select: { registrations: true } } },
      orderBy: { startDate: "desc" },
    }),
    db.partner.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 4 }),
    db.testimonial.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    getSettings(),
    // مصادر إحصائيات القسم بالأسفل - نفس فلاتر العرض العام المستخدمة فعليًا
    // بأماكن ثانية بالموقع، بدون أي رقم ثابت ولا أي إدخال يدوي من الأدمن
    db.user.count({ where: { registrations: { some: { status: "CONFIRMED" } } } }),
    db.partner.count({ where: { active: true } }),
    db.program.count({ where: { status: "PUBLISHED" } }),
    db.testimonial.aggregate({
      where: { active: true },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);
  // نسبة الرضا = متوسط التقييم (من 5) محوّلًا لنسبة من 100 - لو ما فيه أي
  // تقييم فعّال، النسبة صفر بدل رقم وهمي
  const satisfactionPercent =
    satisfactionAgg._count._all === 0 || satisfactionAgg._avg.rating == null
      ? 0
      : Math.round((satisfactionAgg._avg.rating / 5) * 100);
  const computedStatValues: Record<string, number> = {
    beneficiaries: beneficiariesCount,
    partners: activePartnersCount,
    programs: publishedProgramsCount,
    satisfaction: satisfactionPercent,
  };
  const visibleStats = HOMEPAGE_STATS.filter((stat) => settings[stat.settingKey] !== "false");
  return (
    <>
      <PageHero
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
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
        <section className="page-section partners-decor-section">
          <span className="partners-decor partners-decor-sprig-left" aria-hidden="true">
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
          <span className="partners-decor partners-decor-sprig-right" aria-hidden="true">
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
          <span className="partners-decor-dot partners-decor-dot-a" aria-hidden="true" />
          <span className="partners-decor-dot partners-decor-dot-b" aria-hidden="true" />
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
      {settings.showStatistics === "true" && visibleStats.length > 0 && (
        <section className="page-section soft-section">
          <div className="container">
            <SectionTitle title={settings.statisticsHeading} eyebrow={settings.sectionEyebrow} />
            <div className="grid-4">
              {visibleStats.map((stat) => (
                <div className="stat-card" key={stat.key}>
                  <AnimatedStatFlower />
                  <strong>
                    <AnimatedStatValue
                      value={computedStatValues[stat.key] ?? 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </strong>
                  <span>{stat.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {settings.showTestimonials === "true" && (
        <section className="page-section testimonials-decor-section">
          <span className="testimonials-decor testimonials-decor-sprig-left" aria-hidden="true">
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
          <span className="testimonials-decor testimonials-decor-sprig-right" aria-hidden="true">
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
          <span className="testimonials-decor-dot testimonials-decor-dot-a" aria-hidden="true" />
          <span className="testimonials-decor-dot testimonials-decor-dot-b" aria-hidden="true" />
          <div className="container">
            <SectionTitle
              title={settings.testimonialsHeading}
              subtitle={settings.testimonialsSubtitle}
              eyebrow={settings.sectionEyebrow}
            />
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}
    </>
  );
}
