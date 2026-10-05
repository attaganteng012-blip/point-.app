import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Semua Game', path: '/games' },
    { name: 'Cek Pesanan', path: '/check-order' },
    { name: 'Promo', path: '/promo' },
    { name: 'Cara Top Up', path: '/how-to-topup' },
    { name: 'Bantuan', path: '/faq' },
    { name: 'Kontak', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-navbar transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo POINT+ */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tighter">P+</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                POINT<span className="text-rose-600 font-black">+</span>
              </span>
              <span className="text-[10px] tracking-wider font-semibold uppercase text-slate-600 -mt-1">
                Official Top Up
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/check-order"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white/80 hover:bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-rose-600" />
              <span>Lacak Pesanan</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/check-order"
              className="p-2 text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xs"
              aria-label="Cari Pesanan"
            >
              <Search className="w-4 h-4 text-rose-600" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xs focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-panel border-b border-slate-200 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(link.path)
                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2">
            <Link
              to="/check-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-rose-400" />
              <span>Lacak Pesanan Anda</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
