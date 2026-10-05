import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { api, Order } from '../services/api.ts';

export const CheckOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !identifier.trim()) {
      setError('Harap masukkan Order ID dan Email atau No WhatsApp Anda.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await api.checkOrder(orderId.trim(), identifier.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Pesanan tidak ditemukan. Pastikan data yang dimasukkan benar.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Menunggu Pembayaran</span>;
      case 'WAITING_VERIFICATION':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Menunggu Verifikasi Admin</span>;
      case 'PAID':
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">Pembayaran Terverifikasi (PAID)</span>;
      case 'PROCESSING':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">Sedang Diproses</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Pesanan Selesai (COMPLETED)</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">Bukti Ditolak (REJECTED)</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      
      {/* Header Form */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <Search className="w-6 h-6" />
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Lacak Pesanan Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Masukkan Order ID dan Email atau Nomor WhatsApp yang digunakan saat memesan untuk verifikasi keamanan.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-lg mx-auto space-y-3.5 text-left pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Order ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Contoh: PTP-20261005-A8K29"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email atau No. WhatsApp Pelanggan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Contoh: nama@gmail.com atau 08123456789"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mencari Pesanan...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-rose-400" />
                <span>Cari Status Transaksi</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {order && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">HASIL PELACAKAN PESANAN</span>
              <span className="text-lg font-mono font-black text-slate-900">{order.order_id}</span>
              <p className="text-xs text-slate-500 mt-0.5">Tanggal: {order.created_at}</p>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Game:</span>
              <span className="font-bold text-slate-800 text-sm">{order.game_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Produk:</span>
              <span className="font-bold text-slate-800 text-sm">{order.product_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Total Pembayaran:</span>
              <span className="font-extrabold text-rose-600 text-base">
                Rp {Number(order.total_amount).toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">{order.player_label || 'Player ID'}:</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {order.player_id} {order.server_id ? `(${order.server_id})` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Metode Pembayaran:</span>
              <span className="font-semibold text-slate-800 text-sm">{order.payment_method}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Pelanggan:</span>
              <span className="font-semibold text-slate-800 text-sm">{order.customer_name}</span>
            </div>
          </div>

          {order.rejection_reason && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-bold block mb-1">Alasan Penolakan:</span>
              <p>{order.rejection_reason}</p>
            </div>
          )}

          {order.process_note && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
              <span className="font-bold block mb-1">Catatan Proses Admin:</span>
              <p>{order.process_note}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/invoice/${order.order_id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Lihat Invoice</span>
            </Link>

            <Link
              to={`/payment/${order.order_id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <span>Halaman Pembayaran / Bukti</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
