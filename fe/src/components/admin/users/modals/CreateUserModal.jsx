import React, { useState, useEffect } from 'react';
import { UserPlus, X, AlertCircle, Eye, EyeOff, User as UserIcon, Mail } from 'lucide-react';
import userService from '../../../../services/userService';
import { formatRoleLabel } from '../utils/userFormatters';

export function CreateUserModal({ isOpen, onClose, onSuccess, roles = [] }) {
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
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        roleId: roles.length > 0 ? roles[0].id : '',
      });
      setFormError('');
      setShowPassword(false);
    }
  }, [isOpen, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.roleId) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }

    setFormSubmitting(true);
    try {
      await userService.createUser(formData);
      onSuccess('Anggota tim baru berhasil ditambahkan.');
      onClose();
    } catch (err) {
      setFormError(err.message || 'Gagal menambahkan anggota tim.');
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
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-base">Tambah Anggota Tim</h3>
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
            <label htmlFor="create-name" className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="create-name"
                name="name"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="create-email" className="block text-xs font-semibold text-gray-700 mb-1">
              Email Akun <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="create-email"
                name="email"
                type="email"
                required
                placeholder="Contoh: budi@biteledger.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="create-password" className="block text-xs font-semibold text-gray-700 mb-1">
              Password Awal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="create-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi staf..."
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
            <label htmlFor="create-role" className="block text-xs font-semibold text-gray-700 mb-1">
              Peran / Akses <span className="text-red-500">*</span>
            </label>
            <select
              id="create-role"
              name="roleId"
              required
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="" disabled>
                Pilih Peran
              </option>
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
              {formSubmitting ? 'Menyimpan...' : 'Simpan Staf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
