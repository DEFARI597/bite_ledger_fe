import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { defaultRoute } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        Tautan rute yang Anda tuju tidak terdaftar di sistem Bite Ledger.
      </p>

      <button
        onClick={() => navigate(defaultRoute || '/')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Dashboard</span>
      </button>
    </div>
  );
}

export default NotFoundPage;
