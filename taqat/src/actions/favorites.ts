"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function toggleFavoriteAction(programId: string, slug: string) {
  const user = await getUser();
  if (!user) redirect(`/login?next=/programs/${slug}`);
  const favorite = await db.favorite.findUnique({ where: { userId_programId: { userId: user.id, programId } } });
  if (favorite) await db.favorite.delete({ where: { id: favorite.id } });
  else await db.favorite.create({ data: { userId: user.id, programId } });
  revalidatePath("/account");
  revalidatePath(`/programs/${slug}`);
}

export async function removeFavoriteAction(favoriteId: string) {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  await db.favorite.deleteMany({ where: { id: favoriteId, userId: user.id } });
  revalidatePath("/account");
}
