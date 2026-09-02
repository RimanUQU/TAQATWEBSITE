import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, User, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { formatDate, parseBulletLines, parseFaqPairs } from "@/lib/utils";
import { Badge, Breadcrumb, Card } from "@/components/ui";
import { getPublicImageUrl } from "@/lib/images";
import { FavoriteButton } from "@/components/favorite-button";

const differenceInDays = (end: Date, start: Date) =>
  Math.ceil((end.getTime() - start.getTime()) / 86400000);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    program = await db.program.findUnique({
      where: { slug },
      select: { title: true, shortDescription: true, coverImage: true },
    });
  return program
    ? {
        title: program.title,
        description: program.shortDescription,
        ...(program.coverImage
          ? { openGraph: { images: [getPublicImageUrl(program.coverImage)] } }
          : {}),
      }
    : { title: "البرنامج غير موجود" };
}

export default async function ProgramDetails({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, user] = await Promise.all([params, getUser()]);
  const program = await db.program.findUnique({
    where: { slug },
    include: {
      targetAudience: true,
      registrations: { select: { status: true } },
      favorites: user ? { where: { userId: user.id }, select: { id: true } } : false,
    },
  });
  if (!program || program.status !== "PUBLISHED") notFound();
  const favorited = Boolean(program.favorites?.length);
  const count = program.registrations.filter((item) => item.status === "CONFIRMED").length;
  const goals = parseBulletLines(program.goals);
  const features = parseBulletLines(program.features);
  const requirements = parseBulletLines(program.requirements);
  const faqItems = parseFaqPairs(program.faq);
  return (
    <>
      <section className={`details-hero ${program.coverImage ? "" : "no-image"}`}>
        {program.coverImage && (
          <Image
            src={getPublicImageUrl(program.coverImage)}
            alt={`غلاف ${program.title}`}
            fill
            priority
            sizes="100vw"
          />
        )}
        <div className="container details-hero-inner">
          <div className="details-hero-top">
            <Breadcrumb items={[{ label: "البرامج", href: "/programs" }, { label: program.title }]} />
            <div className="badges" style={{ position: "static" }}>
              <Badge>{program.price === 0 ? "مجاني" : `${program.price} ر.س`}</Badge>
              {program.isNew && <Badge tone="teal">جديد</Badge>}
              <FavoriteButton programId={program.id} slug={program.slug} favorited={favorited} />
            </div>
          </div>
          <h1>{program.title}</h1>
        </div>
      </section>
      <section className="page-section">
        <div className="container two-col">
          <div className="program-detail-section">
            <h2>تفاصيل البرنامج</h2>
            <p>{program.description}</p>
            {goals.length > 0 && (
              <>
                <h3>أهداف البرنامج</h3>
                <ul className="program-detail-list">
                  {goals.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            {features.length > 0 && (
              <>
                <h3>مميزات البرنامج</h3>
                <ul className="program-detail-list">
                  {features.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            {requirements.length > 0 && (
              <>
                <h3>المتطلبات</h3>
                <ul className="program-detail-list">
                  {requirements.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            {faqItems.length > 0 && (
              <>
                <h3>الأسئلة الشائعة</h3>
                <div className="program-faq">
                  {faqItems.map((item, i) => (
                    <details key={i}>
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>
          <Card className="register-box" aria-label="معلومات البرنامج">
            <div className="detail-box">
              <span className="detail-box-icon" aria-hidden="true">
                <Users size={18} />
              </span>
              <span>
                <small>المشاركات</small>
                <strong>
                  {count} من {program.capacity}
                </strong>
              </span>
            </div>
            <div className="detail-box">
              <span className="detail-box-icon" aria-hidden="true">
                <User size={18} />
              </span>
              <span>
                <small>الفئة المستهدفة</small>
                <strong>{program.targetAudience?.name || "غير محدد"}</strong>
              </span>
            </div>
            <div className="detail-box">
              <span className="detail-box-icon" aria-hidden="true">
                <CalendarDays size={18} />
              </span>
              <span>
                <small>التاريخ</small>
                <strong>
                  {formatDate(program.startDate)} – {formatDate(program.endDate)} (
                  {differenceInDays(program.endDate, program.startDate) + 1} أيام)
                </strong>
              </span>
            </div>
            <div className="detail-box">
              <span className="detail-box-icon" aria-hidden="true">
                <MapPin size={18} />
              </span>
              <span>
                <small>الموقع</small>
                <strong>{program.location}</strong>
              </span>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
