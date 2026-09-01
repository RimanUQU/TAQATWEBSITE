"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "./cards";
import { CarouselProgramCard } from "./carousel-program-card";

// نفس نوع بيانات program اللي يتوقعه ProgramCard بالضبط، بدون أي تعديل على cards.tsx
// نفسه ولا حتى تصدير نوع جديد منه - الكاروسيل مكوّن خارجي مستقل تمامًا يغلّف
// ProgramCard كما هو.
type CarouselProgram = Parameters<typeof ProgramCard>[0]["program"];

const MAX_VISIBLE_DISTANCE = 3; // أبعد من كذا بطاقات نخفيها تمامًا (أداء + وضوح)
const SWIPE_THRESHOLD = 40; // بكسل، أقل مسافة سحب باللمس عشان نعتبرها تنقّل

/**
 * كاروسيل "البرامج المميزة" بالرئيسية - كاروسيل ثلاثي الأبعاد (Coverflow):
 * البطاقة النشطة بالمنتصف كبيرة وبالمقدمة، والبقية تصغر وتدور وتتراجع للخلف
 * كأنها مصفوفة على قوس دائري، كل ما ابتعدت عن المنتصف. الضغط على أي بطاقة
 * غير نشطة يجيبها هي للمنتصف (بدل ما يفتح صفحتها مباشرة)، والبطاقة النشطة
 * نفسها تشتغل بسلوكها المعتاد (فتح الصفحة / كشف التفاصيل باللمس بالجوال).
 */
export function ProgramsCarousel({ programs }: { programs: CarouselProgram[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // نحسب "موبايل أو لا" بعد أول تصيير بس (مو أثناء SSR)، عشان ما يصير تعارض
  // بين HTML اللي يجهزه السيرفر وأول تصيير بالمتصفح (Hydration Mismatch).
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function goTo(index: number) {
    setActiveIndex(index);
  }

  // تنقّل دائري (بدون نهاية): من آخر بطاقة "التالي" يرجعنا لأول بطاقة،
  // ومن أول بطاقة "السابق" يودينا لآخر بطاقة - نفس فكرة الحركة الدائرية.
  function navigate(direction: "next" | "prev") {
    const n = programs.length;
    goTo(direction === "next" ? (activeIndex + 1) % n : (activeIndex - 1 + n) % n);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    // بالـRTL: سحب لليمين (delta موجب) = "السابق"، سحب لليسار = "التالي"
    navigate(delta > 0 ? "prev" : "next");
  }

  if (!programs.length) return null;

  return (
    <div className="programs-carousel">
      {programs.length > 1 && (
        <button
          type="button"
          className="programs-carousel-arrow programs-carousel-prev"
          onClick={() => navigate("prev")}
          aria-label="البرنامج السابق"
        >
          <ChevronRight />
        </button>
      )}
      <div
        className="programs-carousel-track"
        role="list"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {programs.map((program, index) => {
          const n = programs.length;
          let distance = index - activeIndex;
          // نختار أقصر مسافة على "الدائرة" (يمين أو يسار) بدل المسافة الخطية
          // العادية، عشان أول/آخر بطاقة توصل لبعض بسلاسة وما يبان فراغ.
          if (distance > n / 2) distance -= n;
          else if (distance < -n / 2) distance += n;
          const absDistance = Math.abs(distance),
            sign = Math.sign(distance),
            hidden = absDistance > MAX_VISIBLE_DISTANCE,
            depth = isMobile ? absDistance * 70 : absDistance * 150,
            rotate = isMobile ? sign * -14 : sign * -26,
            scale = Math.max(1 - absDistance * 0.14, 0.6),
            opacity = hidden ? 0 : Math.max(1 - absDistance * 0.3, 0);
          return (
            <div
              key={program.slug}
              role="listitem"
              className={`programs-carousel-slide ${index === activeIndex ? "active" : ""}`}
              style={{
                transform: `translateX(calc(-50% + ${distance} * 60%)) translateZ(${-depth}px) rotateY(${rotate}deg) scale(${scale})`,
                opacity,
                zIndex: 100 - absDistance,
                pointerEvents: hidden ? "none" : "auto",
              }}
              onClickCapture={(e) => {
                if (index === activeIndex) return;
                e.preventDefault();
                e.stopPropagation();
                goTo(index);
              }}
            >
              <CarouselProgramCard program={program} />
            </div>
          );
        })}
      </div>
      {programs.length > 1 && (
        <button
          type="button"
          className="programs-carousel-arrow programs-carousel-next"
          onClick={() => navigate("next")}
          aria-label="البرنامج التالي"
        >
          <ChevronLeft />
        </button>
      )}
    </div>
  );
}
