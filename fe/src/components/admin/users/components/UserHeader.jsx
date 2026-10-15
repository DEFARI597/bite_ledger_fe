import React from 'react';
import { UserPlus } from 'lucide-react';

export function UserHeader({ onOpenCreate }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-orange-100">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Kelola Tim & Staf
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            Super Admin
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Kelola akses, peran, dan kredensial akun staf restoran Bite Ledger.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenCreate}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0 active:scale-98"
        style={{
          background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
        }}
      >
        <UserPlus className="w-4 h-4" />
        <span>Tambah Anggota Tim</span>
      </button>
    </div>
  );
}

export default UserHeader;
