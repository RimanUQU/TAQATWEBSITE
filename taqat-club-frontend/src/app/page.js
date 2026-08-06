import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF9FF] text-gray-800 overflow-hidden relative dir-rtl">
      
      {/* --- قسم البطل (Hero Section) --- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row items-center justify-between min-h-[480px]">
        
        {/* خلفية الأشكال الناعمة المتداخلة (الجهة اليسرى في التصميم) */}
        <div className="absolute top-10 left-10 w-[420px] h-[320px] pointer-events-none -z-0 opacity-80">
          <div className="absolute w-64 h-64 bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] rounded-full filter blur-2xl opacity-40 top-0 left-0"></div>
          <div className="absolute w-72 h-72 bg-gradient-to-br from-[#A855F7] to-[#3B82F6] rounded-full filter blur-xl opacity-35 top-10 left-20"></div>
          
          {/* النقاط التزيينية (Grid Dots) */}
          <div className="absolute top-12 left-4 grid grid-cols-5 gap-2 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-indigo-900 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* مساحة الشكل الفني الجانبي */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative z-10 flex justify-center items-center">
          <div className="relative w-80 h-80">
            {/* الدوائر المتداخلة البارزة */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] rounded-full opacity-80 blur-sm transform -translate-x-6"></div>
            <div className="absolute inset-4 bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] rounded-full opacity-90 mix-blend-multiply"></div>
          </div>
        </div>

        {/* النصوص والأزرار - الجهة اليمنى */}
        <div className="w-full md:w-1/2 text-right z-10 mt-8 md:mt-0 space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-[#3B0764] leading-tight">
            طاقات تصنع <br />
            <span className="text-[#5B21B6]">المستقبل</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md leading-relaxed font-normal">
            نُقدّم برامج نوعية، وننمي مهارات، ونعزز فرصاً لمستقبل أفضل.
          </p>

          <div className="flex items-center justify-start gap-4 pt-4">
            <Link 
              href="/programs" 
              className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-semibold px-8 py-3 rounded-2xl transition-all shadow-md text-base"
            >
              استكشف البرامج
            </Link>
            <Link 
              href="/about" 
              className="bg-white border-2 border-[#D8B4FE] text-[#5B21B6] hover:bg-purple-50 font-semibold px-8 py-3 rounded-2xl transition-all text-base"
            >
              تعرف علينا
            </Link>
          </div>
        </div>

      </section>


      {/* --- قسم الإحصائيات (Stats Bar) --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-purple-900/5 border border-purple-50 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          {/* الإعلانات */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-[#6B21A8] flex items-center justify-center text-xl font-bold">
              📢
            </div>
            <span className="text-sm text-gray-500 font-medium">عدد الإعلانات</span>
            <span className="text-3xl font-extrabold text-gray-900">32</span>
          </div>

          {/* البرامج */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-[#4338CA] flex items-center justify-center text-xl font-bold">
              🎓
            </div>
            <span className="text-sm text-gray-500 font-medium">عدد البرامج</span>
            <span className="text-3xl font-extrabold text-gray-900">48</span>
          </div>

          {/* المنضمات */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-[#BE185D] flex items-center justify-center text-xl font-bold">
              👥
            </div>
            <span className="text-sm text-gray-500 font-medium">عدد المنضمات</span>
            <span className="text-3xl font-extrabold text-gray-900">3,256</span>
          </div>

          {/* الزوار */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-fuchsia-100 text-[#A21CAF] flex items-center justify-center text-xl font-bold">
              📊
            </div>
            <span className="text-sm text-gray-500 font-medium">عدد الزوار</span>
            <span className="text-3xl font-extrabold text-gray-900">12,458</span>
          </div>

        </div>
      </section>


      {/* --- قسم أبرز برامجنا (Programs Section) --- */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3B0764] mb-10 flex items-center justify-center gap-2">
          <span>🍃</span> أبرز برامجنا
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* الصحة الرياضية */}
          <div className="bg-gradient-to-b from-blue-50/80 to-white p-6 rounded-3xl border border-blue-100/60 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl shadow-md">
              ⚽
            </div>
            <h3 className="font-bold text-gray-800 text-lg">الصحة والرياضة</h3>
          </div>

          {/* الفنون والإبداع */}
          <div className="bg-gradient-to-b from-purple-50/80 to-white p-6 rounded-3xl border border-purple-100/60 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md">
              🎨
            </div>
            <h3 className="font-bold text-gray-800 text-lg">الفنون والإبداع</h3>
          </div>

          {/* القيادة والتمكين */}
          <div className="bg-gradient-to-b from-pink-50/80 to-white p-6 rounded-3xl border border-pink-100/60 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl shadow-md">
              👑
            </div>
            <h3 className="font-bold text-gray-800 text-lg">القيادة والتمكين</h3>
          </div>

          {/* البرمجة والتقنية */}
          <div className="bg-gradient-to-b from-indigo-50/80 to-white p-6 rounded-3xl border border-indigo-100/60 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
              💻
            </div>
            <h3 className="font-bold text-gray-800 text-lg">البرمجة والتقنية</h3>
          </div>

        </div>

        {/* زر عرض جميع البرامج */}
        <div className="mt-12">
          <Link 
            href="/programs" 
            className="inline-block bg-white border-2 border-purple-200 text-[#5B21B6] hover:bg-purple-50 font-semibold px-8 py-3 rounded-2xl transition-all shadow-sm"
          >
            عرض جميع البرامج
          </Link>
        </div>
      </section>

    </main>
  );
}