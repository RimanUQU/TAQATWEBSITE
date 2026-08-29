import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin-ui";
import { Badge, Button } from "@/components/ui";
import {
  approveFeedbackAction,
  hideFeedbackAction,
  deleteFeedbackAction,
  publishFeedbackAsTestimonialAction,
} from "@/actions/admin-feedback"; // أو من actions/admin لو دمجتِها هناك

const STATUS_TABS = [
  { value: "", label: "الكل" },
  { value: "PENDING", label: "قيد المراجعة" },
  { value: "APPROVED", label: "معتمدة" },
  { value: "HIDDEN", label: "مخفية" },
] as const;

const TYPE_LABELS: Record<string, string> = {
  GENERAL: "رأي عام",
  PROGRAM: "عن برنامج",
  SUGGESTION: "اقتراح",
  ISSUE: "ملاحظة/مشكلة",
  OTHER: "أخرى",
};

const STATUS_BADGE: Record<string, "warn" | "teal" | "gray"> = {
  PENDING: "warn",
  APPROVED: "teal",
  HIDDEN: "gray",
};

export default async function AdminFeedback({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  await requireAdmin();

  const { status, type } = await searchParams;

  const items = await db.feedback.findMany({
    where: {
      ...(status ? { status: status as "PENDING" | "APPROVED" | "HIDDEN" } : {}),
      ...(type ? { type: type as "GENERAL" | "PROGRAM" | "SUGGESTION" | "ISSUE" | "OTHER" } : {}),
    },
    include: { program: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminHeader title="الآراء الواردة" />

      <div className="admin-header-actions" style={{ marginBottom: 20 }}>
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/feedback${tab.value ? `?status=${tab.value}` : ""}`}
            className={`btn btn-sm ${status === tab.value || (!status && !tab.value) ? "btn-primary" : "btn-outline"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>النوع</th>
              <th>البرنامج</th>
              <th>الرأي</th>
              <th>الاسم</th>
              <th>البريد</th>
              <th>موافقة العرض</th>
              <th>الحالة</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f.id}>
                <td>{TYPE_LABELS[f.type]}</td>
                <td>{f.program?.title || "—"}</td>
                <td style={{ maxWidth: 260 }}>{f.message.slice(0, 90)}</td>
                <td>{f.name || "مجهول"}</td>
                <td>{f.email}</td>
                <td>
                  <Badge tone={f.consent ? "teal" : "gray"}>{f.consent ? "موافقة" : "بدون"}</Badge>
                </td>
                <td>
                  <Badge tone={STATUS_BADGE[f.status]}>
                    {STATUS_TABS.find((t) => t.value === f.status)?.label || f.status}
                  </Badge>
                </td>
                <td className="table-actions">
                  {f.status !== "APPROVED" && (
                    <form action={approveFeedbackAction.bind(null, f.id)}>
                      <Button variant="text" size="sm">اعتماد</Button>
                    </form>
                  )}
                  {f.status !== "HIDDEN" && (
                    <form action={hideFeedbackAction.bind(null, f.id)}>
                      <Button variant="text" size="sm">إخفاء</Button>
                    </form>
                  )}
                  {f.consent && f.status === "APPROVED" && !f.publishedAsTestimonial && (
                    <form action={publishFeedbackAsTestimonialAction.bind(null, f.id)}>
                      <Button variant="text" size="sm">نشر في قالوا عنا</Button>
                    </form>
                  )}
                  {f.publishedAsTestimonial && <Badge tone="pink">منشورة</Badge>}
                  <form action={deleteFeedbackAction.bind(null, f.id)}>
                    <Button variant="text" size="sm">حذف</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
