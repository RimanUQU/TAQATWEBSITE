'use client';
import { useState } from 'react';
import Button from '@/components/common/Button';
import API from '@/services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await API.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-2xl border border-[#E8E8E8] shadow-sm">
        <h1 className="text-2xl font-bold text-[#2F2F2F] mb-2 text-center">تواصل مع إدارة النادي</h1>
        <p className="text-center text-sm text-[#6B7280] mb-6">
          يتم إرسال رسالتك مباشرة إلى بريد نادي طاقات للفتيات الرسمي
        </p>

        {status === 'success' && (
          <div className="p-3 mb-4 bg-[#F2FBFA] text-[#3E9694] text-sm rounded-lg text-center">
            تم إرسال رسالتك بنجاح! وسيتواصل معك الفريق في أقرب وقت.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">الاسم الكامل</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-[#D1D5DB] p-2.5 rounded-lg focus:outline-none focus:border-[#D95F93]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">البريد الإلكتروني</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-[#D1D5DB] p-2.5 rounded-lg focus:outline-none focus:border-[#D95F93]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">الموضوع</label>
            <input 
              type="text" required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-[#D1D5DB] p-2.5 rounded-lg focus:outline-none focus:border-[#D95F93]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">الرسالة</label>
            <textarea 
              rows="4" required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full border border-[#D1D5DB] p-2.5 rounded-lg focus:outline-none focus:border-[#D95F93]"
            ></textarea>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </Button>
        </form>
      </div>
    </div>
  );
}