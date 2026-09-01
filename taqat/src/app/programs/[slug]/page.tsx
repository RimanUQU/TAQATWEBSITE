import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
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
      category: true,
      targetAudience: true,
      registrations: { select: { status: true } },
      favorites: user ? { where: { userId: user.id }, select: { id: true } } : false,
    },
  });
  if (!program || program.status !== "PUBLISHED") notFound();
  const favorited = Boolean(program.favorites?.length);
  const count = program.registrations.filter((item) => item.status === "CONFIRMED").length;
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
        <div className="container">
          <Breadcrumb items={[{ label: "البرامج", href: "/programs" }, { label: program.title }]} />
          <div className="badges" style={{ position: "static", marginBottom: 12 }}>
            <Badge>{program.price === 0 ? "مجاني" : `${program.price} ر.س`}</Badge>
            {program.isNew && <Badge tone="teal">جديد</Badge>}
            <FavoriteButton programId={program.id} slug={program.slug} favorited={favorited} />
          </div>
          <h1>{program.title}</h1>
          <p>{program.shortDescription}</p>
        </div>
      </section>
      <section className="page-section">
        <div className="container two-col">
          <div>
            <h2>عن البرنامج</h2>
            <p>{program.description}</p>
            <h2>تفاصيل البرنامج</h2>
            <div className="details-list">
              <div className="detail-box">
                <small>التاريخ</small>
                <strong>
                  {formatDate(program.startDate)} – {formatDate(program.endDate)} (
                  {differenceInDays(program.endDate, program.startDate) + 1} أيام)
                </strong>
              </div>
              <div className="detail-box">
                <small>الموقع</small>
                <strong>{program.location}</strong>
              </div>
              <div className="detail-box">
                <small>التصنيف</small>
                <strong>{program.category?.name || "عام"}</strong>
              </div>
            </div>
          </div>
          <Card className="register-box">
            <h2>معلومات البرنامج</h2>
            <div className="detail-box">
              <small>المشاركات</small>
              <strong>
                {count} من {program.capacity}
              </strong>
            </div>
            <div className="detail-box">
              <small>الفئة المستهدفة</small>
              <strong>{program.targetAudience?.name || "غير محدد"}</strong>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
