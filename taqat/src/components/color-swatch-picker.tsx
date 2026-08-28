"use client";
import { useState } from "react";

// 5 درجات من نفس نظام الألوان الرسمي المعتمد بـTaqat UI Style Guide (سكيلتي
// Pink وGreen/Teal بس - الدليل الرسمي ما فيه بنفسجي ولا أزرق ولا أصفر منفصل)،
// نفس القيم المستخدمة فعليًا بمتغيرات CSS بالمشروع (--pink-500 إلخ).
const PRESETS = [
  { hex: "#fb5e96", label: "وردي" },
  { hex: "#c9366c", label: "وردي غامق" },
  { hex: "#3b9391", label: "تركوازي" },
  { hex: "#286866", label: "تركوازي غامق" },
  { hex: "#075658", label: "تركوازي داكن" },
];

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(value);
  const [error, setError] = useState("");

  function applyHex() {
    const hex = hexDraft.trim();
    if (!HEX_PATTERN.test(hex)) {
      setError("صيغة اللون غير صحيحة، مثال: #FB5E96");
      return;
    }
    onChange(hex);
    setError("");
    setOpen(false);
  }

  return (
    <div className="color-swatch-picker">
      <button
        type="button"
        className="color-swatch-trigger"
        style={{ background: value }}
        onClick={() => {
          setHexDraft(value);
          setError("");
          setOpen((o) => !o);
        }}
        aria-label="لون البرنامج (يُستخدم بالكارد وشريط الإعلانات)"
        title="لون البرنامج"
      />
      {open && (
        <div className="color-swatch-panel" role="dialog" aria-label="اختيار لون البرنامج">
          <div className="color-swatch-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                className={`color-swatch-dot ${value.toLowerCase() === preset.hex ? "active" : ""}`}
                style={{ background: preset.hex }}
                title={preset.label}
                aria-label={preset.label}
                onClick={() => {
                  onChange(preset.hex);
                  setError("");
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <div className="color-swatch-hex-row">
            <input
              type="text"
              className="input color-swatch-hex-input"
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyHex();
                }
              }}
              placeholder="#RRGGBB"
              dir="ltr"
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={applyHex}>
              تطبيق
            </button>
          </div>
          {error && <small className="color-swatch-error">{error}</small>}
          <small className="upload-hint">يُفضّل استخدام الألوان الجاهزة أعلاه للحفاظ على هوية طاقات.</small>
        </div>
      )}
    </div>
  );
}
