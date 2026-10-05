import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 text-xs text-slate-600 leading-relaxed">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kebijakan Privasi POINT+</h1>
        <p className="text-xs text-slate-500">Kerahasiaan dan keamanan data Anda adalah prioritas utama kami.</p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Pengumpulan Data</h3>
        <p>Kami hanya mengumpulkan data yang diperlukan untuk pemrosesan order: Nama, Email, Nomor WhatsApp, dan User/Player ID game yang hendak di-top-up.</p>

        <h3 className="text-sm font-bold text-slate-900">2. Keamanan Akun</h3>
        <p>POINT+ tidak pernah meminta password akun game, PIN perbankan, atau kode OTP Anda. Transaksi hanya memerlukan User ID publik.</p>

        <h3 className="text-sm font-bold text-slate-900">3. Bukti Pembayaran</h3>
        <p>Bukti pembayaran yang diunggah hanya disimpan di server aman untuk keperluan verifikasi transaksi oleh tim admin kami dan tidak dibagikan kepada pihak ketiga.</p>
      </div>
    </div>
  );
};
