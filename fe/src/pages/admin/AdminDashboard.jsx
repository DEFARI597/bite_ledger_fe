import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants/roles';
import Sidebar from '../../components/common/Sidebar';
import AdminOverview from '../../components/admin/overview/AdminOverview';
import UserManagement from '../../components/admin/users/UserManagement';
import InventoryManagement from '../../components/admin/inventory/InventoryManagement';
import VendorManagement from '../../components/admin/vendors/VendorManagement';
import { Package } from 'lucide-react';

export function AdminDashboard({ initialTab = 'overview' }) {
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isVendorsRoute =
    location.pathname === ROUTES.ADMIN_VENDORS || location.pathname === '/admin/vendors';
  const isCreateInventoryRoute =
    location.pathname === ROUTES.ADMIN_INVENTORY_CREATE || location.pathname === '/admin/inventory/create';

  const [tabState, setTabState] = useState(initialTab);
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  // Derive currentTab reactively without triggering cascading renders in useEffect
  const currentTab = isVendorsRoute
    ? 'vendors'
    : isCreateInventoryRoute
      ? 'inventory'
      : tabState === 'users' && !isSuperAdmin
        ? 'overview'
        : tabState;

  const handleTabChange = (tabId) => {
    if ((isCreateInventoryRoute || isVendorsRoute) && tabId !== (isVendorsRoute ? 'vendors' : 'inventory')) {
      navigate(ROUTES.ADMIN);
    } else if (tabId === 'vendors' && location.pathname !== ROUTES.ADMIN_VENDORS) {
      navigate(ROUTES.ADMIN_VENDORS);
    }
    setTabState(tabId);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#ffffff' }}>
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header
          style={{
            background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 50%, #fb923c 100%)',
          }}
          className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md"
        >
          <div>
            <p className="text-xs text-orange-100">
              Selamat datang,{' '}
              <strong className="text-white">{user?.name}</strong> — Sistem Manajemen Bite Ledger
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            {isSuperAdmin ? 'Super Admin' : 'Store Manager (Admin)'}
          </span>
        </header>

        <main className="flex-1 bg-gray-50/50 min-h-[calc(100vh-65px)]">
          {currentTab === 'overview' && (
            <AdminOverview onNavigate={handleTabChange} />
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

          {currentTab !== 'overview' && currentTab !== 'users' && currentTab !== 'inventory' && currentTab !== 'vendors' && (
            <div className="p-8 max-w-xl mx-auto text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-200">
                <Package className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Modul {currentTab === 'products' ? 'Katalog Produk & Menu' : 'Laporan Keuangan'}
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
