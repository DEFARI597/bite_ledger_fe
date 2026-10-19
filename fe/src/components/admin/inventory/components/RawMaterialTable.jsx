import React from 'react';
import { Boxes, RefreshCw, SlidersHorizontal, Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatStock, formatDate, getStockStatus } from '../utils/inventoryFormatters';

export function RawMaterialTable({
  materials = [],
  loading = false,
  onEdit,
  onAdjustStock,
  onDelete,
  pagination,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-50/60 border-b border-orange-100 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3.5">Bahan Baku</th>
              <th className="px-6 py-3.5">Pemasok</th>
              <th className="px-6 py-3.5">Stok Saat Ini</th>
              <th className="px-6 py-3.5">Batas Minimum</th>
              <th className="px-6 py-3.5">Harga / Unit</th>
              <th className="px-6 py-3.5">Kadaluarsa</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                  <span>Memuat data bahan baku...</span>
                </td>
              </tr>
            ) : materials.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <Boxes className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="font-medium text-gray-600">Tidak ada bahan baku ditemukan</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Coba ganti kata kunci pencarian atau sesuaikan filter pemasok Anda.
                  </p>
                </td>
              </tr>
            ) : (
              materials.map((item) => {
                const status = getStockStatus(item.stock, item.minStockAlert);
                return (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                    {/* Bahan Baku */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <span className="px-1.5 py-0.2 bg-gray-100 rounded text-gray-600 font-semibold">
                          Satuan: {item.unit}
                        </span>
                      </div>
                    </td>

                    {/* Pemasok */}
                    <td className="px-6 py-4 text-gray-600">
                      {item.supplier ? (
                        <div>
                          <div className="font-medium text-gray-800">{item.supplier.name}</div>
                          {item.supplier.contactPerson && (
                            <div className="text-[11px] text-gray-400">
                              {item.supplier.contactPerson} ({item.supplier.phone || '-'})
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Tanpa Pemasok</span>
                      )}
                    </td>

                    {/* Stok Saat Ini */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatStock(item.stock, item.unit)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                          {status.label}
                        </span>
                      </div>
                    </td>

                    {/* Batas Minimum */}
                    <td className="px-6 py-4 text-gray-600">
                      {formatStock(item.minStockAlert, item.unit)}
                    </td>

                    {/* Harga Beli / Unit */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(item.costPerUnit)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Nilai: {formatCurrency(item.stock * item.costPerUnit)}
                      </div>
                    </td>

                    {/* Kadaluarsa */}
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(item.expDate)}</span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAdjustStock(item)}
                          title="Stok Opname / Sesuaikan Stok"
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Ubah Detail Bahan"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          title="Hapus Bahan"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
}

export default RawMaterialTable;
