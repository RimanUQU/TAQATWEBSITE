"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

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
