"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ["GENERAL", "PROGRAM", "SUGGESTION", "ISSUE", "OTHER"] as const;

export async function submitFeedbackAction(formData: FormData) {
  // 1) Honeypot — حقل مخفي لا تراه إلا الروبوتات
  const honeypot = String(formData.get("website") || "").trim();
  if (honeypot) {
    // نتظاهر بالنجاح حتى لا يعرف الروبوت أنه اكتُشف
    redirect("/feedback?sent=1");
  }

  // 2) حد زمني أدنى — لو أُرسل النموذج خلال أقل من 3 ثوانٍ من تحميله، فهذا مؤشر بوت
  const loadedAt = Number(formData.get("loadedAt") || 0);
  if (!loadedAt || Date.now() - loadedAt < 3000) {
    redirect("/feedback?error=too_fast");
  }

  const type = String(formData.get("type") || "");
  const message = String(formData.get("message") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim() || null;
  const programId = String(formData.get("programId") || "").trim() || null;
  const consent = formData.get("consent") === "on";

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    redirect("/feedback?error=invalid");
  }
  if (message.length < 10) {
    redirect("/feedback?error=message_short");
  }
  if (!EMAIL_RE.test(email)) {
    redirect("/feedback?error=invalid_email");
  }
  if (type === "PROGRAM" && !programId) {
    redirect("/feedback?error=missing_program");
  }

  if (programId) {
    const program = await db.program.findFirst({
      where: { id: programId, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!program) redirect("/feedback?error=missing_program");
  }

  // 3) منع الإزعاج: لا تُقبل أكثر من رأي واحد من نفس البريد خلال دقيقتين
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const recentDuplicate = await db.feedback.findFirst({
    where: { email, createdAt: { gte: twoMinutesAgo } },
    select: { id: true },
  });
  if (recentDuplicate) {
    redirect("/feedback?error=duplicate");
  }

  const currentUser = await getUser();

  await db.feedback.create({
    data: {
      type: type as (typeof VALID_TYPES)[number],
      message,
      email,
      name,
      consent,
      programId: type === "PROGRAM" ? programId : null,
      userId: currentUser?.id ?? null,
    },
  });

  redirect("/feedback?sent=1");
}
