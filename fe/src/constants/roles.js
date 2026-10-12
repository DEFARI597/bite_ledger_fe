export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  KITCHEN: 'kitchen',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.ADMIN]: 'Store Manager',
  [ROLES.CASHIER]: 'POS Cashier',
  [ROLES.KITCHEN]: 'Kitchen Staff',
};

export const PERMISSIONS = {
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',

  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_MANAGE: 'inventory.manage',

  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_MANAGE: 'products.manage',

  PRODUCTION_VIEW: 'production.view',
  PRODUCTION_MANAGE: 'production.manage',

  ORDERS_VIEW: 'orders.view',
  ORDERS_CREATE: 'orders.create',
  ORDERS_CANCEL: 'orders.cancel',

  REPORTS_VIEW: 'reports.view',
};

export const ROUTES = {
  LOGIN: '/login',
  CASHIER: '/',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized',
};
