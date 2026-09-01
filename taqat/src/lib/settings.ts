import { db } from "./db";

export const defaults = {
  heroEyebrow: "جمعية طاقات الشبابية – مكة المكرمة",
  heroTitle: "نادي طاقات للفتيات",
  heroSubtitle:
    "مركز تربوي يفتح لكِ أبواب النمو والانطلاق، ينمّي مهاراتكِ ويرسّخ قيمكِ ضمن بيئة آمنة وجاذبة تواكب روح العصر — لتكتشفي طاقتكِ الحقيقية وتصنعي أثرك الخاص معنا.",
  clubName: "نادي طاقات للفتيات",
  email: "hello@taqat.sa",
  phone: "011 000 0000",
  mobile: "050 000 0000",
  address: "الرياض، المملكة العربية السعودية",
  footerDescription: "مساحة ملهمة تمكّن الفتيات وتنمّي طاقاتهن عبر برامج نوعية ومجتمع داعم.",
  copyright: "جميع الحقوق محفوظة لنادي طاقات للفتيات",
  instagram: "https://instagram.com",
  x: "https://x.com",
  whatsapp: "https://wa.me/966500000000",
  tiktok: "",
  snapchat: "",
  siteTitle: "نادي طاقات للفتيات",
  metaDescription: "نصنع بيئة ملهمة للفتيات لاكتشاف طاقاتهن وبناء مستقبلهن.",
  logo: "",
  defaultSocialImage: "",
  showPrograms: "true",
  showPartners: "true",
  showStatistics: "true",
  showTestimonials: "true",
  showStatBeneficiaries: "true",
  showStatPartners: "true",
  showStatPrograms: "true",
  showStatSatisfaction: "true",
  programsHeading: "برامج صنعت لتُلهمك",
  partnersHeading: "شركاؤنا",
  statisticsHeading: "أثرٌ يكبر مع كل طاقة",
  testimonialsHeading: "قالوا عنا",
  sectionEyebrow: "طاقات تُلهم",
  programsSubtitle: "مساحات آمنة وتجارب عملية تساعدك على اكتشاف قدراتك وبناء مهاراتك.",
  programsCta: "عرض جميع البرامج",
  partnersSubtitle: "شركاء النجاح... ممتنون دائمًا لدعمكم وثقتكم برسالتنا.",
  partnersCta: "تعرّفي على رحلة طاقات ←",
  testimonialsSubtitle: "قصص وتجارب نعتز بها من مجتمع طاقات.",
};

export async function getSettings() {
  const rows = await db.siteSetting.findMany();
  return { ...defaults, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
}
