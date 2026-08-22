import { saveHomepageAction } from "@/actions/admin";
import { AdminHeader, ActiveToggle, TextField } from "@/components/admin-ui";
import { Alert, Button } from "@/components/ui";
import { getSettings } from "@/lib/settings";
export default async function HomepageSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <>
      <AdminHeader
        title="إعدادات الصفحة الرئيسية"
        subtitle="تحكمي في ظهور الأقسام وعناوينها. تُدار شرائح السلايدر من حقول البرنامج."
      />
      {sp.saved && <Alert type="success">تم حفظ إعدادات الصفحة الرئيسية.</Alert>}
      <form action={saveHomepageAction} className="panel admin-form">
        <TextField name="programsHeading" label="عنوان قسم البرامج" value={s.programsHeading} />
        <ActiveToggle
          name="showPrograms"
          checked={s.showPrograms === "true"}
          label="إظهار قسم البرامج"
        />
        <TextField name="partnersHeading" label="عنوان قسم الشركاء" value={s.partnersHeading} />
        <ActiveToggle
          name="showPartners"
          checked={s.showPartners === "true"}
          label="إظهار قسم الشركاء"
        />
        <TextField
          name="statisticsHeading"
          label="عنوان قسم الإحصائيات"
          value={s.statisticsHeading}
        />
        <ActiveToggle
          name="showStatistics"
          checked={s.showStatistics === "true"}
          label="إظهار قسم الإحصائيات"
        />
        <TextField
          name="testimonialsHeading"
          label="عنوان قسم قالوا عنا"
          value={s.testimonialsHeading}
        />
        <ActiveToggle
          name="showTestimonials"
          checked={s.showTestimonials === "true"}
          label="إظهار قسم قالوا عنا"
        />
        <Button className="full">حفظ التغييرات</Button>
      </form>
    </>
  );
}
