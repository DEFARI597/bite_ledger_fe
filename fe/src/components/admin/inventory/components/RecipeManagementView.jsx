
import { BookOpen, Plus, RefreshCw, Trash2, Edit2, Package, Calculator, TrendingUp } from 'lucide-react';
import { formatCurrency, formatStock } from '../utils/inventoryFormatters';
import recipeService from '../../../../services/recipeService';

export function RecipeManagementView({
  products = [],
  selectedProductId,
  onSelectProduct,
  recipeData,
  loadingRecipe,
  onOpenAddIngredient,
  onOpenEditIngredient,
  onDeleteIngredient,
  onRefresh,
}) {
  const currentProduct = products.find((p) => p.id === selectedProductId) || (recipeData ? {
    id: recipeData.productId,
    name: recipeData.productName,
    sellingPrice: recipeData.sellingPrice,
  } : null);

  const sellingPrice = currentProduct ? Number(currentProduct.sellingPrice || 0) : 0;
  const totalCost = recipeData ? Number(recipeData.totalRecipeCost || 0) : 0;
  const profitMargin = sellingPrice - totalCost;
  const marginPercent = sellingPrice > 0 ? ((profitMargin / sellingPrice) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Product Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Pilih Menu:</span>
          <select
            value={selectedProductId || ''}
            onChange={(e) => onSelectProduct(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">-- Pilih Produk Menu Restoran --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatCurrency(p.sellingPrice)}) - {p.category}
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <button
            type="button"
            onClick={onOpenAddIngredient}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bahan ke Resep</span>
          </button>
        )}
      </div>

      {!selectedProductId ? (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-xs p-12 text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto text-orange-200 mb-3" />
          <h3 className="text-base font-bold text-gray-700">Pilih Menu untuk Melihat Resep & HPP</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
            Pilih salah satu produk menu restoran pada pilihan di atas untuk melihat takaran bahan baku, perhitungan modal (COGS), dan margin keuntungan per porsi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1">Harga Jual Menu</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(sellingPrice)}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Harga di kasir POS</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-orange-500" />
                <span>Total HPP / Bahan Baku</span>
              </div>
              <div className="text-xl font-bold text-orange-600">{formatCurrency(totalCost)}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Akumulasi modal bahan per porsi</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Estimasi Margin Laba</span>
              </div>
              <div className="text-xl font-bold text-emerald-600 flex items-baseline gap-2">
                <span>{formatCurrency(profitMargin)}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {marginPercent}%
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Gross margin per sajian</div>
            </div>
          </div>

          {/* Recipe Items Table */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/40">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">
                  Komposisi Takaran Resep: <span className="text-orange-600">{currentProduct?.name}</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Setiap kali pesanan menu ini dimasak di dapur, stok bahan berikut akan berkurang.
                </p>
              </div>

              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingRecipe}
                title="Muat ulang resep"
                className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingRecipe ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-50/60 border-b border-orange-100 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Bahan Baku Dapur</th>
                    <th className="px-6 py-3.5">Takaran / Porsi</th>
                    <th className="px-6 py-3.5">Harga Beli Satuan</th>
                    <th className="px-6 py-3.5">Biaya per Porsi</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {loadingRecipe ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                        <span>Memuat resep menu...</span>
                      </td>
                    </tr>
                  ) : !recipeData || recipeData.items?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                        <p className="font-medium text-gray-600">Belum ada bahan baku pada resep ini</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Klik tombol "Tambah Bahan ke Resep" untuk menambahkan komposisi takaran.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    recipeData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {item.rawMaterialName}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-800">
                            {formatStock(item.quantityRequired, item.unit)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {formatCurrency(item.costPerUnit)} / {item.unit}
                        </td>

                        <td className="px-6 py-4 font-bold text-orange-600">
                          {formatCurrency(item.itemCost)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenEditIngredient(item)}
                              title="Ubah Takaran"
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteIngredient(item)}
                              title="Hapus dari Resep"
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
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeManagementView;
