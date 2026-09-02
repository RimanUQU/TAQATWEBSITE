"use client";
import Image from "next/image";
import Link from "next/link";
import { getPublicImageUrl } from "@/lib/images";
import { useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string | null;
  backgroundColor: string;
};
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0),
    [paused, setPaused] = useState(false),
    touch = useRef<number | null>(null);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setCurrent((value) => (value + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);
  if (!slides.length) return null;
  const move = (step: number) => setCurrent((current + step + slides.length) % slides.length);
  return (
    <section
      className="container hero-slider"
      aria-roledescription="carousel"
      aria-label="أحدث البرامج"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => (touch.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (
          touch.current !== null &&
          Math.abs(event.changedTouches[0].clientX - touch.current) > 45
        )
          move(event.changedTouches[0].clientX > touch.current ? 1 : -1);
        touch.current = null;
      }}
    >
      {slides.map((slide, index) => {
        // صورة الإعلان المخصصة لشريط الإعلانات أولًا، ولو ما رُفعت بعد
        // نستخدم صورة الكارد كحل احتياطي مؤقت بدل ما يطلع الشريط فاضي
        const image = slide.bannerImage || slide.coverImage;
        return (
          <article
            key={slide.id}
            className={`hero-slide ${index === current ? "active" : ""}`}
            aria-hidden={index !== current}
            // نفس لون البرنامج المحدد من لوحة التحكم - يبان أثناء تحميل
            // الصورة أو لو ما فيه صورة إطلاقًا
            style={{ backgroundColor: slide.backgroundColor }}
          >
            {/* الإعلان كامل صار رابط - بدون زر "عرض التفاصيل" منفصل، أي ضغطة
                على الصورة نفسها توديك لصفحة البرنامج مباشرة */}
            <Link
              href={`/programs/${slide.slug}`}
              className="hero-slide-link"
              tabIndex={index === current ? 0 : -1}
              aria-label={`عرض تفاصيل الإعلان ${index + 1}`}
            >
              {image && (
                <Image
                  src={getPublicImageUrl(image)}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                />
              )}
            </Link>
            {slides.length > 1 && (
              <div className="hero-dots" role="tablist" aria-label="اختيار البرنامج المعروض">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`عرض الإعلان ${i + 1}`}
                    className={i === current ? "active" : ""}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
