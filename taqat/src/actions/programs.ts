"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import type { ActionState } from "@/lib/utils";

export async function registerProgramAction(programId: string): Promise<void> {
  const user = await getUser();
  const program = await db.program.findUnique({
    where: { id: programId },
    include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
  });
  if (!program) redirect("/programs?error=missing");
  if (!user) redirect(`/login?next=/programs/${program.slug}`);
  if (program.status !== "PUBLISHED" || program.registrationDeadline < new Date())
    redirect(`/programs/${program.slug}?error=closed`);
  if (program._count.registrations >= program.capacity)
    redirect(`/programs/${program.slug}?error=full`);
  try {
    await db.programRegistration.create({ data: { userId: user.id, programId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      redirect(`/programs/${program.slug}?error=duplicate`);
    throw error;
  }
  revalidatePath(`/programs/${program.slug}`);
  redirect(`/programs/${program.slug}?success=registered`);
}

export async function addCommentAction(
  programId: string,
  slug: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getUser();
  if (!user) return { message: "يرجى تسجيل الدخول لإضافة تعليق" };
  const body = String(formData.get("body") || "").trim();
  if (body.length < 5 || body.length > 1000)
    return { message: "يجب أن يكون التعليق بين 5 و1000 حرف" };
  await db.programComment.create({ data: { body, programId, userId: user.id } });
  revalidatePath(`/programs/${slug}`);
  return { ok: true, message: "تم إرسال تعليقك للمراجعة، شكرًا لمشاركتك." };
}
