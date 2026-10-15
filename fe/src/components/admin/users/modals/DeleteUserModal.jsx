import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import userService from '../../../../services/userService';

export function DeleteUserModal({ isOpen, onClose, onSuccess, userToDelete }) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await userService.deleteUser(userToDelete.id);
      onSuccess(`Akun staf "${userToDelete.name}" berhasil dinonaktifkan.`);
      onClose();
    } catch (err) {
      onSuccess(err.message || 'Gagal menonaktifkan akun staf.', 'error');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-red-100 overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1.5">
          Nonaktifkan Akun Staf?
        </h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Akun atas nama <strong className="text-gray-800">{userToDelete.name}</strong> ({userToDelete.email}) akan dinonaktifkan dan tidak dapat lagi login ke sistem.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Menghapus...' : 'Ya, Nonaktifkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
