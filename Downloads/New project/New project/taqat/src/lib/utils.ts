export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(date);
}
export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-");
}
export type ActionState = { ok?: boolean; message?: string };
