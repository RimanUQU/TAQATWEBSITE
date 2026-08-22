"use client";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/images";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      className="hero-slider"
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
          {slide.coverImage && (
            <Image
              src={getPublicImageUrl(slide.coverImage)}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
            />
          )}
          <div className="container hero-content">
            <Badge tone="teal">{slide.price === 0 ? "برنامج مجاني" : "برنامج مدفوع"}</Badge>
            <h1>{slide.title}</h1>
            <p>{slide.shortDescription}</p>
            <ButtonLink href={`/programs/${slide.slug}`} size="lg">
              عرض التفاصيل <ChevronLeft size={19} />
            </ButtonLink>
          </div>
        </article>
      ))}
      {slides.length > 1 && (
        <div className="hero-controls">
          <button onClick={() => move(1)} aria-label="البرنامج التالي">
            <ChevronRight />
          </button>
          <button onClick={() => move(-1)} aria-label="البرنامج السابق">
            <ChevronLeft />
          </button>
        </div>
      )}
    </section>
  );
}
