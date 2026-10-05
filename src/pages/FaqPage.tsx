import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Berapa lama proses top up setelah bukti pembayaran diunggah?',
      a: 'Rata-rata proses verifikasi dan pengiriman item game membutuhkan waktu 1 hingga 5 menit setelah customer mengunggah bukti pembayaran QRIS yang valid.'
    },
    {
      q: 'Metode pembayaran apa saja yang didukung oleh QRIS DANA Bisnis POINT+?',
      a: 'QRIS POINT+ mendukung semua aplikasi dompet digital (DANA, GoPay, OVO, ShopeePay, LinkAja) serta seluruh Mobile Banking di Indonesia seperti BCA Mobile, Livin by Mandiri, BRImo, BNI Mobile, Seabank, Jago, dan lainnya.'
    },
    {
      q: 'Apakah akun game saya aman saat melakukan top up di POINT+?',
      a: 'Sangat aman 100%. Kami hanya membutuhkan Player ID / User ID / Server ID Anda. Kami tidak pernah meminta password atau login akun Anda. Semua diamond dan voucher berasal dari distributor resmi publisher.'
    },
    {
      q: 'Bagaimana jika saya salah memasukkan User ID?',
      a: 'Harap periksa User ID Anda dengan seksama sebelum melakukan pembayaran. Jika Anda menyadari kesalahan sebelum order diproses, segera hubungi CS WhatsApp kami di 088901846813 atau 085748245657 dengan menyertakan Order ID.'
    },
    {
      q: 'Bagaimana cara mengecek status pesanan saya?',
      a: 'Buka menu "Cek Pesanan" di bagian atas halaman website, lalu masukkan Order ID Anda bersama email atau nomor WhatsApp yang digunakan saat memesan.'
    },
    {
      q: 'Apakah saya bisa meminta pengembalian dana (refund)?',
      a: 'Refund dapat dilakukan jika terjadi gangguan teknis dari server publisher yang menyebabkan pesanan tidak dapat dikirimkan sama sekali. Silakan hubungi Customer Service kami.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Temukan jawaban cepat atas pertanyaan umum seputar layanan top up game di POINT+.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-rose-600"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
