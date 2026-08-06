import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2F2F2F] text-white pt-12 pb-6 border-t-4 border-[#D95F93]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* نبذة */}
        <div>
          <h3 className="text-lg font-bold text-[#D95F93] mb-3">نادي طاقات للفتيات</h3>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">
            منصة تنموية تجمع بين التعلم والإبداع والتميز، مخصصة لتمكين الفتيات وتطوير مهاراتهن في بيئة تربوية ملهمة.
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 className="text-md font-bold text-[#3E9694] mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            <li><Link href="/about" className="hover:text-[#D95F93]">عن النادي</Link></li>
            <li><Link href="/programs" className="hover:text-[#D95F93]">البرامج والفعاليات</Link></li>
            <li><Link href="/announcements" className="hover:text-[#D95F93]">أحدث الإعلانات</Link></li>
            <li><Link href="/contact" className="hover:text-[#D95F93]">تواصل معنا</Link></li>
          </ul>
        </div>

        {/* قنوات التواصل */}
        <div>
          <h4 className="text-md font-bold text-[#3E9694] mb-3">تواصل معنا</h4>
          <p className="text-sm text-[#D1D5DB] mb-2">البريد الإلكتروني: taqat.club@gmail.com</p>
          <p className="text-sm text-[#D1D5DB] mb-4">الموقع: مكة المكرمة، المملكة العربية السعودية</p>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center pt-4 text-xs text-gray-400">
        جميع الحقوق محفوظة © {new Date().getFullYear()} لنادي طاقات للفتيات
      </div>
    </footer>
  );
}