import { Package, CheckCircle2, Tag, ChefHat } from 'lucide-react';

export function ProductStats({
  totalProducts = 0,
  activeProductsCount = 0,
  totalCategories = 0,
  configuredRecipesCount = 0,
}) {
  const inactiveCount = Math.max(0, totalProducts - activeProductsCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Menu */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Total Menu Produk
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">{totalProducts}</span>
            <span className="text-xs font-semibold text-gray-400">varian</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
          <Package className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Menu Aktif */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Menu Aktif (Kasir POS)
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{activeProductsCount}</span>
            <span className="text-xs font-medium text-gray-400">
              {inactiveCount > 0 ? `(${inactiveCount} nonaktif)` : 'semua aktif'}
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Total Kategori */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Kategori Terdaftar
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">{totalCategories}</span>
            <span className="text-xs font-semibold text-gray-400">kategori</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Resep BOM Terhubung */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Resep BOM Terhubung
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">{configuredRecipesCount}</span>
            <span className="text-xs font-semibold text-gray-400">
              dari {totalProducts} menu
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
          <ChefHat className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default ProductStats;
