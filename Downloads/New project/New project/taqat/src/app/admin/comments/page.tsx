import { db } from "@/lib/db";
import { moderateCommentAction, toggleCommentFeaturedAction } from "@/actions/admin";
import { AdminHeader } from "@/components/admin-ui";
import { Badge, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function Comments({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status && ["PENDING", "APPROVED", "HIDDEN"].includes(status) ? status as "PENDING" | "APPROVED" | "HIDDEN" : undefined;
  const items = await db.programComment.findMany({ where: filter ? { status: filter } : {}, include: { user: true, program: true }, orderBy: { createdAt: "desc" } });
  return <>
    <AdminHeader title="تعليقات البرامج" subtitle="راجعي آراء المستفيدات، ثم اعتمدي المناسب وأبرزيه في الصفحة الرئيسية." actions={<div className="table-actions"><a className="btn btn-outline btn-sm" href="/admin/comments?status=PENDING">بانتظار المراجعة</a><a className="btn btn-outline btn-sm" href="/admin/comments?status=APPROVED">المعتمدة</a><a className="btn btn-outline btn-sm" href="/admin/comments?status=HIDDEN">المخفية</a></div>} />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>المستفيدة</th><th>البرنامج</th><th>التعليق</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.user.name}</td><td>{item.program.title}</td><td>{item.body}</td><td>{formatDate(item.createdAt)}</td><td><Badge tone={item.featured ? "teal" : "pink"}>{item.status}{item.featured ? " · ظاهر في الرئيسية" : ""}</Badge></td><td className="table-actions"><form action={moderateCommentAction.bind(null, item.id, "APPROVED")}><Button size="sm" variant="secondary">اعتماد</Button></form>{item.status === "APPROVED" && <form action={toggleCommentFeaturedAction.bind(null, item.id)}><Button size="sm" variant={item.featured ? "outline" : "primary"}>{item.featured ? "إزالة من الرئيسية" : "إبراز في الرئيسية"}</Button></form>}<form action={moderateCommentAction.bind(null, item.id, "HIDDEN")}><Button size="sm" variant="outline">إخفاء</Button></form><form action={moderateCommentAction.bind(null, item.id, "DELETE")}><Button size="sm" variant="text">حذف</Button></form></td></tr>)}</tbody></table></div>
  </>;
}
