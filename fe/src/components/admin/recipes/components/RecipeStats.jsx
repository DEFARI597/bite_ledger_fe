import { Package, Utensils, Coins, TrendingUp } from 'lucide-react';

export function RecipeStats({ totalProducts = 0, currentRecipe = null }) {
  const sellingPrice = currentRecipe?.sellingPrice || 0;
  const totalCost = currentRecipe?.totalRecipeCost || 0;
  const grossProfit = Math.max(0, sellingPrice - totalCost);
  const marginPercentage = sellingPrice > 0 ? ((grossProfit / sellingPrice) * 100).toFixed(1) : 0;
  const itemsCount = currentRecipe?.items?.length || 0;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Menu Terdaftar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
          <Package className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Katalog Menu</p>
          <h3 className="text-lg font-bold text-gray-900 mt-0.5 truncate">{totalProducts} Menu</h3>
        </div>
      </div>

      {/* 2. Komposisi Bahan Resep Terpilih */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <Utensils className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Komposisi Bahan</p>
          <h3 className="text-lg font-bold text-gray-900 mt-0.5 truncate">
            {currentRecipe ? `${itemsCount} Bahan Baku` : '-'}
          </h3>
        </div>
      </div>

      {/* 3. Estimasi HPP / COGS */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <Coins className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Estimasi HPP (COGS)</p>
          <h3 className="text-lg font-bold text-amber-700 mt-0.5 truncate">
            {currentRecipe ? formatRupiah(totalCost) : '-'}
          </h3>
        </div>
      </div>

      {/* 4. Margin Laba Kotor */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Estimasi Margin Laba</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <h3 className="text-lg font-bold text-emerald-700 truncate">
              {currentRecipe ? formatRupiah(grossProfit) : '-'}
            </h3>
            {currentRecipe && sellingPrice > 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                {marginPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeStats;
