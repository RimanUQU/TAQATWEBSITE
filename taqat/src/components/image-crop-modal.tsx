"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "./ui";
import { getCroppedImageBlob, type PixelCrop } from "@/lib/crop-image";

/**
 * نافذة قص صورة واحدة قابلة لإعادة الاستخدام بكل أماكن رفع الصور بالموقع -
 * كل مكان يمرر لها بس نسبة العرض (aspectRatio) المناسبة لحجمه الفعلي
 * بالتصميم، بدل ما نبني نافذة قص منفصلة لكل مكان.
 */
export function ImageCropModal({
  file,
  aspectRatio,
  onCancel,
  onCropped,
}: {
  file: File;
  aspectRatio: number;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}) {
  // رابط الصورة يُنشأ ويُحذف داخل نفس الـEffect (مو بـuseState) عمدًا: بوضع
  // React الصارم بالتطوير (Strict Mode)، React ينفّذ الـEffect وتنظيفه مرتين
  // فورًا عند التركيب - لو أنشأنا الرابط بـuseState وحذفناه بـEffect منفصل،
  // التنظيف الأول كان يحذف الرابط الوحيد الموجود فيصير غير صالح قبل حتى ما
  // تبان الصورة (هذا كان سبب "الصورة ما تبين" و"تعذر قص الصورة"). بهالطريقة،
  // كل تشغيل للـEffect يربط إنشاءه بحذفه هو نفسه بس، فآخر رابط ينشأ يبقى شغّال.
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // استثناء مقصود: هذا مو "قيمة مشتقة" كان ممكن نحسبها وقت التصيير - هذا
    // تزامن مع نظام خارجي (سجل روابط blob بالمتصفح) يحتاج إنشاء وتنظيف
    // فعليين، ونفس النمط الموثّق رسميًا بمستندات React لهذا النوع بالضبط.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // ارتفاع منطقة القص محسوب من عرض ثابت (640) على نسبة العرض المطلوبة،
  // بحد أدنى وأقصى عشان أي نسبة (حتى العريضة جدًا زي شريط الإعلانات
  // 5:1) تبقى منطقة سحب/تكبير قابلة للاستخدام.
  const stageHeight = Math.min(420, Math.max(200, 640 / aspectRatio));

  async function handleConfirm() {
    if (!croppedAreaPixels || !imageUrl) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageUrl, croppedAreaPixels);
      onCropped(blob);
    } catch (err) {
      alert(err instanceof Error ? err.message : "تعذر قص الصورة");
    } finally {
      setSaving(false);
    }
  }

  // نطبع النافذة مباشرة على <body> (Portal) بدل ما تبقى جوا شجرة كرت
  // البرنامج - لأن كرت البرنامج نفسه له تأثير حركي بالمرور بالماوس
  // (transform عند :hover)، وأي عنصر position:fixed جوا عنصر متحرك بـ
  // transform ينحصر بمساحة ذاك العنصر بدل الشاشة كاملة (نفس اللي شفتيه:
  // النافذة تبين صغيرة وكأنها داخل الكرت). الـPortal يتفادى هالمشكلة نهائيًا.
  if (!imageUrl) return null;
  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onCancel();
      }}
    >
      <div
        className="modal image-crop-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
      >
        <h2 id="crop-modal-title">قص الصورة</h2>
        <p className="upload-hint">حرّكي الصورة وكبّريها/صغّريها لتناسب الإطار، ثم احفظي.</p>
        <div className="crop-stage" style={{ height: stageHeight }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area: Area, pixels: Area) => setCroppedAreaPixels(pixels)}
          />
        </div>
        <div className="crop-zoom-row">
          <label htmlFor="crop-zoom">تكبير</label>
          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            dir="ltr"
            className="crop-zoom-range"
          />
        </div>
        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={saving || !croppedAreaPixels}>
            {saving ? "جاري القص..." : "قص وحفظ"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
