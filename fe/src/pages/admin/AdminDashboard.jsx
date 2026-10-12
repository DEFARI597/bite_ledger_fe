import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import Sidebar from '../../components/common/Sidebar';
import { Shield, Layers } from 'lucide-react';



export function AdminDashboard() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = React.useState('overview');

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

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
            <div className="flex items-center gap-3">
            </div>
            <p className="text-xs text-orange-100 mt-0.5">
              Selamat datang,{' '}
              <strong className="text-white">{user?.name}</strong> — Sistem Manajemen Bite Ledger
            </p>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </header>
      </div>
    </div>
  );
}

export default AdminDashboard;
