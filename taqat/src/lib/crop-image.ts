export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * تاخذ صورة (رابط blob: محلي من ملف مختار حديثًا، فما فيه مشكلة تلويث
 * الـCanvas) + مستطيل القص بالبكسل، وترجع الجزء المقصوص بس كصورة JPEG
 * جاهزة للرفع. JPEG دايمًا (بدل الحفاظ على نوع الصورة الأصلي) لأن ولا
 * وحدة من الأماكن الثلاثة تحتاج شفافية، وJPEG أكثر توافقًا عبر المتصفحات
 * لتصدير Canvas مقارنة بـWebP.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  crop: PixelCrop,
  quality = 0.92,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("تعذر إنشاء لوحة القص");
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("تعذر إنشاء الصورة المقصوصة"))),
      "image/jpeg",
      quality,
    );
  });
}
