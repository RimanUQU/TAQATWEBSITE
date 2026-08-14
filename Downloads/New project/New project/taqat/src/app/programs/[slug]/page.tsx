import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { addCommentAction, registerProgramAction } from "@/actions/programs";
import { Alert, Badge, Breadcrumb, Button, Card } from "@/components/ui";
import { CommentForm } from "@/components/forms";

const differenceInDays = (end: Date, start: Date) => Math.ceil((end.getTime() - start.getTime()) / 86400000);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, program = await db.program.findUnique({ where: { slug }, select: { title: true, shortDescription: true, coverImage: true } });
  return program ? { title: program.title, description: program.shortDescription, ...(program.coverImage ? { openGraph: { images: [program.coverImage] } } : {}) } : { title: "البرنامج غير موجود" };
}

export default async function ProgramDetails({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ success?: string; error?: string }> }) {
  const [{ slug }, state, user] = await Promise.all([params, searchParams, getUser()]);
  const program = await db.program.findUnique({ where: { slug }, include: { category: true, registrations: { select: { userId: true, status: true } }, comments: { where: { status: "APPROVED" }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } } });
  if (!program || program.status !== "PUBLISHED") notFound();
  const registered = user && program.registrations.some((item) => item.userId === user.id && item.status === "CONFIRMED");
  const count = program.registrations.filter((item) => item.status === "CONFIRMED").length, closed = program.registrationDeadline < new Date(), full = count >= program.capacity;
  const errors: Record<string, string> = { closed: "انتهت فترة التسجيل في هذا البرنامج.", full: "اكتمل عدد المقاعد المتاحة.", duplicate: "أنتِ مسجلة بالفعل في هذا البرنامج." };
  return <><section className={`details-hero ${program.coverImage ? "" : "no-image"}`}>
    {program.coverImage && <Image src={program.coverImage} alt={`غلاف ${program.title}`} fill priority sizes="100vw"/>}
    <div className="container"><Breadcrumb items={[{ label: "البرامج", href: "/programs" }, { label: program.title }]}/><div className="badges" style={{ position: "static", marginBottom: 12 }}><Badge>{program.price === 0 ? "مجاني" : `${program.price} ر.س`}</Badge>{program.isNew && <Badge tone="teal">جديد</Badge>}</div><h1>{program.title}</h1><p>{program.shortDescription}</p></div>
  </section><section className="page-section"><div className="container two-col"><div><h2>عن البرنامج</h2><p>{program.description}</p><h2>تفاصيل البرنامج</h2><div className="details-list"><div className="detail-box"><small>تاريخ البداية</small><strong>{formatDate(program.startDate)}</strong></div><div className="detail-box"><small>تاريخ النهاية</small><strong>{formatDate(program.endDate)}</strong></div><div className="detail-box"><small>المدة</small><strong>{differenceInDays(program.endDate, program.startDate) + 1} أيام</strong></div><div className="detail-box"><small>الموقع</small><strong>{program.location}</strong></div><div className="detail-box"><small>المشاركات</small><strong>{count} من {program.capacity}</strong></div><div className="detail-box"><small>التصنيف</small><strong>{program.category?.name || "عام"}</strong></div></div></div>
    <Card className="register-box"><h2>جاهزة للانضمام؟</h2><p>احجزي مقعدك وابدئي تجربة جديدة مع مجتمع طاقات.</p>{state.success && <Alert type="success">تم تسجيلك في البرنامج بنجاح.</Alert>}{state.error && <Alert type="error">{errors[state.error] || "تعذّر إتمام التسجيل."}</Alert>}{registered ? <Alert type="success">أنتِ مسجلة في هذا البرنامج.</Alert> : <form action={registerProgramAction.bind(null, program.id)}><Button type="submit" disabled={closed || full}>{closed ? "انتهى التسجيل" : full ? "اكتملت المقاعد" : "التسجيل في البرنامج"}</Button></form>}<small>آخر موعد للتسجيل: {formatDate(program.registrationDeadline)}</small></Card>
  </div></section><section className="page-section soft-section"><div className="container" style={{ maxWidth: 850 }}><h2>تعليقات الزوار</h2><p>نرحب بتجربتك ورأيك. تظهر التعليقات بعد مراجعتها.</p>{user ? <CommentForm action={addCommentAction.bind(null, program.id, program.slug)}/> : <Alert>يرجى <a href={`/login?next=/programs/${program.slug}`}>تسجيل الدخول</a> لإضافة تعليق.</Alert>}<div className="comments">{program.comments.map((comment) => <article className="comment" key={comment.id}><div className="comment-head"><span className="avatar">{comment.user.name.charAt(0)}</span><div><strong>{comment.user.name}</strong><small>{formatDate(comment.createdAt)}</small></div></div><p>{comment.body}</p></article>)}{!program.comments.length && <p>لا توجد تعليقات منشورة بعد. كوني أول من يشارك تجربته.</p>}</div></div></section></>;
}
