"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AlertTriangle, CalendarDays, FileText, MapPin, Tag, User, Users } from "lucide-react";
import type { Program, ProgramCategory, TargetAudience } from "@prisma/client";
import { Button, Card, FormField, Input } from "./ui";
import { formatDate } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/images";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { archiveProgramAction, restoreProgramAction, deleteProgramAction, saveProgramAction } from "@/actions/admin";
import { ColorSwatchPicker } from "./color-swatch-picker";
import { ImageCropModal } from "./image-crop-modal";

type AdminProgram = Program & {
  _count: { registrations: number };
  category: ProgramCategory | null;
  targetAudience: TargetAudience | null;
};
type Status = Program["status"];

const statusLabel = { DRAFT: "مسودة", PUBLISHED: "منشور", ARCHIVED: "مؤرشف" } as const;
const statusBadgeClass = { DRAFT: "badge-gray", PUBLISHED: "badge-teal", ARCHIVED: "badge-warn" } as const;

const toDateTimeLocal = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export function AdminProgramCard({
  program,
  categories,
  audiences,
  sliderCount,
  onCancelNew,
}: {
  program?: AdminProgram;
  categories: ProgramCategory[];
  audiences: TargetAudience[];
  sliderCount: number;
  onCancelNew?: () => void;
}) {
  const isNewProgram = !program;
  const [editing, setEditing] = useState(isNewProgram);
  const [cardImage, setCardImage] = useState(program?.cardImage || "");
  const [bannerImage, setBannerImage] = useState(program?.bannerImage || "");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [status, setStatus] = useState<Status>(program?.status || "DRAFT");
  const [featured, setFeatured] = useState(program?.featured || false);
  const [isNewBadge, setIsNewBadge] = useState(program?.isNew || false);
  const [showInSlider, setShowInSlider] = useState(program?.showInSlider || false);
  const [uploading, setUploading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [description, setDescription] = useState(program?.description || "");
  const [slug, setSlug] = useState(program?.slug || "");
  const [backgroundColor, setBackgroundColor] = useState(program?.backgroundColor || "#075658");
  const [detailsOpen, setDetailsOpen] = useState(false);
  // صورة غلاف مستقلة لصفحة تفاصيل البرنامج العامة - افتراضيًا فاضية، وقتها
  // saveProgramAction يستخدم صورة الكارد تلقائيًا (سلوك احتياطي موجود أصلًا)
  const [coverImage, setCoverImage] = useState(program?.coverImage || "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [goals, setGoals] = useState(program?.goals || "");
  const [features, setFeatures] = useState(program?.features || "");
  const [requirements, setRequirements] = useState(program?.requirements || "");
  const [faq, setFaq] = useState(program?.faq || "");
  // القص مفعّل لصورة بانر شريط الإعلانات وصورة غلاف صفحة التفاصيل (نسبتهم
  // العريضة تحتاج تحديد يدوي)، مو لصورة الكارد - رفعها يبقى مباشر زي ما كان.
  const [croppingBanner, setCroppingBanner] = useState<File | null>(null);
  const [croppingCover, setCroppingCover] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const canDelete = !program || program._count.registrations === 0;
  const otherSliderCount = sliderCount - (program?.showInSlider ? 1 : 0);

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
    setDescription(program.description);
    setSlug(program.slug);
    setBackgroundColor(program.backgroundColor);
    setBannerImage(program.bannerImage || "");
    setCoverImage(program.coverImage || "");
    setGoals(program.goals || "");
    setFeatures(program.features || "");
    setRequirements(program.requirements || "");
    setFaq(program.faq || "");
    setEditing(false);
  }

  // منطق رفع الصورة مشترك بين صورة الكارد وصورة بانر شريط الإعلانات - نفس
  // الخطوات بالضبط (تجهيز رابط موقّع، رفع، حذف الصورة القديمة)، فرق بس
  // بالقيمة الحالية/الدالة المستخدمة لكل وحدة.
  async function uploadImage(
    file: Blob,
    previous: string,
    setValue: (path: string) => void,
    setBusy: (busy: boolean) => void,
  ) {
    setBusy(true);
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
      setValue(payload.path);
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
      setBusy(false);
    }
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file, cardImage, setCardImage, setUploading);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleBannerPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    if (!file) return;
    setCroppingBanner(file);
  }

  // صورة الغلاف عريضة جدًا بصفحة التفاصيل العامة (شبيهة بشريط الإعلانات) -
  // القص هنا يخليك تحددين الجزء المهم من الصورة بدل ما يقصّه المتصفح
  // تلقائيًا (object-fit: cover) بشكل عشوائي.
  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    if (!file) return;
    setCroppingCover(file);
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
              <ColorSwatchPicker value={backgroundColor} onChange={setBackgroundColor} />
              <input type="hidden" name="backgroundColor" value={backgroundColor} />
              <input type="hidden" name="bannerImage" value={bannerImage} />
            </>
          ) : (
            <>
              {program!.featured && <span className="badge badge-warn">★ مميز</span>}
              {program!.isNew && <span className="badge badge-teal">جديد</span>}
              <span className={`badge ${statusBadgeClass[program!.status]}`}>
                {statusLabel[program!.status]}
              </span>
              <span
                className="color-swatch-view-dot"
                style={{ background: program!.backgroundColor }}
                title="لون البرنامج"
                aria-hidden="true"
              />
            </>
          )}
        </div>
        {editing && (
          <small
            className="upload-hint slider-count-hint"
            style={otherSliderCount >= 5 ? { color: "var(--danger)" } : undefined}
          >
            {otherSliderCount} من 5 برامج أخرى مفعّلة بالسلايدر حاليًا
            {otherSliderCount >= 5
              ? " — السلايدر يعرض 5 كحد أقصى، هذا البرنامج لن يظهر إن فعّلتِه"
              : ""}
          </small>
        )}
        {editing && showInSlider && (
          <div className="admin-banner-upload">
            <button
              type="button"
              className="card-image admin-image-edit admin-banner-image"
              onClick={() => bannerFileInputRef.current?.click()}
              disabled={bannerUploading}
            >
              {bannerImage ? (
                <Image
                  src={getPublicImageUrl(bannerImage)}
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
                {bannerUploading ? "جاري الرفع..." : "اضغطي لإضافة بانر شريط الإعلانات"}
              </span>
            </button>
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerPick}
              style={{ display: "none" }}
            />
            <small className="upload-hint">
              يُفضّل مقاس أفقي عريض جدًا بنسبة 5:1 تقريبًا (١٢٠٠×٢٤٠ بكسل تقريبًا) ليملأ شريط
              الإعلانات بوضوح على الشاشات الكبيرة — بعد اختيار الصورة تقدرين تحددين منطقة القص
              بنفس النسبة. لو ما رفعتِ صورة هنا، يُستخدم مؤقتًا نفس صورة الكارد.
            </small>
          </div>
        )}

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
            <span>
              <Tag />
              {editing ? (
                <select
                  name="categoryId"
                  defaultValue={program?.categoryId || ""}
                  className="inline-input inline-input-meta"
                >
                  <option value="">بدون تصنيف</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                program!.category?.name || "بدون تصنيف"
              )}
            </span>
            <span>
              <User />
              {editing ? (
                <select
                  name="targetAudienceId"
                  defaultValue={program?.targetAudienceId || ""}
                  className="inline-input inline-input-meta"
                >
                  <option value="">بدون فئة</option>
                  {audiences.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              ) : (
                program!.targetAudience?.name || "بدون فئة"
              )}
            </span>
          </div>
          {editing && (
            <small className="upload-hint">
              التاريخ والمشاركات والموقع والفئة المستهدفة فوق - هذي هي نفسها اللي تظهر بكرت
              &quot;معلومات البرنامج&quot; بصفحة تفاصيل البرنامج العامة.
            </small>
          )}

          {editing && (
            <button
              type="button"
              className="admin-details-btn"
              onClick={() => setDetailsOpen(true)}
            >
              <FileText size={15} />
              {description ? "تعديل تفاصيل البرنامج" : "إضافة تفاصيل البرنامج"}
              {!description && <span className="admin-details-btn-warn">لسا ما أُضيفت</span>}
            </button>
          )}

          {editing && !isNewProgram && (
            <>
              {/* حقول موجودة بالبرنامج بس مو معروضة على الكارد - تُحفظ بقيمتها الحالية بدون تغيير */}
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="shortDescription" value={program!.shortDescription} />
              <input type="hidden" name="description" value={description} />
              {/* الغلاف بصفحة تفاصيل البرنامج مستقل الحين (تُعدّل من نافذة التفاصيل) - لو
                  تركتِه فاضي، saveProgramAction يستخدم صورة الكارد تلقائيًا كخيار احتياطي */}
              <input type="hidden" name="coverImage" value={coverImage} />
              <input type="hidden" name="cardImage" value={cardImage} />
              <input type="hidden" name="goals" value={goals} />
              <input type="hidden" name="features" value={features} />
              <input type="hidden" name="requirements" value={requirements} />
              <input type="hidden" name="faq" value={faq} />
              <input type="hidden" name="endDate" value={toDateTimeLocal(program!.endDate)} />
              <input
                type="hidden"
                name="registrationDeadline"
                value={toDateTimeLocal(program!.registrationDeadline)}
              />
              <input type="hidden" name="price" value={program!.price} />
            </>
          )}
          {isNewProgram && (
            <>
              <input type="hidden" name="cardImage" value={cardImage} />
              <input type="hidden" name="coverImage" value={coverImage} />
              <input type="hidden" name="description" value={description} />
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="goals" value={goals} />
              <input type="hidden" name="features" value={features} />
              <input type="hidden" name="requirements" value={requirements} />
              <input type="hidden" name="faq" value={faq} />
            </>
          )}

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
      {confirmingDelete &&
        createPortal(
          // Portal لـdocument.body - بدونه النافذة تنحصر بحدود الكارد لأن
          // .program-card:hover فيه transform (يصنع Containing Block جديد
          // لأي position:fixed جواه). نفس الحل المستخدم بـImageCropModal.
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
                <Button type="button" variant="outline" onClick={() => setConfirmingDelete(false)}>
                  إلغاء
                </Button>
                <Button
                  type="button"
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
          </div>,
          document.body,
        )}
      {croppingBanner && (
        <ImageCropModal
          file={croppingBanner}
          aspectRatio={5 / 1}
          onCancel={() => setCroppingBanner(null)}
          onCropped={(blob) => {
            setCroppingBanner(null);
            uploadImage(blob, bannerImage, setBannerImage, setBannerUploading);
          }}
        />
      )}
      {croppingCover && (
        <ImageCropModal
          file={croppingCover}
          aspectRatio={3 / 1}
          onCancel={() => setCroppingCover(null)}
          onCropped={(blob) => {
            setCroppingCover(null);
            uploadImage(blob, coverImage, setCoverImage, setCoverUploading);
          }}
        />
      )}
      {detailsOpen &&
        createPortal(
          // Portal لـdocument.body - نفس سبب نافذة تأكيد الحذف فوق بالضبط
          // (containing block جديد من transform الكارد عند :hover).
          <div
            className="modal-overlay"
            role="presentation"
            onMouseDown={(e) => {
              if (e.currentTarget === e.target) setDetailsOpen(false);
            }}
          >
            <div
              className="modal program-details-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="details-title"
            >
              <h2 id="details-title">تفاصيل البرنامج</h2>
              <FormField
                label="الرابط المختصر (Slug)"
                htmlFor="program-slug"
                hint="يُولّد تلقائيًا من الاسم عند تركه فارغًا"
              >
                <Input id="program-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </FormField>

              <FormField label="صورة غلاف صفحة تفاصيل البرنامج" htmlFor="program-cover">
                <button
                  type="button"
                  id="program-cover"
                  className="card-image admin-image-edit admin-cover-image"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={coverUploading}
                >
                  {coverImage ? (
                    <Image src={getPublicImageUrl(coverImage)} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <span className="image-empty" aria-hidden="true">
                      طاقات
                    </span>
                  )}
                  <span className="admin-image-edit-hint">
                    {coverUploading ? "جاري الرفع..." : "اضغطي لإضافة صورة الغلاف"}
                  </span>
                </button>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCoverPick}
                  style={{ display: "none" }}
                />
              </FormField>
              <p className="upload-hint">
                بعد اختيار الصورة تقدرين تحددين منطقة القص بنسبة عريضة تناسب شريط الغلاف
                (تشبه شريط الإعلانات). لو تركتِها فاضية، تُستخدم صورة الكارد تلقائيًا. هذي
                الصورة تظهر أعلى صفحة تفاصيل البرنامج العامة (خلف اسم البرنامج).
              </p>

              <p className="upload-hint">
                هذا النص يظهر بقسم &quot;تفاصيل البرنامج&quot; بصفحة تفاصيل البرنامج العامة
                (اللي يشوفها الزوار)، منفصل عن الوصف المختصر اللي يبان على الكارد. يُحفظ فورًا
                أثناء الكتابة.
              </p>
              <textarea
                className="input textarea"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتبي الوصف التفصيلي الكامل للبرنامج هنا..."
              />

              <FormField
                label="أهداف البرنامج"
                htmlFor="program-goals"
                hint="نقطة واحدة بكل سطر - تظهر كقائمة بصفحة البرنامج"
              >
                <textarea
                  id="program-goals"
                  className="input textarea"
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder={"مثال:\nتنمية مهارات التواصل\nبناء الثقة بالنفس"}
                />
              </FormField>

              <FormField
                label="مميزات البرنامج"
                htmlFor="program-features"
                hint="نقطة واحدة بكل سطر - تظهر كقائمة بصفحة البرنامج"
              >
                <textarea
                  id="program-features"
                  className="input textarea"
                  rows={3}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder={"مثال:\nمدرّبات معتمدات\nشهادة حضور معتمدة"}
                />
              </FormField>

              <FormField
                label="المتطلبات"
                htmlFor="program-requirements"
                hint="نقطة واحدة بكل سطر - تظهر كقائمة بصفحة البرنامج"
              >
                <textarea
                  id="program-requirements"
                  className="input textarea"
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder={"مثال:\nجهاز لابتوب أو تابلت\nحماس للتعلم"}
                />
              </FormField>

              <FormField
                label="الأسئلة الشائعة"
                htmlFor="program-faq"
                hint="اكتبي السؤال بسطر، وجوابه بالسطر (أو الأسطر) اللي بعده مباشرة، وسطر فاضي بين كل سؤال والثاني"
              >
                <textarea
                  id="program-faq"
                  className="input textarea"
                  rows={5}
                  value={faq}
                  onChange={(e) => setFaq(e.target.value)}
                  placeholder={"مثال:\nهل يوجد شهادة حضور؟\nنعم، تُمنح لكل مشاركة أكملت البرنامج.\n\nما الفئة العمرية المناسبة؟\nمن 12 إلى 18 سنة."}
                />
              </FormField>

              <div className="modal-actions">
                <Button type="button" onClick={() => setDetailsOpen(false)}>
                  تم
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Card>
  );
}
