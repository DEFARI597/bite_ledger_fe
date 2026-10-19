import { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Save,
  AlertCircle,
  Calculator,
  Info,
  Scale,
} from 'lucide-react';
import recipeService from '../../../../services/recipeService';
import { formatCurrency, formatStock } from '../utils/inventoryFormatters';

export function AddRecipeItemPage({
  productId,
  productName,
  materials = [],
  onBack,
  onSuccess,
}) {
  const [rawMaterialId, setRawMaterialId] = useState(
    () => (materials.length > 0 ? materials[0].id : '')
  );
  const [quantityRequired, setQuantityRequired] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedMaterial = materials.find((m) => m.id === rawMaterialId);
  const qty = parseFloat(quantityRequired) || 0;
  const unitCost = Number(selectedMaterial?.costPerUnit || 0);
  const totalCost = selectedMaterial ? qty * unitCost : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!productId) {
      setFormError('Produk belum dipilih.');
      return;
    }
    if (!rawMaterialId) {
      setFormError('Pilih bahan baku terlebih dahulu.');
      return;
    }
    if (qty <= 0) {
      setFormError('Takaran kebutuhan harus lebih besar dari 0.');
      return;
    }

    setFormSubmitting(true);
    try {
      await recipeService.addRecipeItem({
        productId,
        rawMaterialId,
        quantityRequired: qty,
      });

      if (onSuccess) {
        onSuccess(`Bahan "${selectedMaterial?.name}" berhasil ditambahkan ke resep.`);
      }
    } catch (err) {
      setFormError(err.message || 'Gagal menambahkan bahan ke resep.');
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Inventori & Resep Menu
            </button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">Tambah Bahan Resep</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Tambah Bahan ke Resep Menu
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Resep untuk produk: <strong className="text-gray-900">{productName || 'Menu Terpilih'}</strong>
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
          <span>Kembali ke Resep Menu</span>
        </button>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div className="font-semibold text-red-800">Gagal Menambahkan Bahan</div>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Scale className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">Takaran & Komposisi Menu</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Pilih Bahan Baku dari Gudang <span className="text-red-500">*</span>
                </label>
                <select
                  value={rawMaterialId}
                  onChange={(e) => setRawMaterialId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer font-medium"
                >
                  <option value="">-- Pilih Bahan Baku --</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stok: {formatStock(m.stock, m.unit)} — {formatCurrency(m.costPerUnit)}/{m.unit})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Bahan baku mentah yang dialokasikan saat kasir mencatat penjualan menu ini.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Takaran Kebutuhan per Porsi{' '}
                  {selectedMaterial && (
                    <span className="text-orange-600 font-bold">({selectedMaterial.unit})</span>
                  )}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="Contoh: 18 (gram), 120 (ml), 1 (pcs)..."
                    value={quantityRequired}
                    onChange={(e) => setQuantityRequired(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium pr-16"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">
                    {selectedMaterial?.unit || 'satuan'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Jumlah bahan yang dipotong otomatis dari inventori setiap 1 porsi menu terjual.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
              disabled={formSubmitting || !rawMaterialId || qty <= 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
              }}
            >
              <Save className="w-4 h-4" />
              <span>{formSubmitting ? 'Menyimpan...' : 'Tambahkan ke Resep'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white p-6 rounded-2xl border border-orange-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2 text-orange-800">
                <Calculator className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Kalkulasi HPP</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Real-time
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs space-y-3.5">
              <div>
                <span className="text-[11px] text-gray-400 block">Menu Produk:</span>
                <h4 className="font-bold text-gray-900 text-sm leading-snug">{productName}</h4>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Bahan Terpilih:</span>
                  <strong className="text-gray-900 text-right truncate max-w-40">
                    {selectedMaterial?.name || '-'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Harga Satuan Bahan:</span>
                  <span className="text-gray-700">
                    {formatCurrency(unitCost)} / {selectedMaterial?.unit || 'unit'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Takaran per Porsi:</span>
                  <strong className="text-gray-900 font-semibold">
                    {formatStock(qty, selectedMaterial?.unit || '')}
                  </strong>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-gray-700">Kontribusi Biaya HPP:</span>
                  <span className="font-bold text-orange-600 text-sm">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[11px]">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Info Kalkulasi HPP:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-500 pl-4 list-disc">
                <li>Biaya bahan ini akan ditambahkan ke Total HPP menu <strong className="text-gray-700">{productName}</strong>.</li>
                <li>Margin keuntungan kotor akan otomatis terhitung ulang di modul Laporan Penjualan.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddRecipeItemPage;
