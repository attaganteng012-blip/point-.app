import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, CheckCircle2, XCircle, Search, RefreshCw, X } from 'lucide-react';
import { api, Product, Game } from '../../services/api.ts';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formGameId, setFormGameId] = useState<number>(1);
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formActive, setFormActive] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminProducts(
        selectedGameFilter !== 'ALL' ? parseInt(selectedGameFilter, 10) : undefined
      );
      setProducts(data.products || []);
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedGameFilter]);

  const handleOpenAdd = () => {
    setFormGameId(games[0]?.id || 1);
    setFormName('');
    setFormAmount('');
    setFormPrice(10000);
    setFormActive(true);
    setAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormAmount(p.amount);
    setFormPrice(p.price);
    setFormActive(Boolean(p.active));
    setEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminProduct({
        game_id: formGameId,
        name: formName.trim(),
        amount: formAmount.trim(),
        price: Number(formPrice),
        active: formActive
      });
      setAddModalOpen(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Gagal menambah produk');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.updateAdminProduct(editingProduct.id, {
        name: formName.trim(),
        amount: formAmount.trim(),
        price: Number(formPrice),
        active: formActive
      });
      setEditModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui produk');
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await api.updateAdminProduct(p.id, { active: !p.active });
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status');
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${p.name}"?`)) return;

    try {
      await api.deleteAdminProduct(p.id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus produk');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-600" />
            <span>Kelola Produk Top Up</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar harga produk langsung dari database utama POINT+
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedGameFilter}
            onChange={(e) => setSelectedGameFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
          >
            <option value="ALL">Semua Game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Belum ada produk untuk game ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Nama Produk</th>
                  <th className="py-3 px-4">Jumlah (Amount)</th>
                  <th className="py-3 px-4">Harga Database</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.game_name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {p.amount}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-rose-600 text-sm">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit Produk"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Tambah Produk Baru</h3>
              <button onClick={() => setAddModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Game</label>
                <select
                  value={formGameId}
                  onChange={(e) => setFormGameId(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {games.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: 86 Diamonds"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah (Amount)</label>
                <input
                  type="text"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="Contoh: 86"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rupiah)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formPrice}
                  onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-rose-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded-md text-rose-600"
                />
                <label htmlFor="addActive" className="text-xs font-semibold text-slate-700">Aktifkan untuk Customer</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Edit Produk #{editingProduct.id}</h3>
              <button onClick={() => setEditModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah (Amount)</label>
                <input
                  type="text"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rupiah)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formPrice}
                  onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-rose-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded-md text-rose-600"
                />
                <label htmlFor="editActive" className="text-xs font-semibold text-slate-700">Aktifkan untuk Customer</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Perbarui Harga & Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
