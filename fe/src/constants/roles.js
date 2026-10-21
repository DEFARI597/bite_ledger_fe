export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  KITCHEN: 'kitchen',
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
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_CREATE: '/admin/products/create',
  ADMIN_INVENTORY_CREATE: '/admin/inventory/create',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_VENDORS_CREATE: '/admin/vendors/create',
  KITCHEN: '/kitchen',
  UNAUTHORIZED: '/unauthorized',
};
