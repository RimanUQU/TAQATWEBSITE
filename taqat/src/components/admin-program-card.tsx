"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, CalendarDays, MapPin, Users } from "lucide-react";
import type { Program } from "@prisma/client";
import { Button, Card } from "./ui";
import { formatDate } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/images";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { archiveProgramAction, restoreProgramAction, deleteProgramAction, saveProgramAction } from "@/actions/admin";

type AdminProgram = Program & { _count: { registrations: number } };
type Status = Program["status"];

const statusLabel = { DRAFT: "مسودة", PUBLISHED: "منشور", ARCHIVED: "مؤرشف" } as const;
const statusBadgeClass = { DRAFT: "badge-gray", PUBLISHED: "badge-teal", ARCHIVED: "badge-warn" } as const;

const toDateTimeLocal = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export function AdminProgramCard({
  program,
  onCancelNew,
}: {
  program?: AdminProgram;
  onCancelNew?: () => void;
}) {
  const isNewProgram = !program;
  const [editing, setEditing] = useState(isNewProgram);
  const [cardImage, setCardImage] = useState(program?.cardImage || "");
  const [status, setStatus] = useState<Status>(program?.status || "DRAFT");
  const [featured, setFeatured] = useState(program?.featured || false);
  const [isNewBadge, setIsNewBadge] = useState(program?.isNew || false);
  const [showInSlider, setShowInSlider] = useState(program?.showInSlider || false);
  const [uploading, setUploading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const canDelete = !program || program._count.registrations === 0;

  function cancelEdit() {
    if (isNewProgram) {
      onCancelNew?.();
      return;
    }
    setCardImage(program.cardImage);
    setStatus(program.status);
    setFeatured(program.featured);
    setIsNewBadge(program.isNew);
    setShowInSlider(program.showInSlider);
    setEditing(false);
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size, folder: "programs" }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "تعذر تجهيز رفع الصورة");
      const { error } = await getSupabaseBrowser()
        .storage.from("uploads")
        .uploadToSignedUrl(payload.path, payload.token, file, {
          contentType: file.type,
          cacheControl: "3600",
        });
      if (error) throw error;
      const previous = cardImage;
      setCardImage(payload.path);
      if (previous && !previous.startsWith("/") && !/^https?:\/\//i.test(previous)) {
        await fetch("/api/admin/delete-image", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path: previous }),
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="program-card admin-program-card">
      <form
        action={editing ? saveProgramAction.bind(null, program?.id) : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA")
            e.preventDefault();
        }}
      >
        {editing ? (
          <button
            type="button"
            className="card-image admin-image-edit"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {cardImage ? (
              <Image
                src={getPublicImageUrl(cardImage)}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <span className="image-empty" aria-hidden="true">
                طاقات
              </span>
            )}
            <span className="admin-image-edit-hint">
              {uploading ? "جاري الرفع..." : "اضغطي لإضافة صورة"}
            </span>
          </button>
        ) : (
          <div className={`card-image ${program!.cardImage ? "" : "no-image"}`}>
            {program!.cardImage ? (
              <Image
                src={getPublicImageUrl(program!.cardImage)}
                alt={`صورة برنامج ${program!.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <span className="image-empty" aria-hidden="true">
                طاقات
              </span>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImagePick}
          style={{ display: "none" }}
        />

        <div className="badges">
          {editing ? (
            <>
              <label className={`badge ${featured ? "badge-warn" : "badge-gray"} inline-toggle-badge`}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                ★ مميز
              </label>
              <label className={`badge ${isNewBadge ? "badge-teal" : "badge-gray"} inline-toggle-badge`}>
                <input
                  type="checkbox"
                  name="isNew"
                  checked={isNewBadge}
                  onChange={(e) => setIsNewBadge(e.target.checked)}
                />
                جديد
              </label>
              <label className={`badge ${showInSlider ? "badge-teal" : "badge-gray"} inline-toggle-badge`}>
                <input
                  type="checkbox"
                  name="showInSlider"
                  checked={showInSlider}
                  onChange={(e) => setShowInSlider(e.target.checked)}
                />
                بشريط الإعلانات
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={`badge ${statusBadgeClass[status]} inline-select-badge`}
              >
                <option value="DRAFT">مسودة</option>
                <option value="PUBLISHED">منشور</option>
                <option value="ARCHIVED">مؤرشف</option>
              </select>
            </>
          ) : (
            <>
              {program!.featured && <span className="badge badge-warn">★ مميز</span>}
              {program!.isNew && <span className="badge badge-teal">جديد</span>}
              <span className={`badge ${statusBadgeClass[program!.status]}`}>
                {statusLabel[program!.status]}
              </span>
            </>
          )}
        </div>

        <div className="card-body">
          <h3>
            {editing ? (
              <input
                name="title"
                defaultValue={program?.title}
                placeholder="اسم البرنامج"
                className="inline-input inline-input-title"
                required
              />
            ) : (
              program!.title
            )}
          </h3>

          {isNewProgram && (
            <input
              name="shortDescription"
              defaultValue=""
              placeholder="وصف مختصر للبرنامج"
              className="inline-input inline-input-full"
              required
            />
          )}

          <div className="card-meta">
            <span>
              <CalendarDays />
              {editing ? (
                <input
                  type="datetime-local"
                  name="startDate"
                  defaultValue={program ? toDateTimeLocal(program.startDate) : ""}
                  className="inline-input inline-input-meta"
                  required
                />
              ) : (
                formatDate(program!.startDate)
              )}
            </span>
            {isNewProgram && (
              <span>
                <CalendarDays />
                <input
                  type="datetime-local"
                  name="endDate"
                  defaultValue=""
                  className="inline-input inline-input-meta"
                  required
                />
              </span>
            )}
            <span>
              <MapPin />
              {editing ? (
                <input
                  name="location"
                  defaultValue={program?.location}
                  placeholder="الموقع"
                  className="inline-input inline-input-meta"
                  required
                />
              ) : (
                program!.location
              )}
            </span>
            <span>
              <Users /> {program ? `${program._count.registrations} / ` : ""}
              {editing ? (
                <input
                  type="number"
                  name="capacity"
                  min={1}
                  defaultValue={program?.capacity || 20}
                  className="inline-input inline-input-meta inline-input-number"
                  required
                />
              ) : (
                program!.capacity
              )}
            </span>
            {isNewProgram && (
              <span>
                السعر
                <input
                  type="number"
                  name="price"
                  min={0}
                  defaultValue={0}
                  className="inline-input inline-input-meta inline-input-number"
                />
              </span>
            )}
          </div>

          {editing && !isNewProgram && (
            <>
              {/* حقول موجودة بالبرنامج بس مو معروضة على الكارد - تُحفظ بقيمتها الحالية بدون تغيير */}
              <input type="hidden" name="slug" value={program!.slug} />
              <input type="hidden" name="shortDescription" value={program!.shortDescription} />
              <input type="hidden" name="description" value={program!.description} />
              <input type="hidden" name="coverImage" value={program!.coverImage} />
              <input type="hidden" name="cardImage" value={cardImage} />
              <input type="hidden" name="categoryId" value={program!.categoryId || ""} />
              <input type="hidden" name="endDate" value={toDateTimeLocal(program!.endDate)} />
              <input
                type="hidden"
                name="registrationDeadline"
                value={toDateTimeLocal(program!.registrationDeadline)}
              />
              <input type="hidden" name="price" value={program!.price} />
            </>
          )}
          {isNewProgram && <input type="hidden" name="cardImage" value={cardImage} />}

          <div className="admin-program-actions">
            {/* كل زر هنا له key صريح ومختلف بين وضع العرض ووضع التعديل، عمدًا:
                بدون key، React كان يعيد استخدام نفس عنصر <button> بالـDOM بين
                الوضعين (زر "تعديل" وزر "حفظ" بنفس الموضع بالضبط)، ولأن زر
                "حفظ" بدون type صريح فهو submit تلقائيًا، كان React يغيّر نوع
                الزر مباشرة أثناء معالجة نقرة "تعديل" نفسها - قبل ما يخلص
                المتصفح من تنفيذ سلوك النقرة الافتراضي - فيصير الزر submit
                فجأة ويرسل الفورم فورًا بمجرد الضغط على "تعديل"! (هذا سبب
                "يحفظ لحاله" اللي وصفتيه). الحل: key مختلف يجبر React يشيل
                الزر القديم ويطلع زر جديد بدل ما يعدّل نفس العنصر. */}
            {editing ? (
              <>
                <Button key="save" type="submit" size="sm">
                  {isNewProgram ? "إضافة البرنامج" : "حفظ"}
                </Button>
                <Button key="cancel" type="button" variant="outline" size="sm" onClick={cancelEdit}>
                  إلغاء
                </Button>
              </>
            ) : (
              <>
                <Button
                  key="edit"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditing(true);
                  }}
                >
                  تعديل
                </Button>
                {program!.status !== "ARCHIVED" ? (
                  <Button
                    key="archive"
                    type="submit"
                    formAction={archiveProgramAction.bind(null, program!.id)}
                    variant="text"
                    size="sm"
                  >
                    أرشفة
                  </Button>
                ) : (
                  <Button
                    key="restore"
                    type="submit"
                    formAction={restoreProgramAction.bind(null, program!.id)}
                    variant="text"
                    size="sm"
                  >
                    استرجاع
                  </Button>
                )}
                {canDelete ? (
                  <Button
                    key="delete"
                    type="button"
                    variant="text"
                    size="sm"
                    className="danger-text"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmingDelete(true);
                    }}
                  >
                    حذف
                  </Button>
                ) : (
                  <span
                    key="delete-protected"
                    className="upload-hint"
                    title="ما تقدرين تحذفين برنامج فيه تسجيلات حقيقية، استخدمي الأرشفة"
                  >
                    محمي من الحذف (فيه تسجيلات)
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </form>
      {!editing && program && (
        <form ref={deleteFormRef} action={deleteProgramAction.bind(null, program.id)} hidden />
      )}
      {confirmingDelete && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setConfirmingDelete(false);
          }}
        >
          <div
            className="modal program-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-program-title"
          >
            <span className="program-delete-modal-icon" aria-hidden="true">
              <AlertTriangle size={22} />
            </span>
            <h2 id="delete-program-title">تأكيد الحذف</h2>
            <p>
              هل أنت متأكدة من حذف برنامج &quot;{program?.title}&quot;؟ هذا الإجراء لا يمكن
              التراجع عنه.
            </p>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setConfirmingDelete(false)}>
                إلغاء
              </Button>
              <Button
                className="btn-danger"
                onClick={() => {
                  setConfirmingDelete(false);
                  deleteFormRef.current?.requestSubmit();
                }}
              >
                حذف البرنامج
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
