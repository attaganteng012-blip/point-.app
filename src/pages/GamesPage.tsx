import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Gamepad2 } from 'lucide-react';
import { api, Game } from '../services/api.ts';

export const GamesPage: React.FC = () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Gamepad2 className="w-7 h-7 text-rose-600" />
              <span>Katalog Semua Game</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih game kesayangan Anda dan dapatkan voucher resmi dengan proses instan.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari game..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/70 border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">Tidak ada game yang sesuai dengan pencarian "{search}".</p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.slug}`}
              className="group rounded-2xl glass-card overflow-hidden glass-card-hover border border-slate-200/80 flex flex-col"
            >
              <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={game.banner}
                  alt={`${game.name} Banner`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 w-12 h-12 rounded-xl overflow-hidden bg-white shadow-md border-2 border-white">
                  <img
                    src={game.logo}
                    alt={`${game.name} Logo`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {game.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                    {game.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Tersedia
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

    </div>
  );
};
