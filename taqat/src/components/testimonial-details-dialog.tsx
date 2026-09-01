"use client";

import { useEffect, useRef, useState } from "react";

export function TestimonialDetailsDialog({
  name,
  title,
  quote,
  rating,
  active,
}: {
  name: string;
  title?: string | null;
  quote: string;
  rating: number;
  active: boolean;
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
  }, [quote]);

  return (
    <>
      <button
        type="button"
        className="text-preview-btn"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span ref={textRef} className="text-preview-text">{quote}</span>
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
            <strong>الاسم</strong>
            <span>{name}</span>
          </div>
          {title && (
            <div className="feedback-dialog-row">
              <strong>الصفة</strong>
              <span>{title}</span>
            </div>
          )}
          <div className="feedback-dialog-row">
            <strong>التقييم</strong>
            <span>{rating}/5</span>
          </div>
          <div className="feedback-dialog-row">
            <strong>الحالة</strong>
            <span>{active ? "مفعّلة" : "غير مفعّلة"}</span>
          </div>

          <div>
            <strong>النص كامل</strong>
            <p className="feedback-dialog-message">{quote}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
