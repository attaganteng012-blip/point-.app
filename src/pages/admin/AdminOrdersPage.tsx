import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, Filter, ChevronLeft, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { api, Order } from '../../services/api.ts';

export const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const currentStatus = searchParams.get('status') || 'ALL';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders({
        status: currentStatus === 'ALL' ? undefined : currentStatus,
        search: currentSearch || undefined,
        page: currentPage,
        limit: 15,
      });
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentStatus, currentSearch, currentPage]);

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', status);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

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

  const filterTabs = [
    { label: 'Semua Status', value: 'ALL' },
    { label: 'Menunggu Verifikasi', value: 'WAITING_VERIFICATION' },
    { label: 'Pending Bayar', value: 'PENDING_PAYMENT' },
    { label: 'PAID', value: 'PAID' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Pesanan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {pagination.total} pesanan tercatat di database
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl self-start sm:self-auto hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari berdasarkan Order ID, Nama Customer, Email, No HP, atau Game..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
          >
            Cari
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                currentStatus === tab.value
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table (Desktop) / Cards (Mobile) */}
      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-semibold text-slate-500">Memuat data pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada pesanan yang sesuai dengan filter.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order ID & Tanggal</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Game & Produk</th>
                    <th className="py-3 px-4">Akun Tujuan</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{o.order_id}</span>
                        <span className="text-[11px] text-slate-400">{o.created_at}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{o.customer_name}</p>
                        <p className="text-[11px] text-slate-500">{o.customer_phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{o.game_name}</p>
                        <p className="text-[11px] text-slate-500">{o.product_name}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {o.player_id} {o.server_id ? `(${o.server_id})` : ''}
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

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {orders.map((o) => (
                <div key={o.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">{o.order_id}</span>
                    {getStatusBadge(o.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Customer:</span>
                      <p className="font-semibold text-slate-800">{o.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{o.customer_phone}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Game & Produk:</span>
                      <p className="font-semibold text-slate-800">{o.game_name}</p>
                      <p className="text-[11px] text-slate-500">{o.product_name}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Akun:</span>
                      <p className="font-mono font-bold text-slate-800">{o.player_id}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Total:</span>
                      <p className="font-bold text-rose-600">Rp {Number(o.total_amount).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
                    <span>{o.created_at}</span>
                    <Link
                      to={`/admin/orders/${o.order_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white font-bold rounded-lg"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Detail</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
