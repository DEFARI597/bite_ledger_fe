import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROLES, ROUTES } from './constants/roles';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import GuestRoute from './components/guards/GuestRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import CashierDashboard from './pages/cashier/CashierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import NotFoundPage from './pages/error/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public / Guest-only Route (Login Form) */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          {/* Operational POS Route: Accessible by Cashier, Admin, and Super Admin */}
          <Route
            path={ROUTES.CASHIER}
            element={
              <ProtectedRoute allowedRoles={[ROLES.CASHIER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Operational Kitchen / Production Route: Accessible by Kitchen, Admin, and Super Admin */}
          <Route
            path={ROUTES.KITCHEN}
            element={
              <ProtectedRoute allowedRoles={[ROLES.KITCHEN, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                <KitchenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Backoffice CMS Route: Strictly restricted to Admin and Super Admin */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Error and Fallback Routes */}
          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
