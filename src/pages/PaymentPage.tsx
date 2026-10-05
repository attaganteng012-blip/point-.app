import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  QrCode, 
  Copy, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api, Order, apiUrl } from '../services/api.ts';

export const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOrder = () => {
    if (!orderId) return;
    api.getOrder(orderId)
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Pesanan tidak ditemukan'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    // Polling order status every 15s to automatically update when admin approves/rejects
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCopyAmount = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.total_amount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Format file tidak didukung. Harap pilih gambar JPG, PNG, atau WEBP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal adalah 5 MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedFile) {
      setUploadError('Harap pilih file bukti pembayaran terlebih dahulu.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    try {
      const res = await api.uploadPaymentProof(order.order_id, selectedFile);
      setUploadMessage(res.message);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchOrder(); // refresh order state
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah bukti pembayaran.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-500">Memuat rincian pembayaran...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8 rounded-3xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-1">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6">{error || 'Periksa kembali Order ID Anda.'}</p>
          <Link
            to="/check-order"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Lacak Pesanan
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner Status */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID:</span>
              <span className="text-sm font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {order.order_id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Instruksi Pembayaran QRIS
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(order.status)}
            <button
              onClick={fetchOrder}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg shadow-xs"
              title="Perbarui Status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Details Mini Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
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
            <span className="font-mono font-bold text-slate-800 text-sm">
              {order.player_id} {order.server_id ? `(${order.server_id})` : ''}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Customer:</span>
            <span className="font-bold text-slate-800 text-sm">{order.customer_name}</span>
          </div>
        </div>
      </div>

      {/* Rejection Alert */}
      {order.status === 'REJECTED' && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Bukti Pembayaran Ditolak oleh Admin</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            <strong>Alasan:</strong> {order.rejection_reason || 'Bukti pembayaran tidak sesuai atau tidak terbaca.'}
          </p>
          <p className="text-xs text-rose-600">
            Silakan unggah kembali bukti transfer yang jelas dan valid pada formulir di bawah.
          </p>
        </div>
      )}

      {/* Completed Success Alert */}
      {order.status === 'COMPLETED' && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-base">Top Up Selesai (COMPLETED)</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Item game telah berhasil dikirimkan ke akun <strong>{order.player_id}</strong>. 
              {order.process_note ? ` Catatan admin: "${order.process_note}"` : ''}
            </p>
            <div className="pt-2">
              <Link
                to={`/invoice/${order.order_id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat & Cetak Invoice Resmi</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Payment QRIS & Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Official QRIS Card */}
        <div className="md:col-span-6 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 text-center space-y-4">
            
            <div className="bg-rose-50/80 py-2 px-4 rounded-xl border border-rose-100 inline-block">
              <span className="text-xs text-slate-600 block">Total yang Harus Dibayar:</span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-rose-600">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 shadow-xs"
                  title="Salin Nominal"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-600 font-bold block mt-1">Nominal berhasil disalin!</span>}
            </div>

            {/* Official QRIS Sheet Image */}
            <div className="max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 bg-white p-2">
              <img
                src="/payment/qris-dana.png"
                alt="QRIS DANA Bisnis Resmi POINT+"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            <div className="pt-2">
              <a
                href="/payment/qris-dana.png"
                download="QRIS-POINT-PLUS.png"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar QRIS</span>
              </a>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-left space-y-1">
              <p className="font-bold text-slate-700">Cara Membayar dengan QRIS:</p>
              <p>1. Buka aplikasi DANA, GoPay, OVO, ShopeePay, BCA Mobile, Livin Mandiri, atau m-Banking lainnya.</p>
              <p>2. Pilih menu <strong>Scan / Bayar QRIS</strong>.</p>
              <p>3. Arahkan kamera ke kode QRIS di atas (atau scan dari galeri hp).</p>
              <p>4. Masukkan nominal tepat <strong>Rp {Number(order.total_amount).toLocaleString('id-ID')}</strong>.</p>
              <p>5. Selesaikan pembayaran & simpan bukti/struk transfer.</p>
            </div>

          </div>
        </div>

        {/* Right: Payment Proof Upload Card */}
        <div className="md:col-span-6 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-rose-600" />
                <span>Unggah Bukti Pembayaran</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kirim bukti transfer agar pesanan Anda segera diverifikasi oleh tim admin kami.
              </p>
            </div>

            {/* Current Proof display if exists */}
            {order.proof_path && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Bukti yang telah diunggah:</span>
                  <span className="text-[11px] text-slate-400">{order.proof_uploaded_at}</span>
                </div>
                <div className="h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img
                    src={apiUrl(order.proof_path)}
                    alt="Bukti Transfer"
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
              </div>
            )}

            {order.status !== 'COMPLETED' && (
              <form onSubmit={handleUploadProof} className="space-y-4">
                
                {/* Drag and Drop / Click File Box */}
                <div className="relative border-2 border-dashed border-slate-300 hover:border-rose-400 bg-white/60 hover:bg-white rounded-2xl p-6 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-36 mx-auto rounded-lg shadow-xs object-contain"
                      />
                      <p className="text-xs font-bold text-slate-700">{selectedFile?.name}</p>
                      <span className="text-[10px] text-rose-600 font-semibold">Klik untuk mengganti gambar</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Klik atau seret foto bukti transfer ke sini
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Format: JPG, JPEG, PNG, WEBP (Maksimal 5 MB)
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{uploadMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Mengunggah Bukti...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-rose-400" />
                      <span>Kirim Bukti Pembayaran</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <Link to={`/invoice/${order.order_id}`} className="hover:text-rose-600 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Invoice</span>
              </Link>

              <Link to="/contact" className="hover:text-slate-800">
                Hubungi Bantuan CS &rarr;
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
