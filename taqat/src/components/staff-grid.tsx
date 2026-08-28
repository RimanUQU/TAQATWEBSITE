"use client";

import { motion } from "motion/react";
import { StaffCard, type StaffMember } from "./cards";

/**
 * غلاف Client Component مسؤول فقط عن حركة ظهور الكروت عند دخولها الشاشة.
 * التوزيع (Grid) ومنطق المجموعات يبقى كما هو من الصفحة الأصلية —
 * هذا المكوّن لا يغيّر البيانات ولا الترتيب، فقط يضيف حركة بصرية خفيفة.
 */
export function StaffGrid({
  members,
  tone,
  isLead = false,
}: {
  members: StaffMember[];
  tone: "pink" | "teal";
  isLead?: boolean;
}) {
  return (
    <div className={`staff-grid${isLead ? " staff-grid-lg" : ""}`}>
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          className="staff-card-anim"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.45,
            delay: Math.min(index * 0.07, 0.35),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <StaffCard member={member} tone={tone} />
        </motion.div>
      ))}
    </div>
  );
}
