import { saveHomepageAction } from "@/actions/admin";
import { AdminHeader, ActiveToggle, TextField, AreaField } from "@/components/admin-ui";
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
        subtitle="تحكمي في ظهور الأقسام وعناوينها ونصوصها. تُدار شرائح السلايدر من حقول البرنامج."
      />
      {sp.saved && <Alert type="success">تم حفظ إعدادات الصفحة الرئيسية.</Alert>}
      <form action={saveHomepageAction} className="panel admin-form">
        <TextField
          name="heroEyebrow"
          label="الشريط العلوي فوق العنوان الرئيسي"
          value={s.heroEyebrow}
          full
        />
        <TextField name="heroTitle" label="العنوان الرئيسي" value={s.heroTitle} full />
        <AreaField name="heroSubtitle" label="النص الفرعي الرئيسي" value={s.heroSubtitle} />

        <TextField
          name="sectionEyebrow"
          label="الشريط العلوي فوق كل عنوان قسم"
          value={s.sectionEyebrow}
          full
          hint="يظهر بنفس النص فوق عناوين كل الأقسام بالرئيسية (البرامج/الشركاء/الإحصائيات/قالوا عنا)"
        />
        <TextField name="programsHeading" label="عنوان قسم البرامج" value={s.programsHeading} />
        <ActiveToggle
          name="showPrograms"
          checked={s.showPrograms === "true"}
          label="إظهار قسم البرامج"
        />
        <TextField
          name="programsSubtitle"
          label="النص الفرعي لقسم البرامج"
          value={s.programsSubtitle}
          full
        />
        <TextField name="programsCta" label="نص زر عرض كل البرامج" value={s.programsCta} />

        <TextField name="partnersHeading" label="عنوان قسم الشركاء" value={s.partnersHeading} />
        <ActiveToggle
          name="showPartners"
          checked={s.showPartners === "true"}
          label="إظهار قسم الشركاء"
        />
        <TextField
          name="partnersSubtitle"
          label="النص الفرعي لقسم الشركاء"
          value={s.partnersSubtitle}
          full
        />
        <TextField name="partnersCta" label="نص رابط قسم الشركاء" value={s.partnersCta} />

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
        <TextField
          name="testimonialsSubtitle"
          label="النص الفرعي لقسم قالوا عنا"
          value={s.testimonialsSubtitle}
          full
        />

        <Button className="full">حفظ التغييرات</Button>
      </form>
    </>
  );
}
