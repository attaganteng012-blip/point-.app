import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  ZoomIn, 
  X, 
  AlertCircle,
  FileText,
  Play,
  CheckCheck
} from 'lucide-react';
import { api, Order, apiUrl } from '../../services/api.ts';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Action States
  const [zoomProof, setZoomProof] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [processNote, setProcessNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDetail = () => {
    if (!id) return;
    setLoading(true);
    api.getAdminOrderDetail(id)
      .then((data) => {
        setOrder(data.order);
        setLogs(data.logs || []);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Gagal memuat detail pesanan'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    if (!order) return;
    if (!window.confirm(`Setujui pembayaran untuk pesanan ${order.order_id}? Status akan diubah menjadi PAID.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await api.approveOrder(order.order_id);
      setActionSuccess('Pembayaran berhasil disetujui (PAID).');
      fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Gagal menyetujui pesanan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!rejectReason.trim()) {
      alert('Alasan penolakan wajib diisi!');
      return;
    }

    setActionLoading(true);
    try {
      await api.rejectOrder(order.order_id, rejectReason.trim());
      setRejectModalOpen(false);
      setRejectReason('');
      setActionSuccess('Pesanan telah ditolak dengan alasan yang tercatat.');
      fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Gagal menolak pesanan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setActionLoading(true);
    try {
      await api.processOrder(order.order_id, processNote.trim() || undefined);
      setProcessModalOpen(false);
      setProcessNote('');
      setActionSuccess('Status pesanan diubah menjadi PROCESSING.');
      fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Gagal memproses pesanan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!order) return;
    const note = prompt('Masukkan catatan penyelesaian (opsional, misal: Top up berhasil dikirim):', 'Top up berhasil dikirim ke akun Anda');
    if (note === null) return;

    setActionLoading(true);
    try {
      await api.completeOrder(order.order_id, note);
      setActionSuccess('Pesanan berhasil diselesaikan (COMPLETED).');
      fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Gagal menyelesaikan pesanan');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs font-semibold text-slate-500">Memuat rincian pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6">{error}</p>
        <Link to="/admin/orders" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/invoice/${order.order_id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>Lihat Invoice</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Grid: Details + Workflow Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Customer & Order Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Meta Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider">ORDER ID</span>
                <span className="font-mono font-black text-lg text-slate-900">{order.order_id}</span>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Game:</span>
                <span className="font-bold text-slate-800 text-sm">{order.game_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Produk:</span>
                <span className="font-bold text-slate-800 text-sm">{order.product_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{order.player_label || 'Player ID'}:</span>
                <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                  {order.player_id}
                </span>
              </div>
              {order.has_server_id ? (
                <div>
                  <span className="text-slate-400 block mb-0.5">{order.server_label || 'Server ID'}:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                    {order.server_id}
                  </span>
                </div>
              ) : null}
              <div>
                <span className="text-slate-400 block mb-0.5">Total Tagihan:</span>
                <span className="font-extrabold text-rose-600 text-base">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Waktu Pemesanan:</span>
                <span className="font-medium text-slate-700">{order.created_at}</span>
              </div>
            </div>

            {order.rejection_reason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <span className="font-bold block mb-0.5">Alasan Penolakan:</span>
                <p>{order.rejection_reason}</p>
              </div>
            )}

            {order.process_note && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                <span className="font-bold block mb-0.5">Catatan Proses Admin:</span>
                <p>{order.process_note}</p>
              </div>
            )}
          </div>

          {/* Customer Meta Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>Informasi Pelanggan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama:</span>
                <p className="font-semibold text-slate-800">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email:</span>
                <p className="font-semibold text-slate-800 truncate">{order.customer_email}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">WhatsApp:</span>
                <a
                  href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{order.customer_phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Order Activity Trail */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Riwayat & Log Aktivitas Admin</h3>
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada riwayat aktivitas untuk pesanan ini.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl text-xs flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{log.action}</span>
                      <p className="text-slate-600 mt-0.5">{log.description}</p>
                      <span className="text-[10px] text-slate-400">Oleh: {log.admin_name || 'System'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.created_at}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Payment Proof & Admin Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Payment Proof Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>Bukti Pembayaran QRIS</span>
              <span className="text-[10px] font-bold text-slate-500">
                {order.proof_path ? 'Terlampir' : 'Belum Diunggah'}
              </span>
            </h3>

            {order.proof_path ? (
              <div className="space-y-3">
                <div 
                  onClick={() => setZoomProof(true)}
                  className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group h-64 flex items-center justify-center"
                >
                  <img
                    src={apiUrl(order.proof_path)}
                    alt="Bukti Transfer"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-bold text-xs">
                    <ZoomIn className="w-5 h-5" />
                    <span>Klik untuk Memperbesar</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <p><strong>File:</strong> {order.proof_filename || 'Bukti Transfer'}</p>
                  <p><strong>Diunggah:</strong> {order.proof_uploaded_at || '-'}</p>
                  {order.proof_verified_at && (
                    <p><strong>Diverifikasi:</strong> {order.proof_verified_at} oleh {order.verified_by_name || 'Admin'}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Customer belum mengunggah bukti pembayaran untuk pesanan ini.</p>
              </div>
            )}
          </div>

          {/* Workflow Action Controls */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Tindakan Admin (Workflow)</h3>

            {/* Approve Button */}
            {order.status === 'WAITING_VERIFICATION' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui (PAID)</span>
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setRejectModalOpen(true)}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Bukti</span>
                </button>
              </div>
            )}

            {order.status === 'PAID' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setProcessModalOpen(true)}
                className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Mulai Proses Top Up (PROCESSING)</span>
              </button>
            )}

            {order.status === 'PROCESSING' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleComplete}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Selesaikan Pesanan (COMPLETED)</span>
              </button>
            )}

            {order.status === 'PENDING_PAYMENT' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Customer masih dalam tahap pembayaran. Admin dapat menyetujui jika customer telah membayar langsung.</p>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Sudah Bayar (PAID)</span>
                </button>
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pesanan telah rampung (COMPLETED). Tidak ada tindakan lebih lanjut.</span>
              </div>
            )}

            {order.status === 'REJECTED' && (
              <div className="space-y-2">
                <p className="text-xs text-rose-600 font-semibold">Pesanan ditolak. Customer dapat mengunggah bukti ulang di portal pembayaran.</p>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Ubah Menjadi Disetujui (PAID)
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Proof Zoom Modal */}
      {zoomProof && order.proof_path && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-xs text-slate-800">
                Pemeriksaan Bukti Transfer: {order.order_id}
              </span>
              <button
                onClick={() => setZoomProof(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-900">
              <img
                src={apiUrl(order.proof_path)}
                alt="Zoom Bukti"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Tolak Bukti Pembayaran</h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Penolakan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Bukti transfer buram / nominal tidak sesuai / nama rekening berbeda..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-rose-500"
                ></textarea>
                <p className="text-[10px] text-slate-400 mt-1">Alasan ini akan ditampilkan kepada customer di halaman pesanan mereka.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Modal */}
      {processModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Ubah Status Menjadi PROCESSING</h3>
              <button onClick={() => setProcessModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Proses (Opsional)
                </label>
                <input
                  type="text"
                  value={processNote}
                  onChange={(e) => setProcessNote(e.target.value)}
                  placeholder="Contoh: Sedang dalam antrian kirim publisher..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProcessModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Mulai Proses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
