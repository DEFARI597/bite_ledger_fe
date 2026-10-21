import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import KitchenHeader from '../../components/headers/KitchenHeader';
import { AlertTriangle, CookingPot } from 'lucide-react';

export function KitchenDashboard() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = useState('queue');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const redirectAlert = location.state?.alert;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header tailored for Kitchen role */}
      <KitchenHeader
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex min-w-0">
        <Sidebar
          variant="kitchen"
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/50">
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {redirectAlert && (
              <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800 mb-0.5">Pemberitahuan Hak Akses:</div>
                  <p>{redirectAlert.message}</p>
                </div>
              </div>
            )}

            <div className="p-12 text-center max-w-md mx-auto py-24">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-200 shadow-xs">
                <CookingPot className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Modul Operasional Dapur ({currentTab})
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Antarmuka untuk modul operasional dapur sedang dalam tahap perancangan dan persiapan.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default KitchenDashboard;
