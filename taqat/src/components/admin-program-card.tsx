"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge, Button, Card } from "./ui";
import { formatDate } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/images";
import { archiveProgramAction, restoreProgramAction, deleteProgramAction } from "@/actions/admin";

type AdminProgramCardData = {
  id: string;
  slug: string;
  title: string;
  cardImage: string;
  startDate: Date;
  location: string;
  capacity: number;
  price: number;
  isNew: boolean;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  _count: { registrations: number };
};

const statusLabel = { DRAFT: "مسودة", PUBLISHED: "منشور", ARCHIVED: "مؤرشف" } as const;
const statusTone = { DRAFT: "gray", PUBLISHED: "teal", ARCHIVED: "warn" } as const;

export function AdminProgramCard({ program }: { program: AdminProgramCardData }) {
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const canDelete = program._count.registrations === 0;
  return (
    <Card className="program-card admin-program-card">
      <div className={`card-image ${program.cardImage ? "" : "no-image"}`}>
        {program.cardImage ? (
          <Image
            src={getPublicImageUrl(program.cardImage)}
            alt={`صورة برنامج ${program.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="image-empty" aria-hidden="true">
            طاقات
          </span>
        )}
        <div className="badges">
          {program.featured && <Badge tone="warn">★ مميز</Badge>}
          <Badge tone={statusTone[program.status]}>{statusLabel[program.status]}</Badge>
        </div>
      </div>
      <div className="card-body">
        <h3>{program.title}</h3>
        <div className="card-meta">
          <span>
            <CalendarDays /> {formatDate(program.startDate)}
          </span>
          <span>
            <MapPin /> {program.location}
          </span>
          <span>
            <Users /> {program._count.registrations} / {program.capacity}
          </span>
        </div>
        <div className="admin-program-actions">
          <Link className="btn btn-outline btn-sm" href={`/admin/programs/${program.id}/edit`}>
            تعديل
          </Link>
          {program.status !== "ARCHIVED" ? (
            <form action={archiveProgramAction.bind(null, program.id)}>
              <Button variant="text" size="sm">
                أرشفة
              </Button>
            </form>
          ) : (
            <form action={restoreProgramAction.bind(null, program.id)}>
              <Button variant="text" size="sm">
                استرجاع
              </Button>
            </form>
          )}
          {canDelete ? (
            <form ref={deleteFormRef} action={deleteProgramAction.bind(null, program.id)}>
              <Button
                type="button"
                variant="text"
                size="sm"
                className="danger-text"
                onClick={() => {
                  if (
                    confirm(
                      `متأكدة تبين تحذفين برنامج "${program.title}" نهائيًا؟ هذا الإجراء لا يمكن التراجع عنه.`,
                    )
                  )
                    deleteFormRef.current?.requestSubmit();
                }}
              >
                حذف
              </Button>
            </form>
          ) : (
            <span className="upload-hint" title="ما تقدرين تحذفين برنامج فيه تسجيلات حقيقية، استخدمي الأرشفة">
              محمي من الحذف (فيه تسجيلات)
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
