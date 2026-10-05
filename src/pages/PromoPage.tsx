import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, ChevronRight, Zap } from 'lucide-react';

export const PromoPage: React.FC = () => {
  const promos = [
    {
      title: 'Diskon Spesial Mobile Legends Weekly Pass',
      badge: 'PROMO TERPOPULER',
      desc: 'Dapatkan Weekly Diamond Pass dengan harga termurah hanya Rp 28.500 langsung aktif selama seminggu penuh.',
      gameSlug: 'mobile-legends',
      code: 'MLBBWEEKLY'
    },
    {
      title: 'Cashback 10% Free Fire Diamond',
      badge: 'TERBATAS',
      desc: 'Top up 720 Diamond Free Fire dan dapatkan harga promo langsung tanpa kode voucher.',
      gameSlug: 'free-fire',
      code: 'FFBOOYAH'
    },
    {
      title: 'Unknown Cash PUBG Mobile Murah',
      badge: 'ROYALE PASS',
      desc: 'Beli 660 UC untuk buka Royale Pass musim ini dengan proses cepat 1-5 menit via QRIS.',
      gameSlug: 'pubg-mobile',
      code: 'PUBGNEW'
    },
    {
      title: 'VP Valorant Best Price',
      badge: 'RIOT DEAL',
      desc: 'Beli bundle skin terbaru di Night Market dengan harga VP paling bersahabat se-Indonesia.',
      gameSlug: 'valorant',
      code: 'VALORADIANT'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Promo & Penawaran Eksklusif POINT+
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Nikmati berbagai potongan harga dan voucher diskon langsung untuk game favorit Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promos.map((p, idx) => (
          <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-200">
                  {p.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  Kode: {p.code}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Diskon Otomatis
              </span>
              <Link
                to={`/games/${p.gameSlug}`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <span>Gunakan Promo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
