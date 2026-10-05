import React, { useState } from 'react';
import { Download, Check, Copy, Terminal, FileArchive, ArrowRight, ShieldCheck } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const fullDownloadUrl = `${window.location.origin}/point-plus-project.zip`;
  const curlCommand = `curl -L -o point-plus-project.zip "${fullDownloadUrl}"`;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const response = await fetch('/point-plus-project.zip');
      if (!response.ok) throw new Error('Gagal mengambil file zip');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'point-plus-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
    } catch (err) {
      console.error(err);
      // Fallback direct window open
      window.location.href = '/point-plus-project.zip';
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 mb-2">
          <FileArchive className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Download Source Code POINT+
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Unduh seluruh kode sumber aplikasi lengkap (Frontend React, Backend Express, Database SQLite/Postgres, dan aset resmi).
        </p>
      </div>

      {/* Main Download Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">point-plus-project.zip</h3>
            <p className="text-xs text-slate-500">Ukuran: ~25 MB &bull; Format: ZIP Archive &bull; Siap Jalan</p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mengunduh File...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Klik Unduh ZIP Sekarang</span>
              </>
            )}
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unduhan berhasil dimulai! Periksa folder Download pada perangkat Anda.</span>
          </div>
        )}

        {/* Alternative Direct URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Tautan Unduh Langsung (Bisa Dibuka di Tab Baru):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={fullDownloadUrl}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
            />
            <a
              href={fullDownloadUrl}
              target="_blank"
              rel="noreferrer"
              download="point-plus-project.zip"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
            >
              Buka File
            </a>
          </div>
        </div>

        {/* Terminal Curl / Wget Command */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Atau Unduh via Terminal (cURL / Linux / Mac / WSL):</span>
          </label>
          <div className="relative">
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto">
              {curlCommand}
            </pre>
            <button
              onClick={() => copyToClipboard(curlCommand)}
              className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCurl ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Instructions */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 space-y-3 text-xs text-slate-600">
        <h4 className="font-bold text-slate-900 text-sm">Cara Menjalankan Setelah Diekstrak:</h4>
        <ol className="list-decimal list-inside space-y-2 leading-relaxed">
          <li>Ekstrak file <code>point-plus-project.zip</code> ke direktori pilihan Anda.</li>
          <li>Buka folder proyek di terminal / VS Code.</li>
          <li>Jalankan perintah <code>npm install</code> untuk memasang semua modul.</li>
          <li>Jalankan <code>npm run dev</code> untuk memulai server full-stack di <code>http://localhost:3000</code>.</li>
        </ol>
      </div>

    </div>
  );
};
