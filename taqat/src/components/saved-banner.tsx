"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert } from "./ui";

export function SavedBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  // نمنع أي احتمال يبان معه "تم الحفظ" مرة ثانية بدون حفظ فعلي جديد: نستهلك
  // "?saved=1" مرة وحدة بس لكل تحميل فعلي للصفحة، ونمسحه من شريط العنوان
  // فورًا بأمر متصفح مباشر (بدون المرور بموجّه Next.js، اللي كان يحتاج وقت
  // غير مضمون لين يكمل - وبهالفترة أي تفاعل ثاني بالصفحة كان يبين وكأنه هو
  // اللي "سوى" الحفظ رغم إنه غير مرتبط إطلاقًا).
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    if (searchParams.get("saved") !== "1") return;
    consumedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(window.history.state, "", url.pathname + url.search);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!visible) return null;
  return <Alert type="success">تم حفظ البرنامج بنجاح.</Alert>;
}
