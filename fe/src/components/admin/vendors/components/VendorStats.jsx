import { Truck, PhoneCall, UserCheck, MapPin } from 'lucide-react';

export function VendorStats({
  totalVendors = 0,
  vendorsWithPhone = 0,
  vendorsWithPic = 0,
  vendorsWithAddress = 0,
}) {
  const stats = [
    {
      title: 'Total Vendor Terdaftar',
      value: totalVendors,
      unit: 'mitra supplier',
      icon: Truck,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      title: 'Kontak WhatsApp / Telepon',
      value: vendorsWithPhone,
      unit: 'dapat dihubungi langsung',
      icon: PhoneCall,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Penanggung Jawab (PIC)',
      value: vendorsWithPic,
      unit: 'kontak person terdata',
      icon: UserCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Alamat Pengiriman Lengkap',
      value: vendorsWithAddress,
      unit: 'lokasi gudang/toko jelas',
      icon: MapPin,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
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
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.unit}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VendorStats;
