import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/roles';

export function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, defaultRoute } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
        <p className="text-sm text-slate-400">Memuat Sistem...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={defaultRoute || ROUTES.CASHIER} replace />;
  }

  return children;
}

export default GuestRoute;
