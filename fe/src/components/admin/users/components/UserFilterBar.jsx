import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { formatRoleLabel } from '../utils/userFormatters';

export function UserFilterBar({
  searchTerm,
  onSearchChange,
  onSearchClear,
  selectedRoleId,
  onRoleChange,
  roles = [],
  totalUsers = 0,
  loading = false,
  onRefresh,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onSearchClear}
              aria-label="Bersihkan pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-48">
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedRoleId}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">Semua Peran</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {formatRoleLabel(r.name)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <span className="text-xs text-gray-500">
          Total: <strong className="text-gray-800 font-semibold">{totalUsers}</strong> staf
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          title="Muat ulang data"
          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default UserFilterBar;
