import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants/roles';
import Sidebar from '../../components/common/Sidebar';
import AdminHeader from '../../components/headers/AdminHeader';
import AdminOverview from '../../components/admin/overview/AdminOverview';
import UserManagement from '../../components/admin/users/UserManagement';
import InventoryManagement from '../../components/admin/inventory/InventoryManagement';
import VendorManagement from '../../components/admin/vendors/VendorManagement';
import RecipeManagement from '../../components/admin/recipes/RecipeManagement';
import ProductManagement from '../../components/admin/products/ProductManagement';
import { Package } from 'lucide-react';

export function AdminDashboard({ initialTab = 'overview' }) {
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isVendorsRoute =
    location.pathname === ROUTES.ADMIN_VENDORS || location.pathname === '/admin/vendors';
  const isCreateInventoryRoute =
    location.pathname === ROUTES.ADMIN_INVENTORY_CREATE || location.pathname === '/admin/inventory/create';
  const isProductsRoute =
    location.pathname === ROUTES.ADMIN_PRODUCTS || location.pathname === '/admin/products';
  const isCreateProductRoute =
    location.pathname === ROUTES.ADMIN_PRODUCTS_CREATE || location.pathname === '/admin/products/create';

  const [tabState, setTabState] = useState(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isAdminOrSuperAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

  // Derive currentTab reactively without triggering cascading renders in useEffect
  const currentTab = isVendorsRoute
    ? 'vendors'
    : isCreateInventoryRoute
      ? 'inventory'
      : isProductsRoute || isCreateProductRoute
        ? 'products'
        : tabState === 'users' && !isSuperAdmin
          ? 'overview'
          : tabState === 'recipes' && !isAdminOrSuperAdmin
            ? 'overview'
            : tabState;

  const handleTabChange = (tabId) => {
    const isSpecialSubRoute =
      isCreateInventoryRoute || isVendorsRoute || isProductsRoute || isCreateProductRoute;

    if (
      isSpecialSubRoute &&
      tabId !== (isVendorsRoute ? 'vendors' : isCreateInventoryRoute ? 'inventory' : 'products')
    ) {
      navigate(ROUTES.ADMIN);
    } else if (tabId === 'vendors' && location.pathname !== ROUTES.ADMIN_VENDORS) {
      navigate(ROUTES.ADMIN_VENDORS);
    } else if (tabId === 'products' && location.pathname !== ROUTES.ADMIN_PRODUCTS && !isCreateProductRoute) {
      navigate(ROUTES.ADMIN_PRODUCTS);
    }
    setTabState(tabId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header matching reference image: Actions, Logo, Search, and Profile Photo on right */}
      <AdminHeader
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onCollapseSidebar={() => setIsSidebarCollapsed(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        onNavigate={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex min-w-0">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50 min-h-[calc(100vh-64px)] overflow-y-auto">
          {currentTab === 'overview' && (
            <AdminOverview onNavigate={handleTabChange} />
          )}

          {currentTab === 'products' && (
            <ProductManagement isCreateRoute={isCreateProductRoute} />
          )}

          {currentTab === 'recipes' && isAdminOrSuperAdmin && (
            <RecipeManagement />
          )}

          {currentTab === 'inventory' && (
            <InventoryManagement />
          )}

          {currentTab === 'vendors' && (
            <VendorManagement />
          )}

          {currentTab === 'users' && isSuperAdmin && (
            <UserManagement />
          )}

          {currentTab !== 'overview' &&
            currentTab !== 'products' &&
            currentTab !== 'recipes' &&
            currentTab !== 'users' &&
            currentTab !== 'inventory' &&
            currentTab !== 'vendors' && (
              <div className="p-8 max-w-xl mx-auto text-center py-24">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-200">
                  <Package className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Modul Laporan Keuangan
                </h2>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Antarmuka modul ini sedang dalam proses pengembangan dan akan segera siap digunakan.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange('overview')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-all cursor-pointer"
                >
                  Kembali ke Ringkasan
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
