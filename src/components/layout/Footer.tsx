import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Headphones, MessageSquare, Mail, Award, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      
      {/* Top Value Badges */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Proses Instan</p>
                <p className="text-xs text-slate-400">Pengiriman secepat kilat</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">100% Aman & Legal</p>
                <p className="text-xs text-slate-400">Jaminan akun terhindar minus</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Harga Termurah</p>
                <p className="text-xs text-slate-400">Katalog resmi langsung publisher</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Layanan 24/7</p>
                <p className="text-xs text-slate-400">CS ramah siap membantu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">P+</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                POINT<span className="text-rose-500">+</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              POINT+ adalah platform penyedia layanan top up game mobile & PC terpercaya di Indonesia. 
              Menyediakan voucher game resmi dengan pembayaran praktis via QRIS DANA Bisnis, proses cepat, dan verifikasi aman.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 mb-2">Metode Pembayaran Resmi:</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>QRIS DANA Bisnis (Semua E-Wallet & Bank)</span>
              </div>
            </div>
          </div>

          {/* Game List */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Game Populer</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/games/mobile-legends" className="hover:text-rose-400 transition-colors">Mobile Legends: Bang Bang</Link></li>
              <li><Link to="/games/free-fire" className="hover:text-rose-400 transition-colors">Free Fire</Link></li>
              <li><Link to="/games/pubg-mobile" className="hover:text-rose-400 transition-colors">PUBG Mobile</Link></li>
              <li><Link to="/games/valorant" className="hover:text-rose-400 transition-colors">VALORANT</Link></li>
              <li><Link to="/games/honor-of-kings" className="hover:text-rose-400 transition-colors">Honor of Kings</Link></li>
              <li><Link to="/games/genshin-impact" className="hover:text-rose-400 transition-colors">Genshin Impact</Link></li>
              <li><Link to="/games/roblox" className="hover:text-rose-400 transition-colors">Roblox</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Navigasi</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/games" className="hover:text-rose-400 transition-colors">Semua Game</Link></li>
              <li><Link to="/check-order" className="hover:text-rose-400 transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/promo" className="hover:text-rose-400 transition-colors">Promo & Diskon</Link></li>
              <li><Link to="/how-to-topup" className="hover:text-rose-400 transition-colors">Cara Top Up</Link></li>
              <li><Link to="/faq" className="hover:text-rose-400 transition-colors">Pertanyaan Umum (FAQ)</Link></li>
              <li><Link to="/terms" className="hover:text-rose-400 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/privacy" className="hover:text-rose-400 transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://wa.me/6288901846813"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp 1: 088901846813</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6285748245657"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp 2: 085748245657</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:attaerpeel@gmail.com"
                  className="flex items-center gap-2 hover:text-rose-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>attaerpeel@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} POINT+. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-slate-400">Syarat & Ketentuan</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-slate-400">Kebijakan Privasi</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-slate-400">Bantuan</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
