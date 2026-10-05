import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Harap masukkan email dan password admin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
              P+
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              POINT<span className="text-rose-600">+</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Portal Masuk Administrator</h1>
          <p className="text-xs text-slate-500">Kelola transaksi, verifikasi bukti pembayaran, dan produk game</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Admin</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pointplus.id"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Akun Default Terdaftar:</span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@pointplus.id', 'AdminPointPlus2026!')}
                className="text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors"
              >
                <p className="font-bold text-slate-800 text-[11px]">admin@pointplus.id</p>
                <p className="text-[10px] text-slate-500">Pass: AdminPointPlus2026! (Super Admin)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('attaerpeel@gmail.com', 'PointPlusAdmin123!')}
                className="text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors"
              >
                <p className="font-bold text-slate-800 text-[11px]">attaerpeel@gmail.com</p>
                <p className="text-[10px] text-slate-500">Pass: PointPlusAdmin123! (Admin Owner)</p>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              *Anda juga dapat menjalankan perintah <code>npm run create-admin</code> di terminal untuk membuat admin baru.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
            &larr; Kembali ke Halaman Utama POINT+
          </Link>
        </div>

      </div>
    </div>
  );
};
