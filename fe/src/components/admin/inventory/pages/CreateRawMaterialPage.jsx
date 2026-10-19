import { useState, useEffect } from 'react';
import {
  Boxes,
  ArrowLeft,
  Save,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Building2,
  DollarSign,
} from 'lucide-react';
import inventoryService from '../../../../services/inventoryService';
import supplierService from '../../../../services/supplierService';
import { formatCurrency, formatStock, getStockStatus } from '../utils/inventoryFormatters';

export function CreateRawMaterialPage({ onBack, onSuccess, initialSuppliers = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    supplierId: '',
    stock: '0',
    costPerUnit: '0',
    minStockAlert: '5',
    expDate: '',
  });

  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const commonUnits = ['kg', 'gram', 'liter', 'ml', 'pcs', 'butir', 'bungkus', 'kaleng', 'botol', 'pack'];

  // Fetch complete suppliers list if not already supplied
  useEffect(() => {
    let isMounted = true;
    const loadSuppliers = async () => {
      if (initialSuppliers.length >= 10) return;
      setLoadingSuppliers(true);
      try {
        const res = await supplierService.getSuppliers({ limit: 100 });
        if (isMounted && res.data?.suppliers) {
          setSuppliers(res.data.suppliers);
        }
      } catch (err) {
        console.error('Failed to load full suppliers list for create page:', err);
      } finally {
        if (isMounted) setLoadingSuppliers(false);
      }
    };
    loadSuppliers();
    return () => {
      isMounted = false;
    };
  }, [initialSuppliers]);

  const parsedStock = parseFloat(formData.stock) || 0;
  const parsedCost = parseFloat(formData.costPerUnit) || 0;
  const parsedMinStock = parseFloat(formData.minStockAlert) || 0;
  const totalValue = parsedStock * parsedCost;
  const stockStatus = getStockStatus(parsedStock, parsedMinStock);
  const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nama bahan baku wajib diisi.');
      return;
    }
    if (!formData.unit.trim()) {
      setFormError('Satuan unit wajib dipilih.');
      return;
    }

    setFormSubmitting(true);
    try {
      await inventoryService.createRawMaterial({
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        supplierId: formData.supplierId || null,
        stock: parsedStock,
        costPerUnit: parsedCost,
        minStockAlert: parsedMinStock,
        expDate: formData.expDate || null,
      });

      if (onSuccess) {
        onSuccess(`Bahan baku "${formData.name.trim()}" berhasil ditambahkan ke inventori.`);
      }
    } catch (err) {
      setFormError(err.message || 'Gagal menambahkan bahan baku baru.');
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Inventori & Manajemen Bahan
            </button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">Tambah Bahan Baku</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Tambah Bahan Baku Baru
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Pendaftaran item bahan mentah baru untuk pengelolaan stok gudang dan kalkulasi HPP resep.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs cursor-pointer active:scale-98 w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Kembali ke Daftar Bahan</span>
        </button>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div className="font-semibold text-red-800">Gagal Menyimpan Data</div>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Main Form & Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Form Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Identitas & Klasifikasi Bahan */}
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Layers className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">1. Identitas & Satuan Bahan Baku</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Bahan Baku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biji Kopi Arabika Gayo, Susu UHT Full Cream, Gula Pasir..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Gunakan nama bahan yang jelas dan spesifik agar mudah diidentifikasi saat peracikan resep.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Satuan Unit Acuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                  >
                    {commonUnits.map((u) => (
                      <option key={u} value={u}>
                        {u} (Satuan baku)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Satuan ini digunakan untuk stok, takaran resep, dan HPP.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mitra Pemasok / Vendor (Opsional)
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                  >
                    <option value="">-- Tanpa Pemasok Tertaut --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.contactPerson ? `(${s.contactPerson})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {loadingSuppliers ? 'Memuat daftar pemasok...' : 'Pemasok utama penyedia bahan mentah ini.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pengelolaan Stok & Nilai Beli */}
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">2. Manajemen Stok & Biaya Beli (HPP)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Stok Awal ({formData.unit || 'unit'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all pr-12 font-medium"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">
                    {formData.unit}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Jumlah fisik saat ini di gudang/dapur.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Batas Min. Peringatan
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="5"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all pr-12 font-medium"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">
                    {formData.unit}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Peringatan otomatis saat stok di bawah nilai ini.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Harga Beli / Unit (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-semibold">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Biaya per satuan untuk kalkulasi HPP resep.</p>
              </div>
            </div>
          </div>

          {/* Card 3: Masa Kadaluarsa */}
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Calendar className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">3. Masa Simpan & Kadaluarsa (Opsional)</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                value={formData.expDate}
                onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                className="w-full sm:w-1/2 px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Isi jika bahan memiliki masa simpan terbatas (susu segar, daging, produk perishable).
              </p>
            </div>
          </div>

          {/* Form Actions (Mobile / Bottom) */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={formSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
              }}
            >
              <Save className="w-4 h-4" />
              <span>{formSubmitting ? 'Menyimpan Bahan...' : 'Simpan Bahan Baku'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (1 Col on lg): Live Preview & Summary Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white p-6 rounded-2xl border border-orange-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2 text-orange-800">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Pratinjau Item</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Live Preview
              </span>
            </div>

            {/* Simulated Table Row / Item Preview */}
            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug break-words">
                    {formData.name.trim() || 'Nama Bahan Baku'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                      Satuan: {formData.unit}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${stockStatus.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}`} />
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Stok Fisik Awal:</span>
                  <strong className="text-gray-900">{formatStock(parsedStock, formData.unit)}</strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Batas Peringatan:</span>
                  <span className="text-amber-700 font-medium">
                    {formatStock(parsedMinStock, formData.unit)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Harga Beli / Unit:</span>
                  <strong className="text-gray-900">{formatCurrency(parsedCost)}</strong>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
                  <span className="font-semibold text-gray-700">Total Nilai Stok:</span>
                  <span className="font-bold text-orange-600 text-sm">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              </div>

              {selectedSupplier && (
                <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-100 text-[11px] space-y-0.5">
                  <div className="font-bold text-orange-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{selectedSupplier.name}</span>
                  </div>
                  {selectedSupplier.phone && (
                    <div className="text-gray-600">Kontak: {selectedSupplier.phone}</div>
                  )}
                </div>
              )}
            </div>

            {/* Helpful Guide / Tips */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[11px]">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Petunjuk Inventori:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-500 pl-4 list-disc">
                <li>Bahan baku yang didaftarkan akan langsung tersedia untuk pembuatan Resep Menu.</li>
                <li>Peringatan stok menipis otomatis aktif jika stok kurang dari batas minimum.</li>
                <li>Pencatatan mutasi stok dapat dilakukan kapan saja melalui tombol penyesuaian di tabel.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateRawMaterialPage;
