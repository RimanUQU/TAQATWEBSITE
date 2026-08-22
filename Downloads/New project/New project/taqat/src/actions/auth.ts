"use server";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, createSession, getUser } from "@/lib/auth";
import { firstError, loginSchema, registerSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/utils";

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: firstError(parsed.error) };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !user.active || !(await bcrypt.compare(parsed.data.password, user.passwordHash)))
    return { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  await createSession(user);
  const next = String(formData.get("next") || "/account");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/account");
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: firstError(parsed.error) };
  if (await db.user.findUnique({ where: { email: parsed.data.email } }))
    return { message: "يوجد حساب مسجل بهذا البريد الإلكتروني" };
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
  });
  await createSession(user);
  redirect("/account?success=welcome");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function forgotPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const raw = crypto.randomUUID() + crypto.randomUUID();
    const tokenHash = createHash("sha256").update(raw).digest("hex");
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 3_600_000) },
    });
    if (process.env.NODE_ENV !== "production")
      return { ok: true, message: `رابط التطوير الآمن: /reset-password?token=${raw}` };
  }
  return {
    ok: true,
    message:
      "إذا كان البريد مسجلًا فستصلك تعليمات الاستعادة. في بيئة التطوير راجع قاعدة البيانات أو موفر البريد المهيأ.",
  };
}

export async function resetPasswordAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") || ""),
    password = String(formData.get("password") || ""),
    confirm = String(formData.get("confirmPassword") || "");
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
    return { message: "كلمة المرور يجب ألا تقل عن 8 أحرف وتحتوي على حرف كبير ورقم" };
  if (password !== confirm) return { message: "كلمتا المرور غير متطابقتين" };
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date())
    return { message: "رابط الاستعادة غير صالح أو انتهت صلاحيته" };
  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  return { ok: true, message: "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول." };
}

export async function updateAccountAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getUser();
  if (!user) return { message: "انتهت الجلسة، يرجى تسجيل الدخول" };
  const name = String(formData.get("name") || "").trim(),
    phone = String(formData.get("phone") || "").trim();
  if (name.length < 3) return { message: "الاسم قصير جدًا" };
  if (phone && !/^(?:\+?966|0)?5\d{8}$/.test(phone)) return { message: "رقم الجوال غير صحيح" };
  await db.user.update({ where: { id: user.id }, data: { name, phone } });
  return { ok: true, message: "تم حفظ التغييرات بنجاح." };
}

export async function deleteAccountAction() {
  const user = await getUser();
  if (!user) redirect("/login");
  await db.user.delete({ where: { id: user.id } });
  await clearSession();
  redirect("/?deleted=1");
}
