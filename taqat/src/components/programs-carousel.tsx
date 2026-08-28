"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "./cards";
import { CarouselProgramCard } from "./carousel-program-card";

// نفس نوع بيانات program اللي يتوقعه ProgramCard بالضبط، بدون أي تعديل على cards.tsx
// نفسه ولا حتى تصدير نوع جديد منه - الكاروسيل مكوّن خارجي مستقل تمامًا يغلّف
// ProgramCard كما هو.
type CarouselProgram = Parameters<typeof ProgramCard>[0]["program"];

/**
 * كاروسيل "البرامج المميزة" بالرئيسية - البطاقة النشطة بالمنتصف أكبر شوي،
 * والمجاورة أصغر وتبين جزئيًا. يعتمد على تمرير أفقي أصيل بالمتصفح
 * (scroll-snap) بدل حساب السحب يدويًا، فيشتغل صح باللمس على الجوال والسحب
 * بالماوس على الديسكتوب من غير أي كود إضافي، والأسهم تتحكم بنفس التمرير.
 */
export function ProgramsCarousel({ programs }: { programs: CarouselProgram[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function navigate(direction: "next" | "prev") {
    const target =
      direction === "next"
        ? Math.min(activeIndex + 1, programs.length - 1)
        : Math.max(activeIndex - 1, 0);
    scrollToIndex(target);
  }

  // نحدد البطاقة "النشطة" حاليًا حسب أقرب بطاقة لمنتصف منطقة العرض أثناء
  // التمرير (بدل ما نطلب من المستخدم يفلت السحب بالضبط على بطاقة معينة).
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
  }, [programs.length]);

  if (!programs.length) return null;

  return (
    <div className="programs-carousel">
      {programs.length > 1 && (
        <button
          type="button"
          className="programs-carousel-arrow programs-carousel-prev"
          onClick={() => navigate("prev")}
          disabled={activeIndex === 0}
          aria-label="البرنامج السابق"
        >
          <ChevronRight />
        </button>
      )}
      <div className="programs-carousel-track" ref={trackRef} role="list">
        {programs.map((program, index) => (
          <div
            key={program.slug}
            role="listitem"
            className={`programs-carousel-slide ${index === activeIndex ? "active" : ""}`}
          >
            <CarouselProgramCard program={program} />
          </div>
        ))}
      </div>
      {programs.length > 1 && (
        <button
          type="button"
          className="programs-carousel-arrow programs-carousel-next"
          onClick={() => navigate("next")}
          disabled={activeIndex === programs.length - 1}
          aria-label="البرنامج التالي"
        >
          <ChevronLeft />
        </button>
      )}
      {programs.length > 1 && (
        <div className="programs-carousel-dots" role="tablist" aria-label="اختيار البرنامج المعروض">
          {programs.map((program, index) => (
            <button
              key={program.slug}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`عرض برنامج ${program.title}`}
              className={index === activeIndex ? "active" : ""}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
