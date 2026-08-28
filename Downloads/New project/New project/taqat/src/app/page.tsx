import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeroSlider } from "@/components/hero-slider";
import { PartnerLogoCard, ProgramCard, TestimonialCard } from "@/components/cards";
import { ButtonLink, SectionTitle } from "@/components/ui";

export default async function HomePage() {
  const [slides, programs, partners, statistics, testimonials, featuredComments, settings] = await Promise.all([
    db.program.findMany({ where: { status: "PUBLISHED", showInSlider: true }, orderBy: { startDate: "desc" }, take: 5 }),
    db.program.findMany({ where: { status: "PUBLISHED" }, include: { _count: { select: { registrations: true } } }, orderBy: { startDate: "desc" }, take: 3 }),
    db.partner.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 4 }),
    db.statistic.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    db.testimonial.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" }, take: 3 }),
    db.programComment.findMany({ where: { status: "APPROVED", featured: true }, include: { user: true, program: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    getSettings(),
  ]);
  return <><HeroSlider slides={slides} />
    {settings.showPrograms === "true" && <section className="page-section soft-section"><div className="container"><SectionTitle title={settings.programsHeading} subtitle="مساحات آمنة وتجارب عملية تساعدك على اكتشاف قدراتك وبناء مهاراتك." /><div className="grid-3">{programs.map((p) => <ProgramCard key={p.id} program={p} />)}</div><div style={{textAlign:"center",marginTop:30}}><ButtonLink href="/programs" variant="outline">عرض جميع البرامج</ButtonLink></div></div></section>}
    {settings.showPartners === "true" && <section className="page-section"><div className="container"><SectionTitle title={settings.partnersHeading} subtitle="شركاء النجاح... ممتنون دائمًا لدعمكم وثقتكم برسالتنا." /><div className="grid-4">{partners.map((p) => <PartnerLogoCard key={p.id} item={p} />)}</div><p style={{textAlign:"center",marginTop:24}}><Link className="card-link" href="/about">تعرّفي على رحلة طاقات ←</Link></p></div></section>}
    {settings.showStatistics === "true" && <section className="page-section soft-section"><div className="container"><SectionTitle title={settings.statisticsHeading} /><div className="grid-4">{statistics.map((s) => <div className="stat-card" key={s.id}><strong>{s.prefix}{s.value.toLocaleString("ar-SA")}{s.suffix}</strong><span>{s.title}</span></div>)}</div></div></section>}
    {settings.showTestimonials === "true" && <section className="page-section"><div className="container"><SectionTitle title={settings.testimonialsHeading} subtitle="آراء وتجارب نعتز بها من مستفيدات مجتمع طاقات." /><div className="grid-3">{[...featuredComments.map((c) => ({ id: `comment-${c.id}`, quote: c.body, name: c.user.name, title: c.program.title, rating: 5 })), ...testimonials].slice(0, 3).map((t) => <TestimonialCard key={t.id} item={t} />)}</div></div></section>}
  </>;
}
