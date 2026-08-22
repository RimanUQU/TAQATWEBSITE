import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/actions/admin";
import { AdminHeader, AreaField, TextField } from "@/components/admin-ui";
import { Alert, Button } from "@/components/ui";
export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <>
      <AdminHeader
        title="الإعدادات العامة"
        subtitle="هوية الموقع وبيانات التواصل والظهور في محركات البحث."
      />
      {sp.saved && <Alert type="success">تم حفظ التغييرات بنجاح.</Alert>}
      <form action={saveSettingsAction} className="panel admin-form">
        <h2 className="full">هوية الموقع</h2>
        <TextField name="clubName" label="اسم النادي" value={s.clubName} required />
        <TextField name="logo" label="رابط الشعار" value={s.logo} />
        <h2 className="full">التواصل</h2>
        <TextField name="email" label="البريد الإلكتروني" type="email" value={s.email} />
        <TextField name="phone" label="الهاتف" value={s.phone} />
        <TextField name="mobile" label="الجوال" value={s.mobile} />
        <TextField name="address" label="العنوان" value={s.address} />
        <h2 className="full">التواصل الاجتماعي</h2>
        <TextField name="instagram" label="Instagram" value={s.instagram} />
        <TextField name="x" label="X / Twitter" value={s.x} />
        <TextField name="whatsapp" label="WhatsApp" value={s.whatsapp} />
        <h2 className="full">التذييل وSEO</h2>
        <AreaField name="footerDescription" label="وصف التذييل" value={s.footerDescription} />
        <TextField name="copyright" label="نص الحقوق" value={s.copyright} full />
        <TextField name="siteTitle" label="عنوان الموقع" value={s.siteTitle} />
        <TextField
          name="defaultSocialImage"
          label="صورة المشاركة الافتراضية"
          value={s.defaultSocialImage}
        />
        <AreaField name="metaDescription" label="وصف محركات البحث" value={s.metaDescription} />
        <Button className="full">حفظ التغييرات</Button>
      </form>
    </>
  );
}
