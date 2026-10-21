import { useState, useEffect, useRef } from 'react';
import {
  Package,
  ArrowLeft,
  Save,
  AlertCircle,
  Sparkles,
  Tag,
  Plus,
  Coins,
  CheckCircle2,
  ChefHat,
  AlertTriangle,
  UploadCloud,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import productService from '../../../../services/productService';
import { getProductImageUrl } from '../../../../utils/image.util';

export function EditProductPage({
  product,
  onBack,
  onSuccess,
  existingCategories = [],
}) {
  const [name, setName] = useState(product?.name || '');
  const [categoriesList, setCategoriesList] = useState(() => {
    const list = [...existingCategories];
    if (product?.category && !list.includes(product.category)) {
      list.push(product.category);
    }
    return list;
  });
  const [selectedCategory, setSelectedCategory] = useState(product?.category || '');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [sellingPrice, setSellingPrice] = useState(String(product?.sellingPrice || ''));
  const [isActive, setIsActive] = useState(product?.isActive !== false);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => getProductImageUrl(product?.imageUrl));
  const [removeImage, setRemoveImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSelectedCategory(product.category || '');
      setSellingPrice(String(product.sellingPrice || ''));
      setIsActive(product.isActive !== false);
      setImagePreview(getProductImageUrl(product.imageUrl));
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [product]);

  // Clean up blob preview on unmount or file change
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Harap pilih gambar JPEG, PNG, atau WEBP.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Ukuran gambar terlalu besar. Maksimal ukuran file adalah 5MB.');
      return;
    }

    setError('');
    setImageFile(file);
    setRemoveImage(false);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmAddCategory = (e) => {
    e?.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
    }
    setSelectedCategory(trimmed);
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  const parsedPrice = parseFloat(sellingPrice) || 0;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama menu produk wajib diisi.');
      return;
    }

    const finalCategory = (isAddingCategory && newCategoryInput.trim())
      ? newCategoryInput.trim()
      : selectedCategory.trim();

    if (!finalCategory) {
      setError('Kategori menu wajib ditentukan.');
      return;
    }

    if (parsedPrice < 0 || isNaN(parsedPrice)) {
      setError('Harga jual menu harus berupa angka valid (minimal Rp 0).');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', finalCategory);
      formData.append('sellingPrice', parsedPrice);
      formData.append('isActive', isActive);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (removeImage) {
        formData.append('removeImage', 'true');
      }

      const res = await productService.updateProduct(product.id, formData);

      if (onSuccess) {
        onSuccess(`Menu produk "${res.data.name}" berhasil diperbarui.`, res.data);
      }
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err.message || 'Gagal memperbarui menu produk.');
      setSubmitting(false);
    }
  };

  const displayCategory =
    (isAddingCategory && newCategoryInput.trim()) || selectedCategory || 'Kategori Menu';

  const hasRecipe = product?.recipe?.items && product.recipe.items.length > 0;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Katalog Produk & Menu</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Ubah Menu #{product?.id}</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Ubah Menu: {product?.name}</span>
          </h1>
          <p className="text-xs text-gray-500">
            Perbarui nama menu, foto produk, kategori, harga jual, dan status ketersediaan kasir POS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-orange-200 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Fields (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Perbarui Detail Menu</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Ubah informasi produk, ganti foto, dan kelola status ketersediaan.
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              ID #{product?.id}
            </span>
          </div>

          {/* Product Image Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>Foto / Gambar Menu (Opsional)</span>
              <span className="text-[11px] font-normal text-gray-400">JPG, PNG, WEBP (Maks. 5MB)</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 p-3 flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 shadow-2xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {imageFile?.name || (product?.imageUrl ? 'Foto Produk Saat Ini' : 'Foto Produk')}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {imageFile
                      ? `${(imageFile.size / 1024).toFixed(1)} KB (Foto Baru)`
                      : 'Tersimpan di server'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      Ganti Foto
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/20 bg-gray-50/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">
                    <span className="text-orange-600 hover:underline">Klik untuk unggah</span> atau seret file ke sini
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Format yang didukung: PNG, JPG, JPEG, WEBP (maksimal 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Nama Menu Produk *</label>
            <input
              type="text"
              placeholder="Misal: Kopi Susu Aren Gula Jawa, Croissant Butter..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Kategori Menu *</label>
              <button
                type="button"
                onClick={() => setIsAddingCategory((prev) => !prev)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingCategory ? 'Pilih Dari Kategori' : 'Buat Kategori Baru'}</span>
              </button>
            </div>

            {!isAddingCategory ? (
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
                <p className="text-[11px] font-bold text-orange-900">
                  Ketik nama kategori baru yang ingin ditambahkan:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Misal: Kopi, Minuman Segar, Makanan Utama, Snack"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleConfirmAddCategory();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white focus:outline-none focus:border-orange-500 font-medium"
                    autoFocus={isAddingCategory}
                  />
                  <button
                    type="button"
                    onClick={handleConfirmAddCategory}
                    disabled={!newCategoryInput.trim()}
                    className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Pilih
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryInput('');
                    }}
                    className="px-2.5 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selling Price */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-700">Harga Jual Menu (POS) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="20000"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Harga ini yang akan langsung tampil pada antarmuka kasir saat pelanggan memesan menu ini.
            </p>
          </div>

          {/* Active Status Switch */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-900">Status Ketersediaan Kasir POS</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Jika diaktifkan, menu ini akan langsung dapat dipilih dan dijual di kasir.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>

        {/* Right Preview Area (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Card Preview for POS / Kitchen */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Pratinjau Kartu Menu</span>
              </h3>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                Tampilan Live
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Beginilah tampilan menu ini di katalog kasir dan operasional:
            </p>

            {/* Preview Card */}
            <div className="rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden bg-white">
              {/* Product Image on Card Preview */}
              {imagePreview ? (
                <div className="h-40 w-full overflow-hidden bg-gray-100 relative group">
                  <img
                    src={imagePreview}
                    alt="Preview Menu"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-orange-800 border border-orange-200 uppercase shadow-xs">
                      {displayCategory}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-amber-50/30 flex items-center justify-between">
                <div>
                  {!imagePreview && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                      {displayCategory}
                    </span>
                  )}
                  <h4 className="font-bold text-gray-900 text-base mt-1">
                    {name.trim() || 'Nama Menu Baru'}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <span>{isActive ? 'Aktif Dijual' : 'Nonaktif'}</span>
                </span>
              </div>

              <div className="p-4 flex items-center justify-between bg-white">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Harga Jual POS</p>
                  <p className="text-base font-bold text-orange-600">{formatRupiah(parsedPrice)}</p>
                </div>

                <div className="text-right">
                  {hasRecipe ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Resep Siap ({product.recipe.items.length} Bahan)
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      Resep Belum Ada
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Step Info Box */}
          <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/90 flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-950 space-y-1">
              <p className="font-bold">Info Resep Menu & BOM:</p>
              <p className="text-orange-900/80 leading-relaxed">
                Anda dapat menghubungkan bahan baku dapur dan menghitung estimasi margin laba kotor melalui modul{' '}
                <strong className="text-orange-950">Resep Menu & BOM</strong>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
