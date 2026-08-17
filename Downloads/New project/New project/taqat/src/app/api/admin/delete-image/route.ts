import { requireAdmin } from "@/lib/auth";
import { getStorageClient, STORAGE_BUCKET } from "@/lib/supabase-storage";
import { isStoragePath } from "@/lib/images";

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path : "";
  if (!isStoragePath(path)) return Response.json({ error: "مسار الصورة غير صالح" }, { status: 400 });
  const { error } = await getStorageClient().storage.from(STORAGE_BUCKET).remove([path]);
  if (error) return Response.json({ error: "تعذر حذف الصورة" }, { status: 500 });
  return Response.json({ ok: true });
}
