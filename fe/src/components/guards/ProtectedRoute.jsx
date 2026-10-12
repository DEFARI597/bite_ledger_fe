import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants/roles';

export function ProtectedRoute({ allowedRoles, children }) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-400">Memverifikasi Otoritas Sesi...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (role === ROLES.KITCHEN) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === ROLES.CASHIER) {
      return (
        <Navigate
          to={ROUTES.CASHIER}
          state={{
            alert: {
              type: 'error',
              message: 'Akses Ditolak: Peran Kasir tidak memiliki wewenang untuk membuka Backoffice Admin.',
            },
          }}
          replace
        />
      );
    }

    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}

export default ProtectedRoute;
