import { Package, Plus, RefreshCw } from 'lucide-react';

export function ProductHeader({
  onOpenCreateProduct,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs border border-orange-200">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Katalog Produk & Menu Restoran
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola menu makanan, minuman, harga jual kasir POS, kategori dinamis, dan status ketersediaan.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          title="Segarkan Data"
          className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-600' : ''}`} />
        </button>

        <button
          type="button"
          onClick={onOpenCreateProduct}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-orange-200 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Produk</span>
        </button>
      </div>
    </div>
  );
}

export default ProductHeader;
