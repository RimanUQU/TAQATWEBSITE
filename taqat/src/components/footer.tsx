import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand-logo" aria-label="نادي طاقات للفتيات">
            <Image src="/brand/logo-mark.png" alt="" width={720} height={720} />
          </Link>
          <p>{settings.footerDescription}</p>
          <div className="socials">
            <a href={settings.instagram} aria-label="إنستغرام">
              انستغرام
            </a>
            <a href={settings.x} aria-label="منصة إكس">
              إكس
            </a>
            <a href={settings.whatsapp} aria-label="واتساب">
              واتساب
            </a>
          </div>
        </div>
        <div>
          <h3>روابط سريعة</h3>
          <Link href="/">الرئيسية</Link>
          <Link href="/about">من نحن</Link>
          <Link href="/programs">البرامج</Link>
          <Link href="/staff">الكادر الوظيفي</Link>
        </div>
        <div>
          <h3>معلومات مهمة</h3>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/terms">الشروط والأحكام</Link>
          <Link href="/faq">الأسئلة الشائعة</Link>
        </div>
        <div>
          <h3>تواصلي معنا</h3>
          <p>
            <Mail size={18} /> {settings.email}
          </p>
          <p>
            <Phone size={18} /> {settings.mobile}
          </p>
          <p>
            <MapPin size={18} /> {settings.address}
          </p>
        </div>
      </div>
      <div className="container copyright">
        © {new Date().getFullYear()} {settings.copyright}
      </div>
    </footer>
  );
}
