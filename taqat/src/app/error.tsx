"use client";
import { Button } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <PageHero
      title="حدث خطأ غير متوقع"
      subtitle="يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، تواصلي معنا."
    >
      <Button onClick={reset}>إعادة المحاولة</Button>
    </PageHero>
  );
}
