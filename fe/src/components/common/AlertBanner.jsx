import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export function AlertBanner({ alert, onClose }) {
  if (!alert) return null;

  const isError = alert.type === 'error';

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl flex items-center justify-between shadow-xs transition-all animate-in fade-in ${
        isError
          ? 'bg-red-50 text-red-800 border border-red-200'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        )}
        <span className="text-xs sm:text-sm font-medium leading-snug break-words">
          {alert.message}
        </span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default AlertBanner;
