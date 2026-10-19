import React from 'react';
import { Boxes, AlertTriangle, Truck, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/inventoryFormatters';

export function InventoryStats({
  totalMaterials = 0,
  lowStockCount = 0,
  totalSuppliers = 0,
  totalInventoryValue = 0,
}) {
  const stats = [
    {
      title: 'Total Bahan Baku',
      value: totalMaterials,
      unit: 'item terdaftar',
      icon: Boxes,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      title: 'Stok Kritis / Menipis',
      value: lowStockCount,
      unit: 'perlu restock segera',
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-500 border-gray-200',
      badge: lowStockCount > 0 ? 'Perhatian' : 'Aman',
      badgeClass: lowStockCount > 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Mitra Pemasok Aktif',
      value: totalSuppliers,
      unit: 'supplier terhubung',
      icon: Truck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Nilai Aset Bahan Baku',
      value: formatCurrency(totalInventoryValue),
      unit: 'estimasi modal fisik',
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{stat.title}</span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </span>
                {stat.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${stat.badgeClass}`}>
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.unit}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InventoryStats;
