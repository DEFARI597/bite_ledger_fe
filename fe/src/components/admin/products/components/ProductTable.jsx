import {
  Edit2,
  Trash2,
  Package,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Tag,
  ImageIcon,
} from 'lucide-react';
import { getProductImageUrl } from '../../../../utils/image.util';

export function ProductTable({
  products = [],
  loading = false,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onOpenCreateProduct,
}) {
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Menu Produk</th>
              <th className="py-3.5 px-4">Kategori</th>
              <th className="py-3.5 px-4 text-right">Harga Jual POS</th>
              <th className="py-3.5 px-4 text-center">Formula Resep (BOM)</th>
              <th className="py-3.5 px-4 text-center">Status POS</th>
              <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center text-gray-400">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-medium text-xs">Memuat katalog menu produk...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 px-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3 border border-orange-200 shadow-xs">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Belum Ada Menu Produk
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4 leading-relaxed">
                    Katalog menu restoran Anda masih kosong. Tambahkan produk menu makanan atau minuman baru sekarang.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenCreateProduct}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-orange-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Menu Baru</span>
                  </button>
                </td>
              </tr>
            ) : (
              products.map((product, idx) => {
                const itemIndex = (pagination.page - 1) * pagination.limit + (idx + 1);
                const hasRecipe = product.recipe?.items && product.recipe.items.length > 0;
                const imageUrl = getProductImageUrl(product.imageUrl);

                return (
                  <tr key={product.id} className="hover:bg-orange-50/20 transition-colors group">
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">
                      {itemIndex}
                    </td>

                    {/* Product Image, Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Image Box */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-orange-50/80 border border-gray-200/90 shrink-0 flex items-center justify-center relative shadow-2xs group-hover:border-orange-300 transition-colors">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.classList.remove('hidden');
                                  e.currentTarget.nextElementSibling.classList.add('flex');
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full items-center justify-center ${
                              imageUrl ? 'hidden' : 'flex'
                            }`}
                          >
                            <Package className="w-5 h-5 text-orange-400" />
                          </div>
                        </div>

                        {/* Name & ID */}
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors truncate max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            ID: #{product.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span>{product.category}</span>
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">
                        {formatRupiah(product.sellingPrice)}
                      </span>
                    </td>

                    {/* Recipe BOM Status */}
                    <td className="py-3.5 px-4 text-center">
                      {hasRecipe ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resep Siap ({product.recipe.items.length} Bahan)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Belum Ada Resep</span>
                        </span>
                      )}
                    </td>

                    {/* Active Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(product)}
                        title="Klik untuk mengubah status aktif"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          product.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span>{product.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          title="Ubah Menu"
                          className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(product)}
                          title="Hapus Menu"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Halaman <strong className="text-gray-900">{pagination.page}</strong> dari{' '}
            <strong className="text-gray-900">{pagination.totalPages}</strong> (Total {pagination.total} menu)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
