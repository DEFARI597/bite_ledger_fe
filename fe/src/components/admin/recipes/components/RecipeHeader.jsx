import { ChefHat, Plus, Layers, RefreshCw } from 'lucide-react';

export function RecipeHeader({
  selectedProduct,
  onOpenAddModal,
  onOpenBulkModal,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs border border-orange-200">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Formula Resep & Bill of Materials
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Hubungkan menu dengan bahan baku spesifik, takaran presisi, dan pantau kalkulasi HPP otomatis.
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

        {selectedProduct && (
          <>
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Bulk Racik Resep</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-orange-600" />
              <span>Tambah Bahan</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeHeader;
