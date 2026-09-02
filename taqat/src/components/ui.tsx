import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
}) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props} />;
}
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Link href={href} className={`btn btn-${variant} btn-${size} ${className}`}>
      {children}
    </Link>
  );
}
export function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="input textarea" {...props} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="input" {...props} />;
}
export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="check">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function Radio({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="check">
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function ToggleSwitch({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" {...props} />
      <span aria-hidden="true" />
      <b>{label}</b>
    </label>
  );
}
export function Badge({
  children,
  tone = "pink",
}: {
  children: ReactNode;
  tone?: "pink" | "teal" | "gray" | "warn";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Card({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return (
    <article className={`card ${className}`} {...rest}>
      {children}
    </article>
  );
}
export function Alert({
  children,
  type = "info",
}: {
  children: ReactNode;
  type?: "info" | "success" | "error";
}) {
  return (
    <div className={`alert alert-${type}`} role="status">
      {children}
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  center = true,
  eyebrow = "طاقات تُلهم",
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
  eyebrow?: string;
}) {
  return (
    <div className={`section-title ${center ? "center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسار التنقل" className="breadcrumb">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && " / "}
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty">
      <span>✦</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function LoadingSpinner() {
  return <span className="spinner" role="status" aria-label="جاري التحميل" />;
}
export function Skeleton() {
  return <div className="skeleton" aria-hidden="true" />;
}
export function Pagination({ page, total, base }: { page: number; total: number; base: string }) {
  if (total <= 1) return null;
  const pageHref = (n: number) => `${base}${base.includes("?") ? "&" : "?"}page=${n}`;
  return (
    <nav className="pagination" aria-label="صفحات النتائج">
      {page > 1 ? (
        <Link className="pagination-arrow" href={pageHref(page - 1)} aria-label="الصفحة السابقة">
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="pagination-arrow" aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      )}
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <Link
          className={n === page ? "active" : ""}
          aria-current={n === page ? "page" : undefined}
          href={pageHref(n)}
          key={n}
        >
          {n}
        </Link>
      ))}
      {page < total ? (
        <Link className="pagination-arrow" href={pageHref(page + 1)} aria-label="الصفحة التالية">
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className="pagination-arrow" aria-hidden="true">
          <ChevronLeft size={18} />
        </span>
      )}
    </nav>
  );
}
