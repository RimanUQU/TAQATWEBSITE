"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert } from "./ui";

export function SavedBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("saved") !== "1") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    // امسحي "?saved=1" من الرابط فورًا عشان الرسالة ما ترجع تظهر لوحدها
    // (مثلاً لما تضغطين "تعديل" على كارد ثاني، أو تحدّثين الصفحة)
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    router.replace(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!visible) return null;
  return <Alert type="success">تم حفظ البرنامج بنجاح.</Alert>;
}
