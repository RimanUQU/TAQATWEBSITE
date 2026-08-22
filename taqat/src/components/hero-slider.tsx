"use client";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/images";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ButtonLink, Badge } from "./ui";

type Slide = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  price: number;
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
      {slides.map((slide, index) => (
        <article
          key={slide.id}
          className={`hero-slide ${index === current ? "active" : ""}`}
          aria-hidden={index !== current}
        >
          <div className="hero-content">
            <div className="hero-text">
              {slide.coverImage && (
                <span className="hero-thumb">
                  <Image
                    src={getPublicImageUrl(slide.coverImage)}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="60px"
                  />
                </span>
              )}
              <Badge tone="teal">{slide.price === 0 ? "برنامج مجاني" : "برنامج مدفوع"}</Badge>
              <h1>{slide.title}</h1>
            </div>
            <div className="hero-actions">
              <ButtonLink href={`/programs/${slide.slug}`} size="sm">
                عرض التفاصيل <ChevronLeft size={16} />
              </ButtonLink>
            </div>
          </div>
          {slides.length > 1 && (
            <div className="hero-dots" role="tablist" aria-label="اختيار البرنامج المعروض">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`عرض برنامج ${s.title}`}
                  className={i === current ? "active" : ""}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
