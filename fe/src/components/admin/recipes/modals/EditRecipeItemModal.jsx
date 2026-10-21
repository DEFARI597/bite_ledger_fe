import { useState, useEffect } from 'react';
import { X, Edit2, AlertCircle, Coins } from 'lucide-react';
import ProductImageThumbnail from '../../../common/ProductImageThumbnail';

export function EditRecipeItemModal({
  isOpen,
  onClose,
  item,
  product,
  onSubmit,
}) {
  const [quantityRequired, setQuantityRequired] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setError('');
      setQuantityRequired(String(item.quantityRequired || ''));
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const qtyNumber = parseFloat(quantityRequired) || 0;
  const costPerUnit = Number(item.costPerUnit || 0);
  const estimatedCost = (qtyNumber * costPerUnit).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantityRequired || qtyNumber <= 0) {
      setError('Kuantitas takaran harus lebih besar dari 0.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(item.id, {
        quantityRequired: qtyNumber,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui takaran bahan.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ProductImageThumbnail
              imagePath={product?.imageUrl}
              alt={product?.name}
              size="sm"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight">Ubah Takaran Bahan</h3>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{product?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Material Name Display */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bahan Baku</span>
            <span className="text-sm font-bold text-gray-900">{item.rawMaterialName}</span>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Harga Satuan: {formatRupiah(item.costPerUnit)} per {item.unit}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Takaran Baru per Porsi:</label>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Satuan: {item.unit}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.001"
                placeholder="Masukkan takaran baru"
                value={quantityRequired}
                onChange={(e) => setQuantityRequired(e.target.value)}
                className="w-full pl-3 pr-16 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                {item.unit}
              </div>
            </div>
          </div>

          {/* Cost preview */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-900 font-medium">Estimasi Subtotal Baru:</span>
            </div>
            <span className="text-xs font-bold text-amber-900">
              {formatRupiah(estimatedCost)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || qtyNumber <= 0}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {submitting ? 'Memperbarui...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRecipeItemModal;
