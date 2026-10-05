import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  RefreshCw,
  Eye,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api, Order } from '../../services/api.ts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        api.getAdminStatistics(),
        api.getAdminOrders({ limit: 8 })
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">Pending Bayar</span>;
      case 'WAITING_VERIFICATION':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md animate-pulse">Menunggu Verifikasi</span>;
      case 'PAID':
        return <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">PAID</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">Processing</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">Completed</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Utama
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan transaksi dan status operasional POINT+
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs self-start sm:self-auto transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-600' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Transaksi */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats?.totalOrders ?? 0}</span>
            <span className="block text-[11px] font-bold text-emerald-600 mt-0.5">
              Rp {Number(stats?.totalRevenue ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Transaksi Hari Ini */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Transaksi Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600">{stats?.todayOrders ?? 0}</span>
            <span className="block text-[11px] font-bold text-slate-500 mt-0.5">
              Omzet: Rp {Number(stats?.todayRevenue ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="glass-card p-5 rounded-2xl border border-blue-200/80 bg-blue-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">Menunggu Verifikasi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-blue-700">{stats?.waitingVerification ?? 0}</span>
            <Link to="/admin/orders?status=WAITING_VERIFICATION" className="block text-[11px] font-bold text-blue-600 mt-0.5 hover:underline">
              Periksa Sekarang &rarr;
            </Link>
          </div>
        </div>

        {/* Total Pelanggan */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Pelanggan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats?.totalUsers ?? 0}</span>
            <span className="block text-[11px] font-semibold text-slate-400 mt-0.5">
              Terdaftar di Database
            </span>
          </div>
        </div>

      </div>

      {/* Breakdown Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold">PAID (Terbayar)</span>
          <span className="text-sm font-extrabold text-indigo-600">{stats?.paid ?? 0}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold">PROCESSING</span>
          <span className="text-sm font-extrabold text-purple-600">{stats?.processing ?? 0}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold">COMPLETED (Selesai)</span>
          <span className="text-sm font-extrabold text-emerald-600">{stats?.completed ?? 0}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold">REJECTED (Ditolak)</span>
          <span className="text-sm font-extrabold text-rose-600">{stats?.rejected ?? 0}</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pesanan Terbaru</h2>
            <p className="text-xs text-slate-500">Antrian pesanan pelanggan yang masuk</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Belum ada pesanan yang masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Game & Produk</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {o.order_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{o.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{o.customer_phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{o.game_name}</p>
                      <p className="text-[11px] text-slate-500">{o.product_name}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Rp {Number(o.total_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(o.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/orders/${o.order_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
