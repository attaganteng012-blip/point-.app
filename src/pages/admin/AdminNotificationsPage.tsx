import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api.ts';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await api.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    loadNotifications();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-600" />
            <span>Pusat Notifikasi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Terdapat {unreadCount} notifikasi belum dibaca dari database
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl shadow-xs self-start sm:self-auto transition-all"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat notifikasi...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Belum ada notifikasi saat ini.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const isUnread = notif.is_read === 0 || notif.is_read === false;
              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                    isUnread ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                      )}
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">&bull; {notif.created_at}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-4 sm:pl-0">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {notif.order_id && (
                      <Link
                        to={`/admin/orders/${notif.order_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800"
                      >
                        <span>Buka</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                        title="Tandai dibaca"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
