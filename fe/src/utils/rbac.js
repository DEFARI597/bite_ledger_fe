import { ROLES, ROUTES } from '../constants/roles';

/**
 * Determine default landing route after login based on role
 * - Cashier -> '/'
 * - Admin & Super Admin -> '/admin'
 * - Kitchen -> Denied (null)
 */
export function getDefaultRouteByRole(role) {
  if (role === ROLES.CASHIER) {
    return ROUTES.CASHIER;
  }
  if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
    return ROUTES.ADMIN;
  }
  return null;
}

/**
 * Check if a role is allowed to access a specific set of allowed roles
 */
export function isRoleAllowed(userRole, allowedRoles = []) {
  if (!userRole) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}

/**
 * Check if user permissions include a specific permission
 */
export function hasPermission(userPermissions = [], permission) {
  if (!Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permission);
}

/**
 * Check if user permissions include all given permissions
 */
export function hasAllPermissions(userPermissions = [], permissions = []) {
  if (!Array.isArray(userPermissions)) return false;
  return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Check if user permissions include at least one given permission
 */
export function hasAnyPermission(userPermissions = [], permissions = []) {
  if (!Array.isArray(userPermissions)) return false;
  return permissions.some((p) => userPermissions.includes(p));
}