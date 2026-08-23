"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
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
    <Card
      className={`program-card admin-program-card ${editing ? "admin-program-card-editing" : ""}`}
    >
      <form action={editing ? saveProgramAction.bind(null, program?.id) : undefined}>
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
              {program!.isNew && <input type="hidden" name="isNew" value="on" />}
              {program!.showInSlider && <input type="hidden" name="showInSlider" value="on" />}
            </>
          )}
          {isNewProgram && <input type="hidden" name="cardImage" value={cardImage} />}

          <div className="admin-program-actions">
            {editing ? (
              <>
                <Button size="sm">{isNewProgram ? "إضافة البرنامج" : "حفظ"}</Button>
                <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                  إلغاء
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
                  تعديل
                </Button>
                {program!.status !== "ARCHIVED" ? (
                  <Button
                    type="submit"
                    formAction={archiveProgramAction.bind(null, program!.id)}
                    variant="text"
                    size="sm"
                  >
                    أرشفة
                  </Button>
                ) : (
                  <Button
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
                    type="button"
                    variant="text"
                    size="sm"
                    className="danger-text"
                    onClick={() => {
                      if (
                        confirm(
                          `متأكدة تبين تحذفين برنامج "${program!.title}" نهائيًا؟ هذا الإجراء لا يمكن التراجع عنه.`,
                        )
                      )
                        deleteFormRef.current?.requestSubmit();
                    }}
                  >
                    حذف
                  </Button>
                ) : (
                  <span
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
    </Card>
  );
}
