import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* الشعار - على اليمين */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="نادي طاقات للفتيات" 
            width={130} 
            height={50} 
            className="object-contain"
            priority
          />
        </Link>

        {/* روابط القائمة */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium text-sm">
          <Link href="/" className="text-[#6B21A8] font-bold border-b-2 border-[#6B21A8] pb-1">الرئيسية</Link>
          <Link href="/about" className="hover:text-[#6B21A8] transition-colors">عن النادي</Link>
          <Link href="/programs" className="hover:text-[#6B21A8] transition-colors">البرامج</Link>
          <Link href="/announcements" className="hover:text-[#6B21A8] transition-colors">الإعلانات</Link>
          <Link href="/gallery" className="hover:text-[#6B21A8] transition-colors">معرض الصور</Link>
          <Link href="/contact" className="hover:text-[#6B21A8] transition-colors">تواصل معنا</Link>
        </nav>

        {/* زر تسجيل الدخول - البنفسجي */}
        <div>
          <Link 
            href="/login" 
            className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </header>
  );
}