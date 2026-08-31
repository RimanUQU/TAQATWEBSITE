"use client";

import { useState, type ReactNode } from "react";
import { Heart, LockKeyhole, MessageSquareText, UserRound } from "lucide-react";

type TabId = "profile" | "favorites" | "feedback" | "security";
const tabs: { id: TabId; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "بياناتي الشخصية", icon: UserRound },
  { id: "favorites", label: "البرامج المفضلة", icon: Heart },
  { id: "feedback", label: "آرائي ومقترحاتي", icon: MessageSquareText },
  { id: "security", label: "الأمان وكلمة المرور", icon: LockKeyhole },
];

export function AccountTabs({ sections }: { sections: Record<TabId, ReactNode> }) {
  const [active, setActive] = useState<TabId>("profile");
  return (
    <div className="account-layout">
      <nav className="account-tabs" aria-label="أقسام الحساب">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={active === id ? "active" : ""} onClick={() => setActive(id)}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="account-tab-content">{sections[active]}</div>
    </div>
  );
}
