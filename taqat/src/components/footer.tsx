import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function WhatsAppLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.45L3.5 20l1.08-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.4.8 1 1.4 1.8 1.8.2.1.4.1.5-.1l.6-.7c.1-.2.3-.2.5-.1l1.7.8c.2.1.3.3.2.6l-.2.8c-.1.4-.5.7-.9.8-1 .1-2.3-.4-3.5-1.3-1.1-.8-2-1.8-2.5-2.8-.5-1-.6-2-.2-2.7Z" />
    </svg>
  );
}

function TikTokLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M13.5 2h2.6c.2 1.5 1.1 2.8 2.5 3.5.6.3 1.3.5 2 .5v2.7c-1.5 0-2.9-.4-4.1-1.2v6.6c0 3.1-2.5 5.6-5.6 5.6S5.3 16.9 5.3 13.8c0-2.9 2.2-5.3 5-5.5v2.7c-1.4.2-2.5 1.4-2.5 2.8 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9V2Z" />
    </svg>
  );
}

function SnapchatLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2.5c2.9 0 5.1 2.3 5.1 5.4v2.1c0 .4.3.7.9 1 .6.3 1.4.5 1.9.6.3.1.5.3.5.6 0 .4-.4.7-1.2 1-.5.2-1.1.3-1.4.6-.2.2-.1.5 0 .8.2.6.6 1.4 1.6 1.7.3.1.3.4.1.6-.4.4-1.3.6-1.9.7-.1.3-.2.7-.3 1-.1.3-.3.4-.6.4-.4 0-.9-.1-1.6-.1-.6 0-1 .2-1.5.5-.6.4-1.3.9-2.6.9s-2-.5-2.6-.9c-.5-.3-.9-.5-1.5-.5-.7 0-1.2.1-1.6.1-.3 0-.5-.1-.6-.4-.1-.3-.2-.7-.3-1-.6-.1-1.5-.3-1.9-.7-.2-.2-.2-.5.1-.6 1-.3 1.4-1.1 1.6-1.7.1-.3.2-.6 0-.8-.3-.3-.9-.4-1.4-.6-.8-.3-1.2-.6-1.2-1 0-.3.2-.5.5-.6.5-.1 1.3-.3 1.9-.6.6-.3.9-.6.9-1V7.9c0-3.1 2.2-5.4 5.1-5.4Z" />
    </svg>
  );
}

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
          <Link href="/" className="footer-logo" aria-label="نادي طاقات للفتيات">
            <Image src="/brand/logo-mark-trim.png" alt="" width={663} height={561} />
          </Link>
          <p>{settings.footerDescription}</p>
          <div className="socials">
            <a href={settings.instagram} aria-label="إنستغرام">
              <Instagram size={18} />
            </a>
            <a href={settings.x} aria-label="منصة إكس">
              <XLogo />
            </a>
            <a href={settings.whatsapp} aria-label="واتساب">
              <WhatsAppLogo />
            </a>
            {settings.tiktok && (
              <a href={settings.tiktok} aria-label="تيك توك">
                <TikTokLogo />
              </a>
            )}
            {settings.snapchat && (
              <a href={settings.snapchat} aria-label="سناب شات">
                <SnapchatLogo />
              </a>
            )}
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
