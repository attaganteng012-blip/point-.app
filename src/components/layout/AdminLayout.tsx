import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Bell, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { api } from '../../services/api.ts';

export const AdminLayout: React.FC = () => {
  const { admin, loading, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, loading, navigate]);

  useEffect(() => {
    if (admin) {
      api.getAdminNotifications()
        .then(data => setUnreadNotifs(data.unreadCount || 0))
        .catch(err => console.error(err));
      
      const interval = setInterval(() => {
        api.getAdminNotifications()
          .then(data => setUnreadNotifs(data.unreadCount || 0))
          .catch(() => {});
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [admin]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Daftar Pesanan', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Data Pelanggan', path: '/admin/users', icon: Users },
    { name: 'Kelola Produk', path: '/admin/products', icon: Package },
    { name: 'Notifikasi', path: '/admin/notifications', icon: Bell, badge: unreadNotifs },
    { name: 'Log Aktivitas', path: '/admin/activity', icon: Activity },
  ];

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout dari sesi admin?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-md border-r border-slate-200/80 p-4 shrink-0 shadow-xs">
        
        {/* Brand */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/70 pt-2 px-2">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">P+</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                POINT<span className="text-rose-600">+</span>
              </span>
              <span className="text-[10px] block font-bold text-rose-600 uppercase tracking-widest -mt-1">
                Admin Center
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Profile Box */}
        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <p className="text-xs font-bold text-slate-800 truncate">{admin.name}</p>
          <p className="text-[11px] text-slate-500 truncate">{admin.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md">
            {admin.role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = item.path === '/admin';
            const active = isExact ? location.pathname === '/admin' : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-200/70 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Lihat Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>

      </aside>

      {/* Mobile Header */}
      <div className="md:hidden glass-navbar p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-rose-600 flex items-center justify-center text-white font-extrabold text-xs">
            P+
          </div>
          <span className="font-extrabold text-base text-slate-900">
            POINT+ <span className="text-rose-600 font-bold text-xs uppercase">Admin</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/admin/notifications" className="p-2 relative text-slate-700 bg-white rounded-lg border border-slate-200">
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full p-4 flex flex-col shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-extrabold text-slate-900">POINT+ Admin</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 p-3 bg-slate-50 rounded-xl text-xs">
              <p className="font-bold text-slate-800">{admin.name}</p>
              <p className="text-[11px] text-slate-500">{admin.email}</p>
            </div>

            <nav className="flex-1 space-y-1 py-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isExact = item.path === '/admin';
                const active = isExact ? location.pathname === '/admin' : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-xl"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-rose-50 text-rose-600 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};
