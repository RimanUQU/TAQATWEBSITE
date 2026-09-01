import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { registerAction } from "@/actions/auth";
import { ActionForm, PasswordInput } from "@/components/forms";
import { FormField, Input } from "@/components/ui";
export const metadata: Metadata = { title: "إنشاء حساب" };
export default function RegisterPage() {
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <blockquote>انضمي إلى مجتمع يؤمن بقدرتك، وابدئي رحلة اكتشاف طاقاتك.</blockquote>
      </aside>
      <section className="auth-panel">
        <div className="auth-box">
          <Link href="/" className="auth-logo" aria-label="نادي طاقات للفتيات">
            <Image src="/brand/logo-mark.png" alt="" width={720} height={720} />
          </Link>
          <h1>إنشاء حساب</h1>
          <p>بيانات بسيطة تفصلك عن تجربتك الأولى معنا.</p>
          <ActionForm action={registerAction} submitLabel="إنشاء الحساب">
            <FormField label="الاسم الكامل" htmlFor="name">
              <Input id="name" name="name" required autoComplete="name" />
            </FormField>
            <FormField label="البريد الإلكتروني" htmlFor="email">
              <Input id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
            </FormField>
            <FormField label="رقم الجوال" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
              />
            </FormField>
            <PasswordInput label="كلمة المرور" />
            <PasswordInput id="confirmPassword" name="confirmPassword" label="تأكيد كلمة المرور" />
          </ActionForm>
          <p className="auth-bottom">
            لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
