import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { defaultRoute, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">403 - Akses Ditolak</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        Akun Anda tidak memiliki izin otorisasi yang memadai untuk membuka sumber daya halaman ini.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(defaultRoute || '/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
        >
          Keluar Sesi
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
