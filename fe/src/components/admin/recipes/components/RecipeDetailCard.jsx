import { Edit2, Trash2, Plus, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import ProductImageThumbnail from '../../../common/ProductImageThumbnail';

export function RecipeDetailCard({
  product,
  recipe,
  loading = false,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenBulkModal,
}) {
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const sellingPrice = recipe?.sellingPrice || product?.sellingPrice || 0;
  const totalCost = recipe?.totalRecipeCost || 0;
  const grossProfit = Math.max(0, sellingPrice - totalCost);
  const marginPercentage = sellingPrice > 0 ? ((grossProfit / sellingPrice) * 100).toFixed(1) : 0;
  const items = recipe?.items || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Top Banner: Product & Cost Summary */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/40 via-white to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <ProductImageThumbnail
            imagePath={product?.imageUrl}
            alt={product?.name}
            size="lg"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                {product.category || 'Menu'}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  items.length > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {items.length > 0 ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resep Terkonfigurasi ({items.length} Bahan)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Resep Belum Ada</span>
                  </>
                )}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight truncate">{product.name}</h2>
          </div>
        </div>

        {/* Pricing & Cost Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-right shadow-xs">
            <p className="text-[10px] uppercase font-bold text-gray-400">Harga Jual</p>
            <p className="text-sm font-bold text-gray-900">{formatRupiah(sellingPrice)}</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200 text-right shadow-xs">
            <p className="text-[10px] uppercase font-bold text-amber-600">Total HPP (BOM)</p>
            <p className="text-sm font-bold text-amber-800">{formatRupiah(totalCost)}</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-right shadow-xs">
            <p className="text-[10px] uppercase font-bold text-emerald-600">Laba Kotor ({marginPercentage}%)</p>
            <p className="text-sm font-bold text-emerald-800">{formatRupiah(grossProfit)}</p>
          </div>
        </div>
      </div>

      {/* Recipe Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Memuat rincian formula bahan baku...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 px-6 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-200">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Belum Ada Formula Resep</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Menu <span className="font-semibold text-gray-700">{product.name}</span> belum memiliki bahan baku yang terhubung. Masukkan bahan untuk mengaktifkan pemotongan stok otomatis dan kalkulasi HPP.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Bahan Pertama</span>
            </button>
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              Bulk Susun Resep
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Bahan Baku (Raw Material)</th>
                <th className="py-3 px-4 text-center">Takaran per Porsi</th>
                <th className="py-3 px-4 text-right">Biaya Satuan</th>
                <th className="py-3 px-4 text-right">Subtotal HPP</th>
                <th className="py-3 px-4 text-center">Stok Gudang</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {items.map((item, idx) => {
                const isStockLow = item.stock !== undefined && item.stock < item.quantityRequired;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{item.rawMaterialName}</div>
                      <div className="text-[10px] text-gray-400">ID Bahan: #{item.rawMaterialId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200/80">
                        {item.quantityRequired} {item.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-500">
                      {formatRupiah(item.costPerUnit)} <span className="text-[10px]">/{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                      {formatRupiah(item.itemCost)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isStockLow
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isStockLow && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                        {item.stock !== undefined ? `${item.stock} ${item.unit}` : '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(item)}
                          title="Ubah Takaran"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDeleteModal(item)}
                          title="Hapus dari Resep"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-orange-50/50 font-bold border-t border-orange-100 text-xs">
                <td colSpan={4} className="py-3 px-4 text-right text-gray-700 uppercase tracking-wider text-[11px]">
                  Total Biaya Bahan Baku (HPP per Menu):
                </td>
                <td className="py-3 px-4 text-right text-sm text-amber-900 font-extrabold">
                  {formatRupiah(totalCost)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-center text-[11px] text-gray-500 font-normal">
                  Margin: {marginPercentage}% ({formatRupiah(grossProfit)})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailCard;
