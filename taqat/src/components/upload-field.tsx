"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Button, FormField, Input } from "./ui";
import { ImageCropModal } from "./image-crop-modal";

const folderFor = (name: string) =>
  name === "image" ? "staff" : name === "logo" ? "partners" : "programs";

export function UploadField({
  name,
  label,
  value = "",
  required = false,
  aspectRatio,
}: {
  name: string;
  label: string;
  value?: string;
  required?: boolean;
  // نسبة عرض اختيارية - لو مرّرتها الصفحة المستخدمة، تفتح نافذة قص الصورة
  // أول ما تُختار صورة، قبل الرفع. بدونها يبقى السلوك القديم كما هو تمامًا.
  aspectRatio?: number;
}) {
  const [url, setUrl] = useState(value),
    [message, setMessage] = useState(""),
    [uploading, setUploading] = useState(false),
    [pendingFile, setPendingFile] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function deletePrevious(path: string) {
    if (!path || path.startsWith("/") || /^https?:\/\//i.test(path)) return;
    await fetch("/api/admin/delete-image", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
    });
  }

  async function performUpload(blob: Blob) {
    setUploading(true);
    setMessage("جاري رفع الصورة...");
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: blob.type, size: blob.size, folder: folderFor(name) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "تعذر تجهيز رفع الصورة");
      const { error } = await getSupabaseBrowser()
        .storage.from("uploads")
        .uploadToSignedUrl(payload.path, payload.token, blob, {
          contentType: blob.type,
          cacheControl: "3600",
        });
      if (error) throw error;
      const previous = url;
      setUrl(payload.path);
      await deletePrevious(previous);
      if (ref.current) ref.current.value = "";
      setMessage("تم رفع الصورة بنجاح");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  async function upload() {
    const file = ref.current?.files?.[0];
    if (!file) return setMessage("اختاري صورة أولًا");
    await performUpload(file);
  }

  return (
    <>
      <FormField
        label={label}
        htmlFor={name}
        hint={message || "PNG أو JPG أو WebP، بحد أقصى 5MB. يمكن أيضًا لصق رابط."}
      >
        <Input
          id={name}
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required={required}
        />
        <div className="table-actions">
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label={`اختيار ${label}`}
            disabled={uploading}
            onChange={(e) => {
              if (!aspectRatio) return;
              const file = e.target.files?.[0];
              if (file) setPendingFile(file);
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={upload} disabled={uploading}>
            {uploading ? "جاري الرفع..." : "رفع"}
          </Button>
        </div>
      </FormField>
      {aspectRatio && pendingFile && (
        <ImageCropModal
          file={pendingFile}
          aspectRatio={aspectRatio}
          onCancel={() => {
            setPendingFile(null);
            if (ref.current) ref.current.value = "";
          }}
          onCropped={(blob) => {
            setPendingFile(null);
            performUpload(blob);
          }}
        />
      )}
    </>
  );
}
