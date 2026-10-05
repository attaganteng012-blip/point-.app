import React, { useState, useEffect } from 'react';
import { Users, Search, MessageSquare, Mail } from 'lucide-react';
import { api } from '../../services/api.ts';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminUsers()
      .then(data => setUsers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            <span>Data Pelanggan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar customer yang pernah melakukan pemesanan di POINT+
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelanggan..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-400 shadow-xs"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data pelanggan...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Belum ada data pelanggan yang terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Kontak (Email & WhatsApp)</th>
                  <th className="py-3 px-4 text-center">Jumlah Order</th>
                  <th className="py-3 px-4">Total Transaksi (Sukses)</th>
                  <th className="py-3 px-4">Order Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{u.email}</span>
                      </p>
                      <p className="text-emerald-600 font-semibold flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" />
                        <a href={`https://wa.me/${u.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {u.phone}
                        </a>
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {u.order_count} pesanan
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-rose-600">
                      Rp {Number(u.total_spend || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {u.last_order_date || '-'}
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
