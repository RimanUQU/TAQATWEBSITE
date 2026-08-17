const STORAGE_BUCKET = "uploads";

export function isStoragePath(value: string) {
  return /^(?:programs|staff|partners)\/[a-f0-9-]+\.(?:jpe?g|png|webp)$/i.test(value);
}

export function getPublicImageUrl(value: string) {
  if (!value || value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  if (!isStoragePath(value)) return "";
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return value;
  return new URL(`storage/v1/object/public/${STORAGE_BUCKET}/${value}`, baseUrl).toString();
}
