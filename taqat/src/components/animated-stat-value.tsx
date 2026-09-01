"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/**
 * يعرض رقم إحصائية بتأثير عدّ متحرك من 0 حتى القيمة الحقيقية أول ما يدخل
 * الكرت الشاشة (نفس أسلوب الظهور المستخدم بـ staff-grid.tsx: whileInView +
 * viewport once). القيمة النهائية هي دايمًا value الممرّرة من قاعدة البيانات
 * — الحركة بصرية بس، وما تغيّر الرقم الحقيقي.
 */
export function AnimatedStatValue({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("ar-SA"));

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 2.4, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [isInView, value, reduceMotion, count]);

  return (
    <>
      {prefix}
      <motion.span ref={ref}>{rounded}</motion.span>
      {suffix}
    </>
  );
}
