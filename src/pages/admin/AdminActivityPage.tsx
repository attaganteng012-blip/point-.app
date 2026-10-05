import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, User, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.ts';

export const AdminActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminActivity();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN')) {
      return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">LOGIN</span>;
    }
    if (action.includes('LOGOUT')) {
      return <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-md">LOGOUT</span>;
    }
    if (action.includes('APPROVE')) {
      return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">APPROVE</span>;
    }
    if (action.includes('REJECT')) {
      return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">REJECT</span>;
    }
    if (action.includes('COMPLETE')) {
      return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">COMPLETE</span>;
    }
    return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">{action}</span>;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-600" />
            <span>Log Aktivitas Admin</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail pencatatan setiap tindakan dan otorisasi admin di sistem POINT+
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl self-start sm:self-auto hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat log aktivitas...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Belum ada riwayat aktivitas tercatat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Tindakan</th>
                  <th className="py-3 px-4">Order ID Terkait</th>
                  <th className="py-3 px-4">Deskripsi Aktivitas</th>
                  <th className="py-3 px-4">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {log.created_at}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {log.admin_name || 'System'}
                    </td>
                    <td className="py-3.5 px-4">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {log.order_id || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-sm">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {log.ip_address || '-'}
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
