import React from 'react';
import { MessageSquare, Mail, Clock, ShieldCheck, MapPin, Headphones } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Headphones className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hubungi Customer Support POINT+
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Punya pertanyaan seputar cara top up, konfirmasi kendala pembayaran QRIS, atau status pesanan? Tim kami siap melayani Anda 24 jam nonstop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WhatsApp 1 */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">WhatsApp Support 1 (Prioritas)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Untuk respon cepat verifikasi pembayaran & pertanyaan umum</p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/6288901846813"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>Chat WhatsApp: 088901846813</span>
            </a>
          </div>
        </div>

        {/* WhatsApp 2 */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">WhatsApp Support 2 (Cadangan)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Layanan alternatif jika CS 1 sedang dalam antrian padat</p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/6285748245657"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>Chat WhatsApp: 085748245657</span>
            </a>
          </div>
        </div>

        {/* Email Support */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Email Resmi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Untuk kerjasama bisnis, refund, atau kendala formal</p>
          </div>
          <div className="pt-2">
            <a
              href="mailto:attaerpeel@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>attaerpeel@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Operational Hours */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Jam Operasional</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sistem top up berjalan otomatis 24 Jam Nonstop</p>
          </div>
          <div className="pt-2">
            <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
              Senin - Minggu: 24 Jam (Hari Libur Tetap Buka)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
