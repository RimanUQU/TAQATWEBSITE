import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from "lucide-react";

export function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="site-footer">
      <span className="footer-decor footer-decor-left" aria-hidden="true">
        <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(70 76)">
            <path d="M0 40 C -6 16, -6 -8, 0 -30" stroke="#e8f7f5" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="-19" cy="6" rx="14" ry="8" fill="#e8f7f5" transform="rotate(-32 -19 6)" />
            <ellipse cx="18" cy="16" rx="13" ry="7.5" fill="#e8f7f5" transform="rotate(28 18 16)" />
            <g transform="translate(0 -30)">
              <circle r="18" fill="#ffd3e6" />
              <circle r="13" fill="#ff9cc4" />
              <circle r="7" fill="#e2568c" />
            </g>
          </g>
        </svg>
      </span>
      <span className="footer-decor footer-decor-right" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 92 C 32 74, 46 58, 52 22" stroke="#e8f7f5" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <ellipse cx="52" cy="22" rx="12" ry="7" fill="#ffb8d6" transform="rotate(-38 52 22)" />
          <ellipse cx="40" cy="46" rx="11" ry="6.5" fill="#e8f7f5" transform="rotate(-22 40 46)" />
        </svg>
      </span>

      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo light">
            <span>ط</span>
            <b>طاقات</b>
            <small>للفتيات</small>
          </Link>
          <p>{settings.footerDescription}</p>
          <div className="socials">
            <a href={settings.instagram} aria-label="إنستغرام">
              <Instagram size={17} />
            </a>
            <a href={settings.x} aria-label="منصة إكس">
              <Twitter size={17} />
            </a>
            <a href={settings.whatsapp} aria-label="واتساب">
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>روابط سريعة</h3>
          <Link href="/">الرئيسية</Link>
          <Link href="/about">من نحن</Link>
          <Link href="/programs">البرامج</Link>
          <Link href="/staff">الكادر الوظيفي</Link>
        </div>

        <div className="footer-col">
          <h3>معلومات مهمة</h3>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/terms">الشروط والأحكام</Link>
          <Link href="/faq">الأسئلة الشائعة</Link>
        </div>

        <div className="footer-col">
          <h3>تواصلي معنا</h3>
          <p><Mail size={18} /> {settings.email}</p>
          <p><Phone size={18} /> {settings.mobile}</p>
          <p><MapPin size={18} /> {settings.address}</p>
        </div>
      </div>

      <div className="container copyright">© {new Date().getFullYear()} {settings.copyright}</div>
    </footer>
  );
}
