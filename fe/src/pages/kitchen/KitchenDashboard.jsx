import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import { AlertTriangle } from 'lucide-react';

export function KitchenDashboard() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = useState('queue');
  const location = useLocation();
  const redirectAlert = location.state?.alert;

  return (
    <div className="min-h-screen flex" style={{ background: '#ffffff' }}>
      <Sidebar variant="kitchen" currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header
          style={{
            background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 50%, #fb923c 100%)',
          }}
          className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md"
        >
          <div>
            <p className="text-xs text-orange-100 mt-0.5">
              Selamat datang,{' '}
              <strong className="text-white">{user?.name}</strong> — Layar Produksi Dapur Bite Ledger
            </p>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
          {redirectAlert && (
            <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-800 mb-0.5">Pemberitahuan Hak Akses:</div>
                <p>{redirectAlert.message}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default KitchenDashboard;
