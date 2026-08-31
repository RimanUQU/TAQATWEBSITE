import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { Badge } from "./ui";
import { formatDate } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  GENERAL: "رأي عام",
  PROGRAM: "رأي عن برنامج",
  SUGGESTION: "اقتراح",
  ISSUE: "ملاحظة أو مشكلة",
  OTHER: "أخرى",
};

type FeedbackItem = {
  id: string;
  type: string;
  message: string;
  status: "PENDING" | "APPROVED" | "HIDDEN";
  createdAt: Date;
  program: { title: string; slug: string } | null;
};

export function FeedbackList({ feedbacks }: { feedbacks: FeedbackItem[] }) {
  if (!feedbacks.length) {
    return (
      <p className="feedback-list-empty">
        لم ترسلي أي رأي أو مقترح بعد. <Link className="card-link" href="/feedback">شاركينا رأيك ←</Link>
      </p>
    );
  }

  return (
    <div className="feedback-list">
      {feedbacks.map((f) => (
        <div className="feedback-item" key={f.id}>
          <span className="feedback-item-icon" aria-hidden="true">
            <MessageSquareText size={18} />
          </span>
          <div className="feedback-item-info">
            <div className="feedback-item-head">
              <strong>{TYPE_LABELS[f.type] ?? f.type}</strong>
              {/* لا نكشف الفرق بين APPROVED و HIDDEN — كلاهما يظهر كـ"تمت المراجعة" لتفادي إظهار قرارات الإدارة الداخلية */}
              <Badge tone={f.status === "PENDING" ? "gray" : "teal"}>
                {f.status === "PENDING" ? "قيد المراجعة" : "تمت المراجعة"}
              </Badge>
            </div>
            {f.program && (
              <Link className="feedback-item-program" href={`/programs/${f.program.slug}`}>
                {f.program.title}
              </Link>
            )}
            <p>{f.message}</p>
            <small>{formatDate(f.createdAt)}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
