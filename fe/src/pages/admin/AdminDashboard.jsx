import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import Sidebar from '../../components/common/Sidebar';
import AdminOverview from '../../components/admin/overview/AdminOverview';
import UserManagement from '../../components/admin/users/UserManagement';
import { Package, ShieldAlert } from 'lucide-react';

export function AdminDashboard() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = React.useState('overview');

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (currentTab === 'users' && !isSuperAdmin) {
      setCurrentTab('overview');
    }
  }, [currentTab, isSuperAdmin]);

  return (
    <div className="min-h-screen flex" style={{ background: '#ffffff' }}>
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

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
            <AdminOverview onNavigate={setCurrentTab} />
          )}

          {currentTab === 'users' && isSuperAdmin && (
            <UserManagement />
          )}

          {currentTab !== 'overview' && currentTab !== 'users' && (
            <div className="p-8 max-w-xl mx-auto text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-200">
                <Package className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Modul {currentTab === 'products' ? 'Katalog Produk & Menu' : currentTab === 'inventory' ? 'Inventori Bahan Baku' : 'Laporan Keuangan'}
              </h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Antarmuka modul ini sedang dalam proses pengembangan dan akan segera siap digunakan.
              </p>
              <button
                type="button"
                onClick={() => setCurrentTab('overview')}
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
