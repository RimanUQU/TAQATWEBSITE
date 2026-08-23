import type { Program, ProgramCategory } from "@prisma/client";
import { saveProgramAction } from "@/actions/admin";
import { ActiveToggle, AdminHeader, AreaField, SelectField, TextField } from "./admin-ui";
import { UploadField } from "./upload-field";
import { Button } from "./ui";

const iso = (date?: Date) =>
  date
    ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    : "";

export function ProgramAdminForm({
  program,
  categories,
  sliderCount = 0,
  embedded = false,
  onCancel,
}: {
  program?: Program;
  categories: ProgramCategory[];
  sliderCount?: number;
  embedded?: boolean;
  onCancel?: () => void;
}) {
  return (
    <>
      {!embedded && <AdminHeader title={program ? "تعديل البرنامج" : "إضافة برنامج"} />}
      <form
        action={saveProgramAction.bind(null, program?.id)}
        className={embedded ? "admin-form admin-form-embedded" : "panel admin-form"}
      >
        <TextField name="title" label="اسم البرنامج" value={program?.title} required />
        <TextField
          name="slug"
          label="الرابط المختصر"
          value={program?.slug}
          hint="يُولّد تلقائيًا من الاسم عند تركه فارغًا"
        />
        <TextField
          name="shortDescription"
          label="الوصف المختصر"
          value={program?.shortDescription}
          full
          required
        />
        <AreaField name="description" label="الوصف الكامل" value={program?.description} />
        <UploadField name="coverImage" label="صورة الغلاف" value={program?.coverImage} />
        <UploadField name="cardImage" label="صورة البطاقة" value={program?.cardImage} />
        <TextField name="location" label="الموقع" value={program?.location} required />
        <SelectField name="categoryId" label="التصنيف" value={program?.categoryId || ""}>
          <option value="">بدون تصنيف</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <TextField
          name="startDate"
          label="تاريخ البداية"
          type="datetime-local"
          value={iso(program?.startDate)}
          required
        />
        <TextField
          name="endDate"
          label="تاريخ النهاية"
          type="datetime-local"
          value={iso(program?.endDate)}
          required
        />
        <TextField
          name="registrationDeadline"
          label="آخر موعد للتسجيل"
          type="datetime-local"
          value={iso(program?.registrationDeadline)}
          required
        />
        <TextField
          name="capacity"
          label="السعة"
          type="number"
          value={program?.capacity || 20}
          required
        />
        <TextField
          name="price"
          label="السعر (0 للمجاني)"
          type="number"
          value={program?.price || 0}
        />
        <SelectField name="status" label="حالة النشر" value={program?.status || "DRAFT"}>
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
        </SelectField>
        <div style={{ display: "grid", gap: 12 }}>
          <ActiveToggle name="featured" checked={program?.featured} label="برنامج مميز" />
          <ActiveToggle
            name="showInSlider"
            checked={program?.showInSlider}
            label="يظهر في سلايدر الرئيسية"
          />
          <small className="upload-hint" style={sliderCount >= 5 ? { color: "var(--danger)" } : undefined}>
            {sliderCount} من 5 برامج أخرى مفعّلة بالسلايدر حاليًا
            {sliderCount >= 5 ? " — السلايدر يعرض 5 كحد أقصى، هذا البرنامج لن يظهر إن فعّلتِه" : ""}
          </small>
          <ActiveToggle name="isNew" checked={program?.isNew} label="شارة جديد" />
        </div>
        <div className={embedded ? "admin-form-embedded-actions" : ""}>
          <Button className={embedded ? "" : "full"}>حفظ البرنامج</Button>
          {embedded && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
