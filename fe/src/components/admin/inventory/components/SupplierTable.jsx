import React from 'react';
import { Truck, RefreshCw, Edit2, Trash2, Phone, MapPin, User, Search, X } from 'lucide-react';

export function SupplierTable({
  suppliers = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  onSearchClear,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onRefresh,
}) {
  return (
    <div className="space-y-4">
      {/* Top search & refresh bar */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama pemasok, kontak, telepon..."
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

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-gray-500">
            Total: <strong className="text-gray-800 font-semibold">{pagination?.total || suppliers.length}</strong> pemasok
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/60 border-b border-orange-100 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-3.5">Perusahaan / Pemasok</th>
                <th className="px-6 py-3.5">Kontak Person</th>
                <th className="px-6 py-3.5">No. Telepon</th>
                <th className="px-6 py-3.5">Alamat</th>
                <th className="px-6 py-3.5">Bahan Disuplai</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                    <span>Memuat data pemasok...</span>
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <Truck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600">Tidak ada data pemasok ditemukan</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tambahkan mitra pemasok baru untuk mengelola pasokan bahan baku dapur.
                    </p>
                  </td>
                </tr>
              ) : (
                suppliers.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {item.contactPerson ? (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.contactPerson}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {item.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                      {item.address ? (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate" title={item.address}>{item.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                        {item.rawMaterialsCount !== undefined ? item.rawMaterialsCount : (item.rawMaterials?.length || 0)} bahan
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Ubah Data Pemasok"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          title="Hapus Pemasok"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
            <span>
              Halaman <strong>{pagination.page}</strong> dari <strong>{pagination.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => onPageChange(pagination.page - 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => onPageChange(pagination.page + 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierTable;
