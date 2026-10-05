import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { api, Order } from '../services/api.ts';

export const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getOrder(id)
      .then(data => setOrder(data))
      .catch(err => setError(err.message || 'Invoice tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-500">Menyiapkan invoice resmi...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8 rounded-3xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-1">Invoice Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6">{error || 'Pesanan tidak terdaftar dalam sistem.'}</p>
          <Link to="/" className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top action bar (hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          to={`/payment/${order.order_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pesanan</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Printable Invoice Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              P+
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                POINT<span className="text-rose-600">+</span>
              </span>
              <p className="text-xs text-slate-500">Official Game Top Up Platform</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">BUKTI INVOICE RESMI</span>
            <span className="text-base font-mono font-bold text-slate-900 block mt-0.5">{order.order_id}</span>
            <span className="text-xs text-slate-500 block mt-1">Tanggal: {order.created_at}</span>
          </div>
        </div>

        {/* Customer & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">DITERBITKAN UNTUK:</span>
            <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
            <p className="text-slate-600">{order.customer_email}</p>
            <p className="text-slate-600">{order.customer_phone}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">METODE PEMBAYARAN:</span>
            <p className="text-sm font-bold text-slate-900">QRIS DANA Bisnis</p>
            <div className="sm:flex sm:justify-end mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                Status: {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2">Deskripsi Produk</th>
                <th className="py-3 px-2">Tujuan Akun</th>
                <th className="py-3 px-2 text-right">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-2">
                  <p className="font-bold text-slate-900 text-sm">{order.game_name}</p>
                  <p className="text-slate-500">{order.product_name}</p>
                </td>
                <td className="py-4 px-2">
                  <p className="font-mono font-bold text-slate-800">{order.player_id}</p>
                  {order.server_id && <p className="text-slate-500 text-[11px]">Server: {order.server_id}</p>}
                </td>
                <td className="py-4 px-2 text-right font-bold text-slate-900 text-sm">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td colSpan={2} className="py-4 px-2 font-bold text-slate-900 text-sm text-right">
                  Total Pembayaran:
                </td>
                <td className="py-4 px-2 text-right font-black text-rose-600 text-lg">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes & Verification Stamp */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Terima kasih atas kepercayaan Anda di POINT+.</p>
            <p>Invoice ini merupakan bukti sah transaksi digital yang diproses melalui sistem otomatis POINT+.</p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] font-bold text-slate-700">VERIFIED OFFICIAL TRANSACTION</span>
          </div>
        </div>

      </div>

    </div>
  );
};
