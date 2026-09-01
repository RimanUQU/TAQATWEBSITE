"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui";

export function FeedbackDetailsDialog({
  typeLabel,
  programTitle,
  name,
  email,
  message,
  consent,
  statusLabel,
  statusTone,
}: {
  typeLabel: string;
  programTitle?: string | null;
  name: string;
  email: string;
  message: string;
  consent: boolean;
  statusLabel: string;
  statusTone: "warn" | "teal" | "gray";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [message]);

  return (
    <>
      <button
        type="button"
        className="text-preview-btn"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span ref={textRef} className="text-preview-text">{message}</span>
        {isTruncated && <span className="text-preview-more">(اضغطي للمزيد)</span>}
      </button>

      <dialog ref={dialogRef} className="feedback-dialog">
        <div className="feedback-dialog-panel">
          <button
            type="button"
            className="feedback-dialog-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="إغلاق"
          >
            ×
          </button>

          <div className="feedback-dialog-row">
            <strong>النوع</strong>
            <span>{typeLabel}</span>
          </div>
          {programTitle && (
            <div className="feedback-dialog-row">
              <strong>البرنامج</strong>
              <span>{programTitle}</span>
            </div>
          )}
          <div className="feedback-dialog-row">
            <strong>الاسم</strong>
            <span>{name}</span>
          </div>
          <div className="feedback-dialog-row">
            <strong>البريد</strong>
            <span>{email}</span>
          </div>
          <div className="feedback-dialog-row">
            <strong>موافقة العرض</strong>
            <Badge tone={consent ? "teal" : "gray"}>{consent ? "موافقة" : "بدون"}</Badge>
          </div>
          <div className="feedback-dialog-row">
            <strong>الحالة</strong>
            <Badge tone={statusTone}>{statusLabel}</Badge>
          </div>

          <div>
            <strong>الرأي كامل</strong>
            <p className="feedback-dialog-message">{message}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
