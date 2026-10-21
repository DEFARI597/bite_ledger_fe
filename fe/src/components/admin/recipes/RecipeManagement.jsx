import { useState, useEffect, useCallback, useMemo } from 'react';
import AlertBanner from '../../common/AlertBanner';
import RecipeHeader from './components/RecipeHeader';
import RecipeStats from './components/RecipeStats';
import RecipeDetailCard from './components/RecipeDetailCard';
import AddRecipeItemModal from './modals/AddRecipeItemModal';
import EditRecipeItemModal from './modals/EditRecipeItemModal';
import DeleteRecipeItemModal from './modals/DeleteRecipeItemModal';
import BulkRecipeModal from './modals/BulkRecipeModal';
import recipeService from '../../../services/recipeService';
import productService from '../../../services/productService';
import { Search, ChevronRight, CheckCircle2, AlertTriangle, Layers, ChefHat } from 'lucide-react';
import ProductImageThumbnail from '../../common/ProductImageThumbnail';

export function RecipeManagement() {

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Fetch product catalog
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProducts({ limit: 100 });
      const list = res.data?.products || [];
      setProducts(list);

      // Auto-select first product if none selected
      setSelectedProductId((prev) => {
        if (prev && list.some((p) => String(p.id) === String(prev))) {
          return prev;
        }
        return list.length > 0 ? list[0].id : null;
      });
    } catch (err) {
      console.error('Failed to fetch products:', err);
      showAlert('Gagal memuat katalog menu & produk.', 'error');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch recipe of selected product
  const fetchRecipe = useCallback(async (productId) => {
    if (!productId) {
      setCurrentRecipe(null);
      return;
    }
    setLoadingRecipe(true);
    try {
      const res = await recipeService.getRecipeByProductId(productId);
      setCurrentRecipe(res.data);
    } catch (err) {
      console.error(`Failed to fetch recipe for product ${productId}:`, err);
      setCurrentRecipe(null);
    } finally {
      setLoadingRecipe(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchRecipe(selectedProductId);
    }
  }, [selectedProductId, fetchRecipe]);

  // Derived selected product object
  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(selectedProductId)) || null;
  }, [products, selectedProductId]);

  // Categories list for filter pills
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Modal Handlers
  const handleAddRecipeItem = async (data) => {
    await recipeService.addRecipeItem(data);
    showAlert('Bahan baku berhasil ditambahkan ke dalam formula resep.');
    await fetchRecipe(selectedProductId);
  };

  const handleUpdateRecipeItem = async (id, data) => {
    await recipeService.updateRecipeItem(id, data);
    showAlert('Takaran bahan baku berhasil diperbarui.');
    await fetchRecipe(selectedProductId);
  };

  const handleDeleteRecipeItem = async (id) => {
    await recipeService.deleteRecipeItem(id);
    showAlert('Bahan baku berhasil dihapus dari resep.');
    await fetchRecipe(selectedProductId);
  };

  const handleBulkSyncRecipe = async (productId, items) => {
    await recipeService.syncProductRecipe(productId, items);
    showAlert('Seluruh formula resep menu berhasil disimpan dan disinkronkan.');
    await fetchRecipe(productId);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <RecipeHeader
        selectedProduct={selectedProduct}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onRefresh={() => {
          fetchProducts();
          if (selectedProductId) fetchRecipe(selectedProductId);
        }}
        loading={loadingProducts || loadingRecipe}
      />

      {/* 2. Alert Banner */}
      <AlertBanner alert={alert} onClose={() => setAlert(null)} />

      {/* 3. Metric Stats */}
      <RecipeStats totalProducts={products.length} currentRecipe={currentRecipe} />

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-gray-900 text-sm">Pilih Menu Produk</h3>
            <span className="text-[11px] font-semibold text-gray-400">
              {filteredProducts.length} dari {products.length}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          {/* Product Items */}
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {loadingProducts ? (
              <div className="py-12 text-center text-xs text-gray-400">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Memuat menu...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-10 px-3 text-center text-xs text-gray-400 leading-relaxed">
                {products.length === 0
                  ? 'Belum ada menu produk terdaftar.'
                  : 'Tidak ada menu yang sesuai kriteria pencarian.'}
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = String(p.id) === String(selectedProductId);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-500'
                        : 'border-gray-200/80 hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                  >
                    <ProductImageThumbnail imagePath={p.imageUrl} alt={p.name} size="md" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase">
                          {p.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{p.name}</h4>
                      <p className="text-[11px] font-bold text-orange-700 mt-1">
                        {formatRupiah(p.sellingPrice)}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-orange-600 translate-x-0.5' : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recipe Detail & BOM Table (8 cols) */}
        <div className="lg:col-span-8">
          {selectedProduct ? (
            <RecipeDetailCard
              product={selectedProduct}
              recipe={currentRecipe}
              loading={loadingRecipe}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenEditModal={(item) => {
                setSelectedItemToEdit(item);
                setIsEditModalOpen(true);
              }}
              onOpenDeleteModal={(item) => {
                setSelectedItemToDelete(item);
                setIsDeleteModalOpen(true);
              }}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3 border border-orange-200 shadow-xs">
                <ChefHat className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                {products.length === 0 ? 'Belum Ada Menu Produk' : 'Pilih Menu untuk Melihat Resep'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {products.length === 0
                  ? 'Katalog produk menu masih kosong. Silakan daftarkan menu terlebih dahulu pada modul Katalog Produk & Menu.'
                  : 'Silakan pilih salah satu menu pada daftar di sebelah kiri untuk melihat rincian formula bahan baku serta kalkulasi HPP.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddRecipeItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        product={selectedProduct}
        products={products}
        existingItems={currentRecipe?.items || []}
        onSubmit={handleAddRecipeItem}
      />

      <EditRecipeItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItemToEdit(null);
        }}
        item={selectedItemToEdit}
        product={selectedProduct}
        onSubmit={handleUpdateRecipeItem}
      />

      <DeleteRecipeItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItemToDelete(null);
        }}
        item={selectedItemToDelete}
        product={selectedProduct}
        onConfirm={handleDeleteRecipeItem}
      />

      <BulkRecipeModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        product={selectedProduct}
        currentItems={currentRecipe?.items || []}
        onSubmit={handleBulkSyncRecipe}
      />
    </div>
  );
}

export default RecipeManagement;
