// تعريف ثابت لبطاقات قسم "الإحصائيات" بالصفحة الرئيسية. العناوين هنا نصوص
// وصفية فقط (مو أرقام) - القيمة الفعلية لكل بطاقة تُحسب دايمًا مباشرة من
// قاعدة البيانات وقت تحميل الصفحة (راجع src/app/page.tsx)، وما تُكتب يدويًا
// من أي مكان. صلاحية الأدمن الوحيدة هنا هي إظهار/إخفاء أي بطاقة (settingKey
// أدناه، تُدار من /admin/statistics وتُخزّن كـ SiteSetting).
export const HOMEPAGE_STATS = [
  {
    key: "beneficiaries",
    title: "المستفيدات",
    prefix: "+",
    suffix: null,
    settingKey: "showStatBeneficiaries",
  },
  {
    key: "partners",
    title: "شراكات فاعلة",
    prefix: "+",
    suffix: null,
    settingKey: "showStatPartners",
  },
  {
    key: "programs",
    title: "برنامجًا نوعيًا",
    prefix: "+",
    suffix: null,
    settingKey: "showStatPrograms",
  },
  {
    key: "satisfaction",
    title: "رضا المشاركات",
    prefix: null,
    suffix: "%",
    settingKey: "showStatSatisfaction",
  },
] as const;

export type HomepageStatKey = (typeof HOMEPAGE_STATS)[number]["key"];
