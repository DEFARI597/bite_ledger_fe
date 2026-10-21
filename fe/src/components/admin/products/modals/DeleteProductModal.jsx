import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import productService from '../../../../services/productService';

export function DeleteProductModal({ isOpen, onClose, onSuccess, product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const hasRecipe = product.recipe?.items && product.recipe.items.length > 0;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await productService.deleteProduct(product.id);
      onSuccess(`Menu produk "${product.name}" berhasil dihapus.`);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menghapus menu produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-red-100 overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">Hapus Menu Produk?</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus menu produk{' '}
              <strong className="text-gray-900 font-semibold">{product.name}</strong>?
            </p>
          </div>

          {hasRecipe && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Perhatian: Menu ini memiliki formula resep ({product.recipe.items.length} bahan BOM). Menghapus menu ini juga akan menghapus konfigurasi resep terkait.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Menghapus...' : 'Ya, Hapus Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
