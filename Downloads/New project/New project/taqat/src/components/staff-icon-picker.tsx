"use client";

import { useId, useState } from "react";

const iconLabels: Record<string, string> = {
  "neutral.svg": "الأيقونة الحيادية",
  "club-manager.svg": "مديرة النادي",
  "executive-director.svg": "المدير التنفيذي",
  "accounting.svg": "المحاسبة",
  "marketing-social-media.svg": "أخصائية التسويق والسوشل ميديا",
  "volunteering-lead.svg": "رئيسة قسم التطوع",
  "programs-lead.svg": "رئيسة البرامج",
  "programs-specialist.svg": "أخصائية البرامج",
  "administrative-assistant.svg": "مساعد إداري",
};

function iconLabel(icon: string) {
  const filename = decodeURIComponent(icon.split("/").pop() || "");
  return iconLabels[filename] || filename.replace(/\.svg$/i, "").replace(/[-_]/g, " ");
}

export function StaffIconPicker({ icons, value = "" }: { icons: string[]; value?: string }) {
  const neutralIcon = "/staff-icons/neutral.svg";
  const [selected, setSelected] = useState(value || neutralIcon);
  const id = useId();
  return <div className="field full">
    <label htmlFor={id}>أيقونة المنصب</label>
    <div className="staff-icon-picker">
      <div className="staff-icon-preview" aria-hidden="true">{selected ? <img src={selected} alt="" /> : <span>ط</span>}</div>
      <select id={id} name="icon" className="input" value={selected} onChange={(event) => setSelected(event.target.value)}>
        {icons.map((icon) => <option key={icon} value={icon}>{iconLabel(icon)}</option>)}
      </select>
    </div>
    <small>{icons.length ? "تظهر ملفات SVG الموجودة في public/staff-icons تلقائيًا هنا." : "أضيفي ملفات SVG إلى public/staff-icons لتظهر هنا تلقائيًا."}</small>
  </div>;
}
