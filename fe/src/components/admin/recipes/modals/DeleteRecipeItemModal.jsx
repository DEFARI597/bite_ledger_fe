import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import ProductImageThumbnail from '../../../common/ProductImageThumbnail';

export function DeleteRecipeItemModal({
  isOpen,
  onClose,
  item,
  product,
  onConfirm,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onConfirm(item.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menghapus bahan dari resep.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-base">Hapus Bahan dari Resep?</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-800">{item.rawMaterialName}</span> ({item.quantityRequired} {item.unit}) dari resep menu ini?
          </p>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
          <ProductImageThumbnail imagePath={product?.imageUrl} alt={product?.name} size="sm" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-gray-400">Menu Produk</p>
            <p className="text-xs font-bold text-gray-800 truncate">{product?.name}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {submitting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRecipeItemModal;
