"use client";
import { Button } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-hero">
      <div className="container">
        <h1>حدث خطأ غير متوقع</h1>
        <p>يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، تواصلي معنا.</p>
        <Button onClick={reset}>إعادة المحاولة</Button>
      </div>
    </div>
  );
}
