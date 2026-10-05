import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, ShieldCheck, Flame, ChevronRight, Headphones, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { api, Game } from '../services/api.ts';

export const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGames()
      .then(data => setGames(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredGames = games.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 border border-white/80 shadow-lg overflow-hidden">
            {/* Subtle light background ornament */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Layanan Top Up Game #1 Tercepat & Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Top Up Game Instan, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  Mudah & Terpercaya
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Nikmati kemudahan top up Mobile Legends, Free Fire, PUBG Mobile, Valorant, Genshin Impact, dan game favorit lainnya dengan pembayaran QRIS DANA Bisnis resmi.
              </p>

              {/* Instant Search Bar */}
              <div className="pt-2">
                <div className="relative flex items-center max-w-lg">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari game favoritmu (misal: Mobile Legends, Valorant)..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:ring-3 focus:ring-rose-50 shadow-xs transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Trust badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Produk Legal
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Pengiriman 1-5 Menit
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> Verifikasi QRIS Aman
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Popular Games Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Game Terpopuler</span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-700 rounded-full">Hot</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Pilih game favoritmu dan nikmati promo harga spesial</p>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/70 border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.slug}`}
                className="group relative rounded-2xl glass-card overflow-hidden glass-card-hover border border-slate-200/80 flex flex-col"
              >
                {/* Banner Header */}
                <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={game.banner}
                    alt={`${game.name} Banner`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating Logo Badge */}
                  <div className="absolute bottom-2.5 left-3 w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden bg-white shadow-md border-2 border-white shrink-0">
                    <img
                      src={game.logo}
                      alt={`${game.name} Logo`}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between pt-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                      {game.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Top Up Instan
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Beli <ChevronRight className="w-3.5 h-3.5 text-rose-500" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How To Top Up Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cara Top Up di POINT+
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Proses transaksi 4 langkah mudah, cepat, dan aman tanpa ribet registrasi akun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/70 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 font-extrabold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Pilih Game & Nominal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih game favoritmu dan tentukan produk top up yang diinginkan dari daftar nominal.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/70 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Masukkan Data Akun</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ketikkan User ID, Player ID, atau Server ID sesuai instruksi pada game yang dipilih.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/70 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Bayar via QRIS DANA</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan kode QRIS DANA Bisnis menggunakan aplikasi e-wallet atau mobile banking apa saja.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/70 shadow-xs relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Upload Bukti & Selesai</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unggah struk bukti transfer dan item game akan masuk ke akunmu dalam hitungan menit!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service & FAQ Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Butuh Bantuan Transaksi?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Tim Customer Support POINT+ siap membantu Anda setiap hari 24 jam nonstop via WhatsApp resmi.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href="https://wa.me/6288901846813"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>WhatsApp 1 (088901846813)</span>
              </a>
              <a
                href="https://wa.me/6285748245657"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>WhatsApp 2 (085748245657)</span>
              </a>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Sudah Melakukan Pembayaran?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Periksa status proses transaksi atau unduh bukti invoice pesanan Anda secara real-time.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/check-order"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Cek Status Pesanan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
