import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 text-xs text-slate-600 leading-relaxed">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Syarat & Ketentuan Layanan POINT+</h1>
        <p className="text-xs text-slate-500">Terakhir diperbarui: Oktober 2026</p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Ketentuan Umum</h3>
        <p>Dengan melakukan pemesanan dan pembayaran di POINT+, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam halaman ini.</p>

        <h3 className="text-sm font-bold text-slate-900">2. Keabsahan Data Akun Game</h3>
        <p>Pengguna bertanggung jawab penuh atas kebenaran Player ID, User ID, dan Server ID yang diinput pada formulir pemesanan. Kesalahan penulisan data oleh pengguna yang menyebabkan item masuk ke akun lain bukan merupakan tanggung jawab POINT+.</p>

        <h3 className="text-sm font-bold text-slate-900">3. Pembayaran QRIS</h3>
        <p>Pembayaran wajib ditransfer sesuai dengan nominal tagihan yang tertera pada Order ID ke QRIS DANA Bisnis resmi POINT+. Pengguna wajib mengunggah bukti struk transfer yang jelas dan valid.</p>

        <h3 className="text-sm font-bold text-slate-900">4. Pembatalan & Pengembalian Dana</h3>
        <p>Pesanan yang telah berstatus PAID atau COMPLETED tidak dapat dibatalkan atau direfund kecuali terjadi kesalahan teknis dari pihak sistem kami atau publisher game.</p>
      </div>
    </div>
  );
};
