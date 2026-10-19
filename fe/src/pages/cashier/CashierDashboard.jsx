import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CashierHeader from '../../components/headers/CashierHeader';
import { AlertTriangle } from 'lucide-react';

export function CashierDashboard() {
  const { user, role } = useAuth();
  const location = useLocation();
  const redirectAlert = location.state?.alert;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header tailored for Cashier / POS role */}
      <CashierHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Guard Redirect Alert */}
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
  );
}

export default CashierDashboard;
