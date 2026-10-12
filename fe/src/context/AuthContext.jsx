import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { ROLES } from '../constants/roles';
import { getDefaultRouteByRole, hasPermission as checkPermission, isRoleAllowed } from '../utils/rbac';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify session on load
  const verifySession = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response?.data) {
        // Enforce restriction for kitchen role on session recovery
        if (response.data.role === ROLES.KITCHEN) {
          authService.logout();
          setUser(null);
          setToken(null);
          setAuthError('Akun Kitchen tidak memiliki akses ke sistem CMS/POS.');
        } else {
          setUser(response.data);
          setToken(authService.getToken());
          setAuthError(null);
        }
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err.message);
      authService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  /**
   * Login handler with role restriction logic
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await authService.login(email, password);
      const userData = result?.data?.user;

      if (!userData) {
        throw new Error('Format data login dari server tidak valid');
      }

      // Explicitly reject kitchen role from CMS
      if (userData.role === ROLES.KITCHEN) {
        authService.logout();
        setUser(null);
        setToken(null);
        const forbiddenMsg = 'Akses Ditolak: Pengguna dapur (Kitchen) tidak memiliki hak akses ke CMS/POS.';
        setAuthError(forbiddenMsg);
        setIsLoading(false);
        return { success: false, error: forbiddenMsg };
      }

      setUser(userData);
      setToken(result.data.access_token);
      setIsLoading(false);
      return {
        success: true,
        user: userData,
        defaultRoute: getDefaultRouteByRole(userData.role),
      };
    } catch (err) {
      setIsLoading(false);
      const message = err.message || 'Login gagal, periksa email dan kata sandi Anda';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  const hasPerm = (permissionName) => {
    return checkPermission(user?.permissions, permissionName);
  };

  const isRole = (...roles) => {
    return isRoleAllowed(user?.role, roles);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    permissions: user?.permissions || [],
    isAuthenticated: !!token && !!user,
    isLoading,
    authError,
    setAuthError,
    login,
    logout,
    verifySession,
    hasPerm,
    isRole,
    defaultRoute: getDefaultRouteByRole(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook for consuming auth state anywhere
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
