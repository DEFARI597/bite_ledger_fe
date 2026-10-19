import { Truck, RefreshCw, Edit2, Trash2, Phone, MapPin, User, Search, X } from 'lucide-react';

export function VendorTable({
  vendors = [],
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
            placeholder="Cari nama vendor, kontak, telepon..."
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
            Total: <strong className="text-gray-800 font-semibold">{pagination?.total || vendors.length}</strong> vendor
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
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Vendor / Perusahaan</th>
                <th className="py-3.5 px-4">Kontak Person (PIC)</th>
                <th className="py-3.5 px-4">No. Telepon / WhatsApp</th>
                <th className="py-3.5 px-4">Alamat Operasional</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {loading && vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                    <span>Memuat data vendor...</span>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2 border border-orange-100">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-gray-600 block">Belum ada data vendor</span>
                    <span className="text-[11px] text-gray-400">
                      {searchTerm ? 'Coba ubah kata kunci pencarian Anda' : 'Klik tombol "+ Tambah Vendor" untuk mendaftarkan mitra baru'}
                    </span>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => {
                  const initialLetter = vendor.name?.charAt(0)?.toUpperCase() || 'V';
                  return (
                    <tr key={vendor.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 border border-orange-200">
                            {initialLetter}
                          </div>
                          <div>
                            <span className="block leading-tight text-gray-900 font-bold">{vendor.name}</span>
                            <span className="text-[10px] text-gray-400 font-normal">ID: {vendor.id?.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{vendor.contactPerson || '-'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {vendor.phone ? (
                            <a
                              href={`tel:${vendor.phone}`}
                              className="text-gray-700 hover:text-orange-600 font-medium hover:underline transition-colors"
                            >
                              {vendor.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span title={vendor.address}>{vendor.address || '-'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit && onEdit(vendor)}
                            title="Edit data vendor"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete && onDelete(vendor)}
                            title="Hapus vendor"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div>
              Halaman <strong className="text-gray-800">{pagination.page}</strong> dari{' '}
              <strong className="text-gray-800">{pagination.totalPages}</strong> ({pagination.total} total)
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                Sebelumnya
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                if (
                  p === 1 ||
                  p === pagination.totalPages ||
                  (p >= pagination.page - 1 && p <= pagination.page + 1)
                ) {
                  const isActive = p === pagination.page;
                  return (
                    <button
                      key={p}
                      type="button"
                      disabled={loading}
                      onClick={() => onPageChange && onPageChange(p)}
                      className={`min-w-7 py-1 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === pagination.page - 2 || p === pagination.page + 2) {
                  return <span key={p} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
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

export default VendorTable;
