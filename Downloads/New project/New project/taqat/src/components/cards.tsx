import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge, Card } from "./ui";
import { formatDate } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/images";

type ProgramCardData = {
  slug: string;
  title: string;
  shortDescription: string;
  cardImage: string;
  startDate: Date;
  location: string;
  capacity: number;
  price: number;
  isNew: boolean;
  _count: { registrations: number };
};

export function ProgramCard({ program }: { program: ProgramCardData }) {
  return (
    <Card className="program-card">
      <Link
        href={`/programs/${program.slug}`}
        className={`card-image ${program.cardImage ? "" : "no-image"}`}
      >
        {program.cardImage ? (
          <Image
            src={getPublicImageUrl(program.cardImage)}
            alt={`صورة برنامج ${program.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="image-empty" aria-hidden="true">
            طاقات
          </span>
        )}
        <div className="badges">
          <Badge>{program.price === 0 ? "مجاني" : "مدفوع"}</Badge>
          {program.isNew && <Badge tone="teal">جديد</Badge>}
        </div>
      </Link>
      <div className="card-body">
        <h3>
          <Link href={`/programs/${program.slug}`}>{program.title}</Link>
        </h3>
        <p>{program.shortDescription}</p>
        <div className="card-meta">
          <span>
            <CalendarDays /> {formatDate(program.startDate)}
          </span>
          <span>
            <MapPin /> {program.location}
          </span>
          <span>
            <Users /> {program._count.registrations} / {program.capacity}
          </span>
        </div>
        <Link className="card-link" href={`/programs/${program.slug}`}>
          استكشف البرنامج <span>←</span>
        </Link>
      </div>
    </Card>
  );
}

export function StaffCard({
  member,
  tone = "teal",
}: {
  member: { name: string; jobTitle: string; icon: string };
  tone?: "pink" | "teal";
}) {
  return (
    <Card className={`staff-card${tone === "pink" ? " staff-card-pink" : ""}`}>
      <div className="card-body">
        <div className="staff-icon-wrap">
          <span className="staff-mark" aria-hidden="true">
            <img src={member.icon || "/staff-icons/neutral.svg"} alt="" />
          </span>
        </div>
        <h3>{member.jobTitle}</h3>
        <span className="staff-divider" aria-hidden="true" />
        <p className="staff-name">{member.name}</p>
      </div>
    </Card>
  );
}

export function TestimonialCard({
  item,
}: {
  item: { quote: string; name: string; title: string | null; rating: number };
}) {
  return (
    <Card className="testimonial">
      <div className="quote">“</div>
      <p>{item.quote}</p>
      <div className="stars" aria-label={`${item.rating} من 5`}>
        {"★".repeat(item.rating)}
      </div>
      <strong>{item.name}</strong>
      {item.title && <small>{item.title}</small>}
    </Card>
  );
}

export function PartnerLogoCard({
  item,
}: {
  item: { name: string; logo: string; url: string | null };
}) {
  const content = (
    <>
      {item.logo && (
        <Image
          src={getPublicImageUrl(item.logo)}
          alt={`شعار ${item.name}`}
          width={120}
          height={70}
        />
      )}
      <span>{item.name}</span>
    </>
  );
  return (
    <Card className="partner-card">
      {item.url ? <a href={item.url}>{content}</a> : content}
    </Card>
  );
}
