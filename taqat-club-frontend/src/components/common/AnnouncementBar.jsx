'use client';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#3E9694] text-white py-2 px-4 text-center text-sm font-medium flex justify-center items-center gap-2">
      <span className="bg-[#D95F93] text-xs px-2 py-0.5 rounded-full">جديد</span>
      <span>انطلاق تسجيل برنامج "التمكين والإبداع 2026" - سارعي بالتسجيل الان!</span>
      <Link href="/programs" className="underline hover:text-[#F9DCE7] mr-2">
        التفاصيل ←
      </Link>
    </div>
  );
}