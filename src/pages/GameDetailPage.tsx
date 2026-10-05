import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  User,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { api, Game, Product } from '../services/api.ts';

export const GameDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getGameBySlug(slug)
      .then((data) => {
        setGame(data);
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0]);
        }
      })
      .catch((err) => setError(err.message || 'Game tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!game || !selectedProduct) {
      setSubmitError('Harap pilih salah satu nominal produk top up.');
      return;
    }

    if (!playerId.trim()) {
      setSubmitError(`Harap masukkan ${game.player_label || 'Player ID'}.`);
      return;
    }

    if (game.has_server_id && !serverId.trim()) {
      setSubmitError(`Harap masukkan ${game.server_label || 'Server ID'}.`);
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setSubmitError('Harap lengkapi nama, email, dan nomor WhatsApp Anda.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await api.createOrder({
        gameId: game.id,
        productId: selectedProduct.id,
        playerId: playerId.trim(),
        serverId: game.has_server_id ? serverId.trim() : undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod: 'QRIS_DANA',
      });

      // Redirect directly to payment page with newly created order
      navigate(`/payment/${order.orderId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Memuat katalog game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8 rounded-3xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-1">Game Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6">{error || 'Silakan pilih game lain dari katalog kami.'}</p>
          <Link
            to="/games"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800"
          >
            Kembali ke Katalog Game
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-slate-900">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/games" className="hover:text-slate-900">Game</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{game.name}</span>
      </nav>

      <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Game Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 sticky top-24">
            
            {/* Banner */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-200">
              <img
                src={game.banner}
                alt={`${game.name} Banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-3 left-4 flex items-end gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-white shrink-0">
                  <img
                    src={game.logo}
                    alt={`${game.name} Logo`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="text-white pb-0.5">
                  <h1 className="text-lg sm:text-xl font-black leading-tight drop-shadow-xs">
                    {game.name}
                  </h1>
                  <span className="text-[11px] font-semibold text-rose-300">
                    Proses Otomatis 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Instruction */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {game.description}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Petunjuk Pengisian:
                </h4>
                <div className="text-[11px] text-slate-500 space-y-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                  <p>&bull; Masukkan <strong>{game.player_label || 'User ID'}</strong> dengan benar.</p>
                  {game.has_server_id ? (
                    <p>&bull; Masukkan <strong>{game.server_label || 'Zone/Server ID'}</strong> pada kolom yang disediakan.</p>
                  ) : null}
                  <p>&bull; Kesalahan penulisan ID akun di luar tanggung jawab sistem POINT+.</p>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-2 flex flex-col gap-2 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Legal & Terpercaya</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Pengiriman Cepat 1-5 Menit</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Steps to purchase */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: Account Identification */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shadow-rose-600/20">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Masukkan Informasi Akun Game
                </h2>
                <p className="text-xs text-slate-500">
                  Harap periksa kembali User ID Anda sebelum melanjutkan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {game.player_label || 'Player ID'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder={`Contoh: 12345678`}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-50 shadow-xs"
                />
              </div>

              {game.has_server_id ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {game.server_label || 'Zone / Server ID'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    placeholder={game.slug === 'mobile-legends' ? 'Contoh: 2109' : 'Pilih / ketik server'}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-50 shadow-xs"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* STEP 2: Select Product Nominal */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shadow-rose-600/20">
                2
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Pilih Nominal Top Up
                </h2>
                <p className="text-xs text-slate-500">
                  Harga resmi dari database, transparan tanpa biaya tersembunyi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {game.products?.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        {prod.name}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {prod.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-extrabold text-rose-600">
                        Rp {Number(prod.price).toLocaleString('id-ID')}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shadow-rose-600/20">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Metode Pembayaran
                </h2>
                <p className="text-xs text-slate-500">
                  Menggunakan QRIS DANA Bisnis resmi
                </p>
              </div>
            </div>

            <div className="pt-1">
              <div className="p-4 rounded-2xl bg-white border-2 border-rose-500/80 ring-2 ring-rose-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        QRIS DANA Bisnis
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        Bebas Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      DANA, GoPay, OVO, ShopeePay, BCA, Mandiri, BRI, BNI & seluruh mobile banking
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {selectedProduct ? `Rp ${Number(selectedProduct.price).toLocaleString('id-ID')}` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Customer Details & Checkout */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shadow-rose-600/20">
                4
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Kontak Pelanggan (Untuk Bukti & Status)
                </h2>
                <p className="text-xs text-slate-500">
                  Kami akan mengirimkan notifikasi dan bukti transaksi ke kontak Anda
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama Lengkap</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Aktif</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nomor WhatsApp</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Price Summary and Order Button */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Pembayaran:</span>
                <span className="text-2xl font-black text-rose-600 tracking-tight">
                  {selectedProduct ? `Rp ${Number(selectedProduct.price).toLocaleString('id-ID')}` : 'Rp 0'}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Membuat Pesanan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Beli Sekarang</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
