import { useState } from 'react';
import {
  Truck,
  ArrowLeft,
  Save,
  AlertCircle,
  Building2,
  User,
  Phone,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import supplierService from '../../../../services/supplierService';

export function CreateVendorPage({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nama perusahaan / vendor wajib diisi.');
      return;
    }

    setFormSubmitting(true);
    try {
      await supplierService.createSupplier({
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
      });

      if (onSuccess) {
        onSuccess(`Vendor "${formData.name.trim()}" berhasil ditambahkan.`);
      }
    } catch (err) {
      setFormError(err.message || 'Gagal menambahkan vendor baru.');
      setFormSubmitting(false);
    }
  };

  const initialLetter = formData.name.trim() ? formData.name.trim().charAt(0).toUpperCase() : 'V';

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Vendor & Mitra Pemasok
            </button>
            <span>/</span>
            <span className="text-orange-600 font-semibold">Tambah Vendor Baru</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Tambah Vendor Baru
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Daftarkan mitra penyedia bahan mentah baru ke dalam sistem logistik & inventori.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs cursor-pointer active:scale-98 w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Kembali ke Daftar Vendor</span>
        </button>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div className="font-semibold text-red-800">Gagal Menyimpan Data</div>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Main Form & Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Building2 className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">1. Identitas Perusahaan / Toko Vendor</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Perusahaan / Vendor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Makmur Pangan, Toko Kopi Nusantara, CV Agro Segar..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400 font-medium"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Nama resmi vendor atau merek dagang tempat pembelian bahan baku dapur.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Penanggung Jawab / Kontak Person (PIC)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Contoh: Bpk. Budi Santoso, Ibu Rina Wijaya..."
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Nama perwakilan sales, manajer akun, atau pemilik toko penyedia.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Phone className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">2. Saluran Komunikasi & Lokasi Pengiriman</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  No. Telepon / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890 / 021-5551234"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Nomor aktif untuk pemesanan ulang (restock) dan koordinasi pengiriman bahan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Alamat Kantor / Gudang Operasional
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Contoh: Jl. Industri Raya No. 45, Kawasan Pergudangan Blok B, Jakarta Barat"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Alamat fisik untuk rujukan faktur, nota pembelian, atau pengambilan barang.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={formSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
              }}
            >
              <Save className="w-4 h-4" />
              <span>{formSubmitting ? 'Menyimpan...' : 'Simpan Vendor'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white p-6 rounded-2xl border border-orange-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2 text-orange-800">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Pratinjau Vendor</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Live Preview
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0 border border-orange-200">
                  {initialLetter}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug break-words">
                    {formData.name.trim() || 'Nama Vendor / Perusahaan'}
                  </h4>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 mt-1">
                    Mitra Pemasok Aktif
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-500">PIC:</span>
                  <strong className="text-gray-800 font-medium">
                    {formData.contactPerson.trim() || '-'}
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-500">Telepon:</span>
                  <strong className="text-gray-800 font-medium">
                    {formData.phone.trim() || '-'}
                  </strong>
                </div>

                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500">Alamat:</span>
                  <span className="text-gray-700 break-words flex-1">
                    {formData.address.trim() || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[11px]">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Informasi Vendor:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-500 pl-4 list-disc">
                <li>Vendor yang tersimpan akan langsung muncul pada pilihan mitra saat mendaftarkan bahan baku baru.</li>
                <li>Data nomor telepon dapat dihubungi langsung dari tabel vendor untuk restock cepat.</li>
                <li>Daftar vendor dapat diperbarui sewaktu-waktu melalui tombol Edit di tabel.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateVendorPage;
