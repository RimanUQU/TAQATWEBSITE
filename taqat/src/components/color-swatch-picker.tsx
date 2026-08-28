"use client";
import { useState } from "react";

// اختصارات سريعة لألوان الهوية (تبقى موجودة للسرعة بس)، بجانب منتقي الطيف
// الكامل الاحترافي (input type="color" - نفس أداة نظام التشغيل/المتصفح
// الأصلية، فيها شريط الألوان كامل + تدرجات كل لون تلقائيًا عند التمرير).
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

  function applyHex(raw: string) {
    const hex = raw.trim();
    if (!HEX_PATTERN.test(hex)) {
      setError("صيغة اللون غير صحيحة، مثال: #FB5E96");
      return;
    }
    onChange(hex);
    setError("");
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
          {/* منتقي الطيف الكامل - يفتح أداة الألوان الأصلية بالمتصفح/النظام،
              فيها كل الألوان وتدرجاتها بالتمرير، بدون أي قيد على لون معيّن */}
          <label className="color-swatch-spectrum-label">
            <input
              type="color"
              className="color-swatch-spectrum"
              value={HEX_PATTERN.test(value) ? value : "#075658"}
              onChange={(e) => {
                setHexDraft(e.target.value);
                onChange(e.target.value);
                setError("");
              }}
            />
            اختاري أي لون بحرية
          </label>

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
                  setHexDraft(preset.hex);
                  onChange(preset.hex);
                  setError("");
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
              onBlur={(e) => applyHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyHex(hexDraft);
                }
              }}
              placeholder="#RRGGBB"
              dir="ltr"
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
              تم
            </button>
          </div>
          {error && <small className="color-swatch-error">{error}</small>}
        </div>
      )}
    </div>
  );
}
