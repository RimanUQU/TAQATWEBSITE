'use client';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-[#2F2F2F]">لوحة تحكم إدارة النادي</h1>
        <span className="text-xs bg-[#FDF2F6] text-[#D95F93] px-3 py-1 rounded-full font-bold">صلاحية مسؤولة</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* إدارة البرامج */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E8E8] space-y-4">
          <h2 className="font-bold text-lg text-[#3E9694]">إدارة البرامج والفعاليات</h2>
          <p className="text-sm text-[#6B7280]">إضافة جديد أو تعديل وتحديث بيانات البرامج الحالية.</p>
          <Button variant="primary" className="text-xs">إضافة برنامج جديد</Button>
        </div>

        {/* إدارة الإعلانات */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E8E8] space-y-4">
          <h2 className="font-bold text-lg text-[#D95F93]">إدارة شريط الإعلانات</h2>
          <p className="text-sm text-[#6B7280]">نشر إعلان جديد يظهر في هيدر الموقع مباشرة.</p>
          <Button variant="secondary" className="text-xs">إضافة إعلان جديد</Button>
        </div>
      </div>
    </div>
  );
}