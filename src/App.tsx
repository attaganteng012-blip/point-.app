import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { AdminLayout } from './components/layout/AdminLayout.tsx';

// Customer Pages
import { HomePage } from './pages/HomePage.tsx';
import { GamesPage } from './pages/GamesPage.tsx';
import { GameDetailPage } from './pages/GameDetailPage.tsx';
import { PaymentPage } from './pages/PaymentPage.tsx';
import { CheckOrderPage } from './pages/CheckOrderPage.tsx';
import { InvoicePage } from './pages/InvoicePage.tsx';
import { PromoPage } from './pages/PromoPage.tsx';
import { HowToTopupPage } from './pages/HowToTopupPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { DownloadPage } from './pages/DownloadPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.tsx';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage.tsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.tsx';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.tsx';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage.tsx';
import { AdminActivityPage } from './pages/admin/AdminActivityPage.tsx';

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-rose-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes with Header & Footer */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/games" element={<CustomerLayout><GamesPage /></CustomerLayout>} />
          <Route path="/games/:slug" element={<CustomerLayout><GameDetailPage /></CustomerLayout>} />
          <Route path="/checkout" element={<Navigate to="/games" replace />} />
          <Route path="/payment/:orderId" element={<CustomerLayout><PaymentPage /></CustomerLayout>} />
          <Route path="/check-order" element={<CustomerLayout><CheckOrderPage /></CustomerLayout>} />
          <Route path="/orders" element={<Navigate to="/check-order" replace />} />
          <Route path="/order/:id" element={<CustomerLayout><CheckOrderPage /></CustomerLayout>} />
          <Route path="/invoice/:id" element={<CustomerLayout><InvoicePage /></CustomerLayout>} />
          <Route path="/promo" element={<CustomerLayout><PromoPage /></CustomerLayout>} />
          <Route path="/how-to-topup" element={<CustomerLayout><HowToTopupPage /></CustomerLayout>} />
          <Route path="/faq" element={<CustomerLayout><FaqPage /></CustomerLayout>} />
          <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
          <Route path="/terms" element={<CustomerLayout><TermsPage /></CustomerLayout>} />
          <Route path="/privacy" element={<CustomerLayout><PrivacyPage /></CustomerLayout>} />
          <Route path="/download" element={<CustomerLayout><DownloadPage /></CustomerLayout>} />

          {/* Admin Login Route (Stand-alone glass page) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
          </Route>

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
