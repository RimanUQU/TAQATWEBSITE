import type { Metadata } from "next";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> { const s = await getSettings(); return { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), title: { default: s.siteTitle, template: `%s | ${s.clubName}` }, description: s.metaDescription, openGraph: { locale: "ar_SA", type: "website", title: s.siteTitle, description: s.metaDescription }, alternates: { canonical: "/" } }; }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const [user, settings] = await Promise.all([getUser(), getSettings()]); return <html lang="ar" dir="rtl"><body><Navigation user={user} /><main className="site-main">{children}</main><Footer settings={settings} /></body></html>; }
