import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const pages = ["", "/about", "/programs", "/staff", "/privacy", "/terms", "/faq"];
  const programs = await db.program.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  return [
    ...pages.map((p) => ({ url: base + p, lastModified: new Date() })),
    ...programs.map((p) => ({ url: `${base}/programs/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
