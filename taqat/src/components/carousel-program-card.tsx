"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "./ui";
import { formatDate } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/images";
import type { ProgramCard } from "./cards";

type CarouselProgram = Parameters<typeof ProgramCard>[0]["program"];

/**
 * بطاقة "بوستر" خاصة بكاروسيل البرامج المميزة بالرئيسية بس (ما تُستخدم
 * بصفحة البرامج ولا لوحة الأدمن - ProgramCard الأصلي يبقى كما هو تمامًا،
 * بدون أي تعديل). الصورة/اللون يملآن البطاقة بالكامل، وتفاصيل البرنامج
 * (العنوان، الوصف، البيانات، الزر) تظهر فقط عند تمرير الماوس (ديسكتوب) أو
 * أول لمسة (جوال) - لمسة ثانية على الرابط تفتح صفحة البرنامج فعليًا.
 */
export function CarouselProgramCard({ program }: { program: CarouselProgram }) {
  const [revealed, setRevealed] = useState(false);

  function handleClickCapture(e: React.MouseEvent) {
    const supportsHover =
      typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (!supportsHover && !revealed) {
      // لازم Capture مو Bubble: رابط Next.js <Link> يسوي preventDefault +
      // تنقّل برمجي بنفسه جوا معالج النقر تبعه، اللي يشتغل قبل أي معالج
      // بالعنصر الأب بمرحلة الـbubbling العادية - فلو علّقنا هنا بس، يكون
      // التنقّل صار فعلًا قبل ما توصل الحدث لنا. بمرحلة الـCapture نتدخل
      // قبل ما توصل النقرة لعنصر الرابط نفسه إطلاقًا.
      e.preventDefault();
      e.stopPropagation();
      setRevealed(true);
    }
  }

  return (
    <article
      className={`card carousel-poster-card ${revealed ? "revealed" : ""}`}
      style={{ backgroundColor: program.backgroundColor }}
      onClickCapture={handleClickCapture}
    >
      <Link href={`/programs/${program.slug}`} className="carousel-poster-image">
        {program.cardImage ? (
          <Image
            src={getPublicImageUrl(program.cardImage)}
            alt={`صورة برنامج ${program.title}`}
            fill
            sizes="(max-width: 768px) 78vw, 30vw"
          />
        ) : (
          <span className="image-empty" aria-hidden="true">
            طاقات
          </span>
        )}
      </Link>
      <div className="badges">
        {program.featured && <Badge tone="warn">★ مميز</Badge>}
        <Badge>{program.price === 0 ? "مجاني" : "مدفوع"}</Badge>
        {program.isNew && <Badge tone="teal">جديد</Badge>}
      </div>
      <div className="card-body carousel-poster-panel">
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
    </article>
  );
}
