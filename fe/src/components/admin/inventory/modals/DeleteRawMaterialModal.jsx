import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import inventoryService from '../../../../services/inventoryService';

export function DeleteRawMaterialModal({ isOpen, onClose, onSuccess, material }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !material) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await inventoryService.deleteRawMaterial(material.id);
      onSuccess(`Bahan baku ${material.name} berhasil dihapus.`);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menghapus bahan baku.');
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
            <h3 className="text-base font-bold text-gray-900">Hapus Bahan Baku?</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus bahan baku{' '}
              <strong className="text-gray-900 font-semibold">{material.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

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
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menghapus...' : 'Ya, Hapus Bahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteRawMaterialModal;
