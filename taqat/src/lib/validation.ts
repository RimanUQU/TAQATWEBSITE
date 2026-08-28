import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "الاسم يجب أن يتكون من 3 أحرف على الأقل"),
    email: z.email("يرجى إدخال بريد إلكتروني صحيح").transform((v) => v.toLowerCase()),
    phone: z.string().regex(/^(?:\+?966|0)?5\d{8}$/, "يرجى إدخال رقم جوال سعودي صحيح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف إنجليزي كبير")
      .regex(/\d/, "يجب أن تحتوي على رقم"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "البيانات المدخلة غير صحيحة";
}
