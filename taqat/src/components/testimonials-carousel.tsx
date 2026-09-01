"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "./cards";

type Testimonial = Parameters<typeof TestimonialCard>[0]["item"] & { id: string };

/**
 * "قالوا عنا" بالرئيسية - بطاقة التستيمونيال نفسها بدون أي تعديل على شكلها
 * (نفس .testimonial الأصلي بالضبط). التحريك بس: بطاقة نشطة بالمنتصف واضحة،
 * والمجاورة تبين جزئيًا من الطرفين (بروز)، بنفس مبدأ كاروسيل البرامج الأول
 * (تمرير أفقي أصيل بالمتصفح + scroll-snap، يشتغل صح باللمس والسحب بالماوس
 * تلقائيًا بدون كود إضافي). الأسهم فوق منطقة البروز مباشرة، حركة دائرية
 * مستمرة تشمل كل الآراء المفعّلة من لوحة التحكم.
 */
export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function navigate(direction: "next" | "prev") {
    const n = testimonials.length;
    scrollToIndex(direction === "next" ? (activeIndex + 1) % n : (activeIndex - 1 + n) % n);
  }

  // نحدد البطاقة "النشطة" حسب أقرب بطاقة لمنتصف منطقة العرض أثناء التمرير.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    function updateActiveFromScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track) return;
        const viewCenter = track.scrollLeft + track.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        Array.from(track.children).forEach((child, index) => {
          const el = child as HTMLElement;
          const elCenter = el.offsetLeft + el.offsetWidth / 2;
          const distance = Math.abs(elCenter - viewCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        setActiveIndex(closestIndex);
      });
    }
    track.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      track.removeEventListener("scroll", updateActiveFromScroll);
      cancelAnimationFrame(frame);
    };
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <div className="testimonials-peek">
      <div className="testimonials-peek-track" ref={trackRef} role="list">
        {testimonials.map((t, index) => (
          <div
            key={t.id}
            role="listitem"
            className={`testimonials-peek-slide ${index === activeIndex ? "active" : ""}`}
          >
            <TestimonialCard item={t} />
          </div>
        ))}
      </div>
      {testimonials.length > 1 && (
        <>
          <button
            type="button"
            className="testimonials-peek-arrow testimonials-peek-prev"
            onClick={() => navigate("prev")}
            aria-label="الرأي السابق"
          >
            <ChevronRight />
          </button>
          <button
            type="button"
            className="testimonials-peek-arrow testimonials-peek-next"
            onClick={() => navigate("next")}
            aria-label="الرأي التالي"
          >
            <ChevronLeft />
          </button>
        </>
      )}
    </div>
  );
}
