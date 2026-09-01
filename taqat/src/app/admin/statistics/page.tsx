import { saveStatisticVisibilityAction } from "@/actions/admin";
import { ActiveToggle, AdminHeader } from "@/components/admin-ui";
import { Alert, Button } from "@/components/ui";
import { getSettings } from "@/lib/settings";
import { HOMEPAGE_STATS } from "@/lib/homepage-stats";
export default async function Statistics({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <>
      <AdminHeader
        title="الإحصائيات"
        subtitle="كل رقم هنا يُحسب تلقائيًا ولحظيًا من بيانات الموقع الحقيقية، وما يمكن كتابته يدويًا. تقدرين فقط إظهار أو إخفاء أي بطاقة من الصفحة الرئيسية."
      />
      {sp.saved && <Alert type="success">تم حفظ التغييرات.</Alert>}
      <form action={saveStatisticVisibilityAction} className="panel admin-form">
        {HOMEPAGE_STATS.map((stat) => (
          <ActiveToggle
            key={stat.key}
            name={stat.settingKey}
            checked={s[stat.settingKey] !== "false"}
            label={`إظهار "${stat.title}" بالصفحة الرئيسية`}
          />
        ))}
        <Button className="full">حفظ</Button>
      </form>
    </>
  );
}
