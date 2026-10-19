import { useAuth } from '../../../context/AuthContext';
import { ROLES, PERMISSIONS } from '../../../constants/roles';
import {
  Package,
  Boxes,
  Truck,
  FileBarChart,
  Users,
  ArrowRight,
} from 'lucide-react';

export function AdminOverview({ onNavigate }) {
  const { role, hasPerm } = useAuth();
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  const operationalModules = [
    {
      id: 'products',
      title: 'Katalog Produk & Menu',
      description: 'Kelola varian menu makanan, minuman, harga jual, dan status ketersediaan.',
      icon: Package,
      allowed: hasPerm(PERMISSIONS.PRODUCTS_VIEW),
      color: 'border-orange-200 bg-orange-50/50 text-orange-600',
    },
    {
      id: 'inventory',
      title: 'Inventori Bahan Baku',
      description: 'Pantau stok bahan mentah dapur, batas minimum stok, dan pencatatan restock.',
      icon: Boxes,
      allowed: hasPerm(PERMISSIONS.INVENTORY_VIEW),
      color: 'border-amber-200 bg-amber-50/50 text-amber-600',
    },
    {
      id: 'vendors',
      title: 'Vendor & Pemasok',
      description: 'Kelola data mitra pemasok bahan mentah, kontak person, telepon, dan alamat logistik.',
      icon: Truck,
      allowed: hasPerm(PERMISSIONS.INVENTORY_VIEW),
      color: 'border-blue-200 bg-blue-50/50 text-blue-600',
    },
    {
      id: 'reports',
      title: 'Laporan Keuangan',
      description: 'Rekapitulasi penjualan kasir POS harian, laba kotor, dan riwayat transaksi.',
      icon: FileBarChart,
      allowed: hasPerm(PERMISSIONS.REPORTS_VIEW),
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-600',
    },
    ...(isSuperAdmin
      ? [
        {
          id: 'users',
          title: 'Kelola Tim & Staf',
          description: 'Manajemen akun kasir, staf dapur, administrator, dan pengaturan kata sandi.',
          icon: Users,
          badge: 'Super Admin',
          allowed: true,
          color: 'border-indigo-200 bg-indigo-50/50 text-indigo-600',
        },
      ]
      : []),
  ];

  return (
    <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Panel Manajemen Bite Ledger
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              {isSuperAdmin ? 'Super Administrator' : 'Store Manager (Admin)'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isSuperAdmin
              ? 'Anda memiliki hak akses penuh ke konfigurasi sistem, data operasional, dan pengelolaan staf.'
              : 'Kelola operasional harian restoran Anda, termasuk katalog produk, inventori bahan baku, dan laporan kasir.'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-800 mb-3">Modul Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationalModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-orange-600">
                  <span>Buka Modul</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
