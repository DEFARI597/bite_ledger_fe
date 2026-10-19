import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import supplierService from '../../../../services/supplierService';

export function DeleteVendorModal({ isOpen, onClose, onSuccess, vendor }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vendor) return null;

  const handleDelete = async () => {
    setError('');
    setDeleting(true);
    try {
      await supplierService.deleteSupplier(vendor.id);
      onSuccess(`Vendor "${vendor.name}" berhasil dihapus.`);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data vendor.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-red-100 overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-base">Hapus Mitra Vendor?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Apakah Anda yakin ingin menghapus vendor <strong className="text-gray-800">{vendor.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default DeleteVendorModal;
