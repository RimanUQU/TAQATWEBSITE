"use client";

import { useState } from "react";
import { submitFeedbackAction } from "@/actions/feedback";
import { Button } from "@/components/ui";

type ProgramOption = { id: string; title: string; price: number };

const TYPES: { value: string; label: string; hint: string }[] = [
  { value: "GENERAL", label: "رأي عام عن طاقات", hint: "انطباعك العام عن النادي" },
  { value: "PROGRAM", label: "رأي عن برنامج محدد", hint: "تجربتك في برنامج شاركتِ فيه" },
  { value: "SUGGESTION", label: "اقتراح أو فكرة", hint: "فكرة لبرنامج أو فعالية جديدة" },
  { value: "ISSUE", label: "ملاحظة أو مشكلة", hint: "شيء يحتاج تحسينًا" },
  { value: "OTHER", label: "أخرى", hint: "أي شيء آخر تحبين مشاركته" },
];

export function FeedbackForm({
  programs,
  defaultName,
  defaultEmail,
}: {
  programs: ProgramOption[];
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [type, setType] = useState("GENERAL");
  // قيمة ثابتة تُحسب مرة واحدة عند أول تصيير، بدون useEffect ولا إعادة تصيير إضافية
  const [loadedAt] = useState(() => Date.now());

  return (
    <form action={submitFeedbackAction} className="panel" style={{ display: "grid", gap: 22 }}>
      {/* Honeypot — حقل مخفي بالكامل، لا يُملأ إلا من الروبوتات */}
      <div className="feedback-honeypot" aria-hidden="true">
        <label>
          الموقع الإلكتروني
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="loadedAt" value={loadedAt} />

      <div className="field">
        <label>ما نوع رأيك؟</label>
        <div className="feedback-type-grid">
          {TYPES.map((t) => (
            <label className="feedback-type" key={t.value}>
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
              />
              <strong>{t.label}</strong>
              <small>{t.hint}</small>
            </label>
          ))}
        </div>
      </div>

      {type === "PROGRAM" && (
        <div className="field">
          <label htmlFor="programId">اختاري البرنامج</label>
          <select id="programId" name="programId" className="input" required defaultValue="">
            <option value="" disabled>
              — اختاري برنامجًا —
            </option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} · {p.price > 0 ? `مدفوع (${p.price} ر.س)` : "مجاني"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label htmlFor="message">رأيك</label>
        <textarea
          id="message"
          name="message"
          className="input textarea"
          rows={5}
          minLength={10}
          required
          placeholder="اكتبي رأيك بحرية هنا..."
        />
      </div>

      <div className="field">
        <label htmlFor="name">الاسم (اختياري)</label>
        <input
          id="name"
          name="name"
          className="input"
          defaultValue={defaultName}
          placeholder="اتركيه فارغًا لو تفضلين عدم ذكر اسمك"
        />
      </div>

      <div className="field">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          defaultValue={defaultEmail}
          required
          placeholder="للتواصل معك عند الحاجة فقط"
        />
        <small>لن يُنشر بريدك الإلكتروني للعامة أبدًا.</small>
      </div>

      <label className="check">
        <input type="checkbox" name="consent" />
        أوافق على عرض رأيي ضمن «قالوا عنا» في الصفحة الرئيسية، إن اختارت إدارة طاقات ذلك.
      </label>

      <Button size="lg">إرسال رأيي</Button>
    </form>
  );
}
