import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import productService from '../../../services/productService';
import { ROUTES } from '../../../constants/roles';
import ProductHeader from './components/ProductHeader';
import ProductStats from './components/ProductStats';
import ProductFilterBar from './components/ProductFilterBar';
import ProductTable from './components/ProductTable';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import DeleteProductModal from './modals/DeleteProductModal';

export function ProductManagement({ isCreateRoute = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState(isCreateRoute ? 'create' : 'list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Data & State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Persistent category cache
  const [knownCategories, setKnownCategories] = useState([]);

  // Stats
  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    activeProductsCount: 0,
    totalCategories: 0,
    configuredRecipesCount: 0,
  });

  const timerRef = useRef(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Sync with URL route changes
  useEffect(() => {
    if (isCreateRoute || location.pathname === ROUTES.ADMIN_PRODUCTS_CREATE || location.pathname === '/admin/products/create') {
      setViewMode('create');
    } else if (viewMode === 'create' && (location.pathname === ROUTES.ADMIN_PRODUCTS || location.pathname === '/admin/products')) {
      setViewMode('list');
    }
  }, [isCreateRoute, location.pathname, viewMode]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch product list
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const activeParam =
        statusFilter === 'ACTIVE'
          ? 'true'
          : statusFilter === 'INACTIVE'
            ? 'false'
            : '';

      const categoryParam = selectedCategory !== 'ALL' ? selectedCategory : '';

      const res = await productService.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        category: categoryParam,
        isActive: activeParam,
      });

      const list = res?.data?.products || [];
      const pag = res?.data?.pagination || {
        page: pagination.page,
        limit: pagination.limit,
        total: list.length,
        totalPages: 1,
      };

      setProducts(list);
      setPagination((prev) => ({
        ...prev,
        page: Number(pag.currentPage || pag.page || prev.page),
        total: Number(pag.total ?? list.length),
        totalPages: Math.max(1, Number(pag.totalPages || 1)),
      }));

      // Update known categories
      setKnownCategories((prev) => {
        const set = new Set(prev);
        list.forEach((p) => {
          if (p.category && p.category.trim()) {
            set.add(p.category.trim());
          }
        });
        return Array.from(set);
      });
    } catch (err) {
      console.error('Failed to fetch products:', err);
      showAlert(err.message || 'Gagal memuat katalog produk.', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedCategory, statusFilter]);

  // Fetch full list for stats calculations
  const fetchAllStats = useCallback(async () => {
    try {
      const res = await productService.getProducts({ limit: 1000 });
      const all = res?.data?.products || [];
      const activeCount = all.filter((p) => p.isActive).length;
      const categoriesSet = new Set(all.map((p) => p.category).filter(Boolean));
      const withRecipeCount = all.filter(
        (p) => p.recipe?.items && p.recipe.items.length > 0
      ).length;

      setStatsData({
        totalProducts: all.length,
        activeProductsCount: activeCount,
        totalCategories: categoriesSet.size,
        configuredRecipesCount: withRecipeCount,
      });

      // Populate unique categories directly from fetched database records
      setKnownCategories((prev) => {
        const merged = new Set([...prev, ...categoriesSet]);
        return Array.from(merged);
      });
    } catch (err) {
      console.error('Failed to calculate product stats:', err);
    }
  }, []);

  // Fetch on filter or page changes
  useEffect(() => {
    if (viewMode === 'list') {
      fetchProducts();
    }
  }, [fetchProducts, viewMode]);

  // Initial stats fetch
  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  // Handlers for Views
  const handleOpenCreate = () => {
    navigate(ROUTES.ADMIN_PRODUCTS_CREATE);
    setViewMode('create');
  };

  const handleBackToList = () => {
    if (location.pathname === ROUTES.ADMIN_PRODUCTS_CREATE || location.pathname === '/admin/products/create') {
      navigate(ROUTES.ADMIN_PRODUCTS);
    }
    setViewMode('list');
    setEditingProduct(null);
  };

  const handleCreateSuccess = (message) => {
    showAlert(message || 'Menu produk baru berhasil ditambahkan!');
    handleBackToList();
    fetchProducts();
    fetchAllStats();
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setViewMode('edit');
  };

  const handleEditSuccess = (message) => {
    showAlert(message || 'Perubahan menu produk berhasil disimpan!');
    handleBackToList();
    fetchProducts();
    fetchAllStats();
  };

  const handleDeleteSuccess = (message) => {
    showAlert(message || 'Menu produk berhasil dihapus!');
    setDeletingProduct(null);
    fetchProducts();
    fetchAllStats();
  };

  const handleToggleStatus = async (product) => {
    const newStatus = !product.isActive;
    try {
      await productService.updateProduct(product.id, { isActive: newStatus });
      showAlert(
        `Status ${product.name} diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}.`
      );
      // Update local state optimistically
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: newStatus } : p))
      );
      fetchAllStats();
    } catch (err) {
      showAlert(err.message || 'Gagal mengubah status produk.', 'error');
    }
  };

  // Render Sub-pages directly (NO MODALS for Create/Edit!)
  if (viewMode === 'create') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <CreateProductPage
          onBack={handleBackToList}
          onSuccess={handleCreateSuccess}
          existingCategories={knownCategories}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && editingProduct) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <EditProductPage
          product={editingProduct}
          onBack={handleBackToList}
          onSuccess={handleEditSuccess}
          existingCategories={knownCategories}
        />
      </div>
    );
  }

  // Default: List view
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
            alert.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlert(null)}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <ProductHeader
        onOpenCreateProduct={handleOpenCreate}
        onRefresh={() => {
          fetchProducts();
          fetchAllStats();
        }}
        loading={loading}
      />

      {/* Stats Cards */}
      <ProductStats
        totalProducts={statsData.totalProducts}
        activeProductsCount={statsData.activeProductsCount}
        totalCategories={statsData.totalCategories}
        configuredRecipesCount={statsData.configuredRecipesCount}
      />

      {/* Search & Filter Bar */}
      <ProductFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        categories={knownCategories}
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setStatusFilter(st);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        totalItems={pagination.total}
      />

      {/* Products Table */}
      <ProductTable
        products={products}
        loading={loading}
        onEditProduct={handleOpenEdit}
        onDeleteProduct={(prod) => setDeletingProduct(prod)}
        onToggleStatus={handleToggleStatus}
        pagination={pagination}
        onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
        onOpenCreateProduct={handleOpenCreate}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteProductModal
          isOpen={Boolean(deletingProduct)}
          onClose={() => setDeletingProduct(null)}
          onSuccess={handleDeleteSuccess}
          product={deletingProduct}
        />
      )}
    </div>
  );
}

export default ProductManagement;
