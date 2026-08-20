"use client";

import { useId, useState } from "react";

function iconLabel(icon: string) {
  return decodeURIComponent(icon.split("/").pop() || "").replace(/\.svg$/i, "").replace(/[-_]/g, " ");
}

export function StaffIconPicker({ icons, value = "" }: { icons: string[]; value?: string }) {
  const [selected, setSelected] = useState(value);
  const id = useId();
  return <div className="field full">
    <label htmlFor={id}>أيقونة المنصب</label>
    <div className="staff-icon-picker">
      <div className="staff-icon-preview" aria-hidden="true">{selected ? <img src={selected} alt="" /> : <span>ط</span>}</div>
      <select id={id} name="icon" className="input" value={selected} onChange={(event) => setSelected(event.target.value)}>
        <option value="">الأيقونة الحيادية</option>
        {icons.map((icon) => <option key={icon} value={icon}>{iconLabel(icon)}</option>)}
      </select>
    </div>
    <small>{icons.length ? "تظهر ملفات SVG الموجودة في public/staff-icons تلقائيًا هنا." : "أضيفي ملفات SVG إلى public/staff-icons لتظهر هنا تلقائيًا."}</small>
  </div>;
}
