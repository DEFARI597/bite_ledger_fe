import { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  Minus,
  Check,
  Package,
  Info,
} from 'lucide-react';
import inventoryService from '../../../../services/inventoryService';
import { formatStock, getStockStatus } from '../utils/inventoryFormatters';

export function AdjustStockPage({ material, onBack, onSuccess }) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!material) return null;

  const currentStock = Number(material.stock || 0);
  const numAmount = parseFloat(amount) || 0;

  let previewStock = currentStock;
  if (mode === 'add') {
    previewStock = currentStock + numAmount;
  } else if (mode === 'subtract') {
    previewStock = currentStock - numAmount;
  } else if (mode === 'set') {
    previewStock = numAmount;
  }

  const currentStatus = getStockStatus(currentStock, material.minStockAlert);
  const projectedStatus = getStockStatus(previewStock, material.minStockAlert);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (amount === '' || isNaN(numAmount)) {
      setFormError('Masukkan jumlah yang valid.');
      return;
    }

    if (mode === 'set' && numAmount < 0) {
      setFormError('Stok fisik tidak boleh bernilai negatif.');
      return;
    }

    if (mode !== 'set' && numAmount <= 0) {
      setFormError('Jumlah penyesuaian harus lebih besar dari 0.');
      return;
    }

    if (previewStock < 0) {
      setFormError('Stok akhir tidak boleh kurang dari 0.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (mode === 'set') {
        await inventoryService.adjustStock(material.id, {
          setStock: numAmount,
        });
      } else {
        const changeValue = mode === 'add' ? numAmount : -numAmount;
        await inventoryService.adjustStock(material.id, {
          change: changeValue,
        });
      }

      if (onSuccess) {
        onSuccess(`Stok "${material.name}" berhasil disesuaikan menjadi ${formatStock(previewStock, material.unit)}.`);
      }
    } catch (err) {
      setFormError(err.message || 'Gagal menyesuaikan stok.');
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
              Inventori & Manajemen Bahan
            </button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">Penyesuaian Stok</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Penyesuaian Stok Bahan Baku
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Pencatatan mutasi masuk, keluar, atau hasil stock opname untuk <strong className="text-gray-800">{material.name}</strong>.
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
            <div className="font-semibold text-red-800">Gagal Memproses Penyesuaian</div>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Pilih Jenis Mutasi Stok
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMode('add')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${mode === 'add'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900">Tambah Masuk (+)</span>
                  <div className={`p-1.5 rounded-lg ${mode === 'add' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">Restock baru, penerimaan dari vendor, atau retur dapur.</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('subtract')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${mode === 'subtract'
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900">Kurang Keluar (-)</span>
                  <div className={`p-1.5 rounded-lg ${mode === 'subtract' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600'}`}>
                    <Minus className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">Bahan rusak, basi, kadaluarsa, atau pemakaian di luar menu.</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('set')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${mode === 'set'
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900">Set Fisik Opname (=)</span>
                  <div className={`p-1.5 rounded-lg ${mode === 'set' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-600'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">Koreksi total fisik riil hasil stock opname berkala.</p>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {mode === 'set' ? 'Total Stok Fisik Aktual Saat Ini' : 'Jumlah Penyesuaian'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder={mode === 'set' ? 'Masukkan total stok riil...' : 'Contoh: 5, 2.5, 10...'}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium pr-14"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">
                  {material.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Keterangan / Alasan Penyesuaian (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Faktur PO #1042 dari supplier, selisih stock opname mingguan, susu pecah..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
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
              disabled={formSubmitting || !amount}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
              }}
            >
              <Save className="w-4 h-4" />
              <span>{formSubmitting ? 'Memproses...' : 'Simpan Penyesuaian Stok'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white p-6 rounded-2xl border border-orange-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2 text-orange-800">
                <Package className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Kalkulasi Stok</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Simulasi
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs space-y-3.5">
              <div>
                <span className="text-[11px] text-gray-400 block">Item Bahan Baku:</span>
                <h4 className="font-bold text-gray-900 text-sm">{material.name}</h4>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Stok Saat Ini:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-900">{formatStock(currentStock, material.unit)}</strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentStatus.badgeClass}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Mutasi ({mode === 'add' ? '+' : mode === 'subtract' ? '-' : '='}):</span>
                  <span className={`font-semibold ${mode === 'add' ? 'text-emerald-600' : mode === 'subtract' ? 'text-red-600' : 'text-orange-600'}`}>
                    {mode === 'add' ? `+${formatStock(numAmount, material.unit)}` : mode === 'subtract' ? `-${formatStock(numAmount, material.unit)}` : `Set ke ${formatStock(numAmount, material.unit)}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-gray-700">Estimasi Stok Akhir:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-600 text-sm">
                      {formatStock(previewStock, material.unit)}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${projectedStatus.badgeClass}`}>
                      {projectedStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[11px]">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Petunjuk Mutasi:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-500 pl-4 list-disc">
                <li>Nilai stok yang disesuaikan akan langsung menjadi acuan ketersediaan menu makanan di kasir POS.</li>
                <li>Jika stok akhir jatuh di bawah batas minimum ({formatStock(material.minStockAlert, material.unit)}), peringatan stok rendah akan aktif otomatis.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdjustStockPage;
