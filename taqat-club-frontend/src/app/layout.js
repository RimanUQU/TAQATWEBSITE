import './globals.css';
import Header from '@/components/common/Header';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'نادي طاقات للفتيات - مكة المكرمة',
  description: 'منصة تنموية تجمع بين التعلم والإبداع والتميز',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
