import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function UserPagination({ page, totalPages, loading = false, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-3.5 bg-gray-50/70 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
      <div>
        Halaman <strong className="text-gray-900">{page}</strong> dari{' '}
        <strong className="text-gray-900">{totalPages}</strong>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || loading}
          aria-label="Halaman sebelumnya"
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              page === p
                ? 'bg-orange-600 text-white shadow-xs'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || loading}
          aria-label="Halaman berikutnya"
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default UserPagination;
