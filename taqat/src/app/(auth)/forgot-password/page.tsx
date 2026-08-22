import Link from "next/link";
import type { Metadata } from "next";
import { forgotPasswordAction } from "@/actions/auth";
import { ActionForm } from "@/components/forms";
import { FormField, Input } from "@/components/ui";
export const metadata: Metadata = { title: "استعادة كلمة المرور" };
export default function ForgotPage() {
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <blockquote>لا تقلقي، سنساعدك على العودة إلى حسابك بخطوات آمنة.</blockquote>
      </aside>
      <section className="auth-panel">
        <div className="auth-box">
          <h1>استعادة كلمة المرور</h1>
          <p>أدخلي بريدك وسنرسل رابط استعادة صالحًا لمدة ساعة.</p>
          <ActionForm action={forgotPasswordAction} submitLabel="إرسال تعليمات الاستعادة">
            <FormField label="البريد الإلكتروني" htmlFor="email">
              <Input id="email" name="email" type="email" required dir="ltr" />
            </FormField>
          </ActionForm>
          <p className="auth-bottom">
            <Link href="/login">العودة لتسجيل الدخول</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
