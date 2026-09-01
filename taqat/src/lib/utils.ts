export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(date);
}
export function slugify(value: string) {
  // بس حروف/أرقام إنجليزية (بدل قبول أي حرف حتى العربي) - يضمن رابط
  // (Slug) صالح دايمًا بالمتصفح، بدل ما يطلع رابط عربي خام هش يسبب
  // أخطاء 404 متقطعة. لو العنوان عربي بالكامل والنتيجة تطلع فاضية،
  // نضيف لاحقة عشوائية قصيرة بدل رابط فاضي أو غير صالح.
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (/[a-z]/.test(base)) return base;
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `program-${suffix}`;
}
export type ActionState = { ok?: boolean; message?: string };
