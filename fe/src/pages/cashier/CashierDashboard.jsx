import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePosCart } from '../../context/PosCartContext';
import CashierHeader from '../../components/headers/CashierHeader';
import PosProductCard from '../../components/cashier/PosProductCard';
import PosCategoryFilter from '../../components/cashier/PosCategoryFilter';
import PosBottomCartBar from '../../components/cashier/PosBottomCartBar';
import productService from '../../services/productService';
import { AlertTriangle, Search, RefreshCw, UtensilsCrossed, X } from 'lucide-react';

export function CashierDashboard() {
  const { user, role } = useAuth();
  const { addToCart, updateQuantity, getItemQuantity, totalQuantity } = usePosCart();
  const location = useLocation();
  const redirectAlert = location.state?.alert;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts({ limit: 150 });
      const list = res.data?.products || [];
      setProducts(list);
    } catch (err) {
      console.error('Failed to fetch POS products:', err);
      setError('Gagal memuat katalog produk. Periksa koneksi backend Anda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const { categories, categoryCounts } = useMemo(() => {
    const counts = {};
    const catSet = new Set();

    products.forEach((p) => {
      const cat = p.category ? p.category.trim() : 'Lainnya';
      catSet.add(cat);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return {
      categories: Array.from(catSet).sort(),
      categoryCounts: counts,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL') {
        const pCat = (p.category || '').toLowerCase();
        if (pCat !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleSelectProduct = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const handleDecrementProduct = useCallback(
    (product) => {
      updateQuantity(product.id, -1);
    },
    [updateQuantity]
  );

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 relative">
      {/* Top Header tailored for Cashier / POS role */}
      <CashierHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all duration-200 ${totalQuantity > 0 ? 'pb-32' : 'pb-12'
          }`}
      >
        {/* Guard Redirect Alert if any */}
        {redirectAlert && (
          <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-800 mb-0.5">Pemberitahuan Hak Akses:</div>
              <p>{redirectAlert.message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchProducts}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
          <PosCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            totalCount={products.length}
          />

          {searchQuery && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs text-gray-500">
                Pencarian:{' '}
                <strong className="text-orange-600">"{searchQuery}"</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/70 p-4 space-y-3 animate-pulse shadow-2xs"
              >
                <div className="w-full aspect-square bg-gray-100 rounded-xl" />
                <div className="h-5 bg-gray-100 rounded-md w-3/4" />
                <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="h-5 bg-gray-100 rounded-md w-1/3" />
                  <div className="w-9 h-9 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 px-4 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4 border border-orange-200/80 shadow-xs">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Tidak Ada Menu Ditemukan
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Tidak ada produk yang cocok dengan kriteria pencarian atau kategori yang dipilih.'
                : 'Belum ada menu produk terdaftar dalam sistem.'}
            </p>
            {(searchQuery || selectedCategory !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <PosProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                onDecrement={handleDecrementProduct}
                cartQuantity={getItemQuantity(product.id)}
              />
            ))}
          </div>
        )}
      </main>

      <PosBottomCartBar />
    </div>
  );
}

export default CashierDashboard;
