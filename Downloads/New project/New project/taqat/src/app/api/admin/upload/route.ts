import { requireAdmin } from "@/lib/auth";
import { getStorageClient, STORAGE_BUCKET } from "@/lib/supabase-storage";

const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;
const folders = new Set(["programs", "staff", "partners"]);

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const contentType = body?.contentType as keyof typeof extensions | undefined;
  const size = Number(body?.size);
  const folder = String(body?.folder ?? "");
  if (!contentType || !(contentType in extensions) || !folders.has(folder))
    return Response.json({ error: "نوع الصورة غير مدعوم" }, { status: 400 });
  if (!Number.isFinite(size) || size < 1 || size > 5 * 1024 * 1024)
    return Response.json({ error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" }, { status: 400 });

  const path = `${folder}/${crypto.randomUUID()}.${extensions[contentType]}`;
  const { data, error } = await getStorageClient()
    .storage.from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) return Response.json({ error: "تعذر تجهيز رفع الصورة" }, { status: 500 });
  return Response.json({ path, token: data.token });
}
