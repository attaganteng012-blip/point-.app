import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, QrCode, ArrowRight } from 'lucide-react';

export const HowToTopupPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Panduan Lengkap Cara Top Up di POINT+
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Ikuti langkah-langkah mudah berikut untuk melakukan top up voucher game resmi hanya dalam hitungan menit.
        </p>
      </div>

      <div className="space-y-6">
        
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black flex items-center justify-center text-sm shrink-0">
            1
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">Pilih Game & Nominal Produk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buka menu <strong>Semua Game</strong> atau klik game dari halaman beranda (seperti Mobile Legends, Free Fire, PUBG Mobile, Valorant, dll). 
              Pilih nominal diamond, cash, VP, atau robux yang ingin Anda beli.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shrink-0">
            2
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">Masukkan ID Akun Game dengan Benar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan User ID / Player ID Anda. Untuk game seperti Mobile Legends dan Genshin Impact, masukkan juga Zone ID atau Server pilihan Anda. 
              Pastikan ID tidak salah ketik agar proses pengiriman berjalan mulus.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shrink-0">
            3
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">Bayar Menggunakan QRIS DANA Bisnis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Klik <strong>Beli Sekarang</strong> dan Anda akan diarahkan ke halaman pembayaran QRIS DANA Bisnis. 
              Scan kode QRIS menggunakan e-wallet (DANA, GoPay, OVO, ShopeePay) atau mobile banking mana saja (BCA, Mandiri, BRI, BNI). 
              Pastikan nominal transfer sesuai dengan total tagihan pesanan.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shrink-0">
            4
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">Unggah Bukti Pembayaran & Pantau Status</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah transfer selesai, unggah screenshot atau foto struk pembayaran pada formulir yang tersedia di halaman pembayaran. 
              Admin kami akan memverifikasi bukti dan memproses pengiriman item game ke akun Anda secepatnya. 
              Anda juga dapat memantau status secara langsung melalui menu <strong>Cek Pesanan</strong>.
            </p>
          </div>
        </div>

      </div>

      <div className="text-center pt-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>Mulai Top Up Game Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
