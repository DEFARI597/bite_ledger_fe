import React, { useState, useEffect } from 'react';
import { Pencil, X, AlertCircle, Eye, EyeOff, User as UserIcon, Mail } from 'lucide-react';
import userService from '../../../../services/userService';
import { formatRoleLabel } from '../utils/userFormatters';

export function EditUserModal({ isOpen, onClose, onSuccess, roles = [], userToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen && userToEdit) {
      setFormData({
        name: userToEdit.name || userToEdit.full_name || '',
        email: userToEdit.email || '',
        password: '',
        roleId: userToEdit.roleId || userToEdit.role_id || userToEdit.role?.id || '',
      });
      setFormError('');
      setShowPassword(false);
    }
  }, [isOpen, userToEdit]);

  if (!isOpen || !userToEdit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.roleId) {
      setFormError('Nama, email, dan peran wajib diisi.');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        roleId: formData.roleId,
      };
      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password.trim();
      }

      await userService.updateUser(userToEdit.id, payload);
      onSuccess('Data anggota tim berhasil diperbarui.');
      onClose();
    } catch (err) {
      setFormError(err.message || 'Gagal memperbarui data anggota tim.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{
            background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
          }}
        >
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            <h3 className="font-bold text-base">Edit Data Staf</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-orange-100 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="edit-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-xs font-semibold text-gray-700 mb-1">
              Email Akun <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="edit-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-password" className="block text-xs font-semibold text-gray-700 mb-1">
              Password Baru <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>
            </label>
            <div className="relative">
              <input
                id="edit-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password baru jika ingin diganti..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="edit-role" className="block text-xs font-semibold text-gray-700 mb-1">
              Peran / Akses <span className="text-red-500">*</span>
            </label>
            <select
              id="edit-role"
              name="roleId"
              required
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {formatRoleLabel(r.name)} — {r.description}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
              }}
            >
              {formSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
