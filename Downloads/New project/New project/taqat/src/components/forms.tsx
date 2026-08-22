"use client";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, FormField, Input, Textarea, Alert } from "./ui";
import type { ActionState } from "@/lib/utils";

export function PasswordInput({
  id = "password",
  name = "password",
  label = "كلمة المرور",
}: {
  id?: string;
  name?: string;
  label?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <FormField label={label} htmlFor={id}>
      <div className="password-wrap">
        <Input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          required
          autoComplete={name === "password" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setShown(!shown)}
          aria-label={shown ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {shown ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </FormField>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel,
  className = "",
}: {
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children}
      {state.message && <Alert type={state.ok ? "success" : "error"}>{state.message}</Alert>}
      <Button type="submit" disabled={pending}>
        {pending ? "جاري التنفيذ..." : submitLabel}
      </Button>
    </form>
  );
}

export function CommentForm({
  action,
}: {
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
}) {
  return (
    <ActionForm action={action} submitLabel="إرسال التعليق" className="comment-form">
      <FormField label="أضف تعليقك" htmlFor="body">
        <Textarea
          id="body"
          name="body"
          minLength={5}
          maxLength={1000}
          required
          rows={4}
          placeholder="شاركينا رأيك وتجربتك..."
        />
      </FormField>
    </ActionForm>
  );
}
