import Link from "next/link";
import type { Metadata } from "next";
import { resetPasswordAction } from "@/actions/auth";
import { ActionForm, PasswordInput } from "@/components/forms";
import { Alert } from "@/components/ui";
export const metadata: Metadata = { title: "تعيين كلمة مرور جديدة", robots: { index: false } };
export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <blockquote>خطوة أخيرة، ثم تعودين إلى حسابك وبرامجك.</blockquote>
      </aside>
      <section className="auth-panel">
        <div className="auth-box">
          <h1>كلمة مرور جديدة</h1>
          {token ? (
            <ActionForm action={resetPasswordAction} submitLabel="حفظ كلمة المرور">
              <input type="hidden" name="token" value={token} />
              <PasswordInput label="كلمة المرور الجديدة" />
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="تأكيد كلمة المرور"
              />
            </ActionForm>
          ) : (
            <Alert type="error">رابط الاستعادة غير مكتمل.</Alert>
          )}
          <p className="auth-bottom">
            <Link href="/login">العودة لتسجيل الدخول</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
