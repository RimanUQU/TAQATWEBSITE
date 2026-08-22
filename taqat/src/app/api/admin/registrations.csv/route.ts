import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
const csv = (value: string | number | Date) => `"${String(value).replaceAll('"', '""')}"`;
export async function GET() {
  await requireAdmin();
  const rows = await db.programRegistration.findMany({
    include: { user: true, program: true },
    orderBy: { createdAt: "desc" },
  });
  const data = [
    ["الاسم", "البريد الإلكتروني", "الجوال", "البرنامج", "الحالة", "تاريخ التسجيل"],
    ...rows.map((r) => [
      r.user.name,
      r.user.email,
      r.user.phone || "",
      r.program.title,
      r.status,
      r.createdAt.toISOString(),
    ]),
  ]
    .map((row) => row.map(csv).join(","))
    .join("\r\n");
  return new Response("\uFEFF" + data, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=taqat-registrations.csv",
    },
  });
}
