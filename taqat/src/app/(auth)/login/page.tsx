import Link from "next/link";
import type { Metadata } from "next";
import { loginAction } from "@/actions/auth";
import { ActionForm, PasswordInput } from "@/components/forms";
import { FormField, Input } from "@/components/ui";
export const metadata: Metadata = { title: "تسجيل الدخول" };
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <blockquote>“كل طاقة بداخلك تستحق فرصة لتكبر وتُحدث فرقًا.”</blockquote>
      </aside>
      <section className="auth-panel">
        <div className="auth-box">
          <Link href="/" className="logo">
            <span>ط</span>
            <b>طاقات</b>
            <small>للفتيات</small>
          </Link>
          <h1>أهلًا بعودتك</h1>
          <p>سجّلي الدخول للمتابعة إلى حسابك وبرامجك.</p>
          <ActionForm action={loginAction} submitLabel="تسجيل الدخول">
            <input type="hidden" name="next" value={next || "/account"} />
            <FormField label="البريد الإلكتروني" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                dir="ltr"
              />
            </FormField>
            <PasswordInput />
            <Link href="/forgot-password" style={{ color: "var(--pink-700)" }}>
              نسيتِ كلمة المرور؟
            </Link>
          </ActionForm>
          <p className="auth-bottom">
            ليس لديك حساب؟ <Link href="/register">إنشاء حساب</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
