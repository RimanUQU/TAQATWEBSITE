"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// أضيفي هذه الدوال إلى actions/admin.ts الحالي (أو استورديها من ملف منفصل)

export async function approveFeedbackAction(id: string) {
  await requireAdmin();
  await db.feedback.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/feedback");
}

export async function hideFeedbackAction(id: string) {
  await requireAdmin();
  await db.feedback.update({ where: { id }, data: { status: "HIDDEN" } });
  revalidatePath("/admin/feedback");
}

export async function deleteFeedbackAction(id: string) {
  await requireAdmin();
  await db.feedback.delete({ where: { id } });
  revalidatePath("/admin/feedback");
}

// نشر مباشر إلى "قالوا عنا" — بدون أي تعديل على النص أو الاسم، حفاظًا على المصداقية.
// الإدارة فقط تقرر: تنشر أو لا تنشر.
export async function publishFeedbackAsTestimonialAction(id: string) {
  await requireAdmin();
  const feedback = await db.feedback.findUnique({ where: { id } });
  if (!feedback || !feedback.consent || feedback.status !== "APPROVED" || feedback.publishedAsTestimonial)
    return;

  const lastOrder = await db.testimonial.findFirst({
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await db.$transaction([
    db.testimonial.create({
      data: {
        quote: feedback.message,
        name: feedback.name || "مستفيدة طاقات",
        title: null,
        rating: 5,
        displayOrder: (lastOrder?.displayOrder ?? 0) + 1,
        active: true,
      },
    }),
    db.feedback.update({
      where: { id },
      data: { status: "APPROVED", publishedAsTestimonial: true },
    }),
  ]);

  revalidatePath("/admin/feedback");
  revalidatePath("/admin/testimonials");
  revalidatePath("/"); // الصفحة الرئيسية فيها قسم "قالوا عنا"
}
