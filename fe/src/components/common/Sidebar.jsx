import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  FileBarChart,
  Users,
  CookingPot,
  Flame,
  Clock,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, PERMISSIONS } from '../../constants/roles';

export function Sidebar({ currentTab = 'overview', onTabChange, variant, isCollapsed = false }) {
  const { role, hasPerm } = useAuth();
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isKitchenMode = variant === 'kitchen' || (!variant && role === ROLES.KITCHEN);

  // Kitchen Navigation Items: Guarded specifically for kitchen operations
  const kitchenNavItems = [
    {
      id: 'queue',
      label: 'Antrean Pesanan Masak',
      icon: CookingPot,
      allowed: true, // Primary kitchen view
    },
    {
      id: 'production',
      label: 'Status Proses Memasak',
      icon: Flame,
      allowed: hasPerm(PERMISSIONS.PRODUCTION_MANAGE) || isKitchenMode,
    },
    {
      id: 'inventory',
      label: 'Bahan Baku & Dapur',
      icon: Boxes,
      allowed: hasPerm(PERMISSIONS.INVENTORY_VIEW) || isKitchenMode,
    },
    {
      id: 'history',
      label: 'Riwayat Selesai',
      icon: Clock,
      allowed: true,
    },
  ];

  // CMS Navigation Items: Dedicated for Admin & Super Admin Backoffice
  const cmsNavItems = [
    {
      id: 'overview',
      label: 'Ringkasan & Info Akses',
      icon: LayoutDashboard,
      allowed: true, // both admin and super_admin
    },
    {
      id: 'products',
      label: 'Katalog Produk & Menu',
      icon: Package,
      allowed: hasPerm(PERMISSIONS.PRODUCTS_VIEW),
    },
    {
      id: 'recipes',
      label: 'Resep Menu & BOM',
      icon: ChefHat,
      allowed: role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN,
    },
    {
      id: 'inventory',
      label: 'Inventori Bahan Baku',
      icon: Boxes,
      allowed: hasPerm(PERMISSIONS.INVENTORY_VIEW),
    },
    {
      id: 'vendors',
      label: 'Vendor & Pemasok',
      icon: Truck,
      allowed: hasPerm(PERMISSIONS.INVENTORY_VIEW),
    },
    {
      id: 'reports',
      label: 'Laporan Keuangan',
      icon: FileBarChart,
      allowed: hasPerm(PERMISSIONS.REPORTS_VIEW),
    },
    // Super Admin EXCLUSIVE item: completely hidden from Admin!
    {
      id: 'users',
      label: 'Kelola Tim & Staf',
      icon: Users,
      badge: 'Super Admin',
      allowed: isSuperAdmin && hasPerm(PERMISSIONS.USERS_MANAGE),
    },
  ];

  // Guard: Determine active items according to mode
  const navItems = isKitchenMode ? kitchenNavItems : cmsNavItems;

  return (
    <aside
      className={`flex flex-col shrink-0 min-h-[calc(100vh-64px)] transition-all duration-200 select-none bg-white border-r border-gray-200/80 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Menu */}
      <div className={isCollapsed ? 'p-2 pt-3' : 'p-3 pt-3'}>
        {!isCollapsed && (
          <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 text-gray-400">
            {isKitchenMode ? 'Operasional Dapur' : 'Menu Operasional'}
          </div>
        )}
        <nav className="space-y-1">
          {navItems
            .filter((item) => item.allowed)
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange && onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                  }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #ea6c00, #f97316)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#6b7280',
                    boxShadow: isActive ? '0 2px 8px rgba(234, 108, 0, 0.25)' : 'none',
                    fontWeight: isActive ? '600' : '500',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#fff7ed';
                      e.currentTarget.style.color = '#ea580c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? '#ffffff' : '#9ca3af' }}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
