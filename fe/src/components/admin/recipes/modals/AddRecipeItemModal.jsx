import { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Coins, Scale } from 'lucide-react';
import ProductImageThumbnail from '../../../common/ProductImageThumbnail';
import inventoryService from '../../../../services/inventoryService';

export function AddRecipeItemModal({
  isOpen,
  onClose,
  product,
  products = [],
  existingItems = [],
  onSubmit,
}) {
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [internalProductId, setInternalProductId] = useState('');
  const [quantityRequired, setQuantityRequired] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSelectedMaterialId('');
      setQuantityRequired('');
      setInternalProductId(product?.id || (products.length > 0 ? String(products[0].id) : ''));
      fetchMaterials();
    }
  }, [isOpen, product, products]);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await inventoryService.getRawMaterials({ limit: 100 });
      const list = res.data?.rawMaterials || [];
      // Filter out raw materials already configured in this recipe
      const existingIds = new Set(existingItems.map((i) => String(i.rawMaterialId)));
      setMaterials(list.filter((m) => !existingIds.has(String(m.id))));
    } catch (err) {
      console.error('Failed to load raw materials:', err);
      setError('Gagal memuat daftar bahan baku inventori.');
    } finally {
      setLoadingMaterials(false);
    }
  };

  if (!isOpen) return null;

  const activeProduct = product || products.find((p) => String(p.id) === String(internalProductId));
  const selectedMaterial = materials.find((m) => String(m.id) === String(selectedMaterialId));
  const qtyNumber = parseFloat(quantityRequired) || 0;
  const costPerUnit = selectedMaterial ? Number(selectedMaterial.costPerUnit || 0) : 0;
  const estimatedItemCost = (qtyNumber * costPerUnit).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetProductId = product?.id || internalProductId;
    if (!targetProductId) {
      setError('Silakan pilih produk menu.');
      return;
    }
    if (!selectedMaterialId) {
      setError('Silakan pilih bahan baku.');
      return;
    }
    if (!quantityRequired || qtyNumber <= 0) {
      setError('Kuantitas takaran harus lebih besar dari 0.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        productId: targetProductId,
        rawMaterialId: selectedMaterialId,
        quantityRequired: qtyNumber,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan bahan baku ke resep.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeProduct ? (
              <ProductImageThumbnail
                imagePath={activeProduct.imageUrl}
                alt={activeProduct.name}
                size="sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight">Tambah Bahan ke Resep</h3>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {activeProduct ? activeProduct.name : 'Pilih menu produk'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Menu selection if not preselected */}
          {!product && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Pilih Menu Produk:</label>
              <select
                value={internalProductId}
                onChange={(e) => setInternalProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white font-medium"
              >
                <option value="">-- Pilih Menu Produk --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Material selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Pilih Bahan Baku Inventori:</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              disabled={loadingMaterials}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="">-- Pilih Bahan Baku --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.unit}) — Stok: {m.stock} {m.unit} — Biaya: {formatRupiah(m.costPerUnit)}/{m.unit}
                </option>
              ))}
            </select>
            {materials.length === 0 && !loadingMaterials && (
              <p className="text-[11px] text-gray-400">
                Semua bahan baku inventori sudah didaftarkan pada resep menu ini atau belum ada stok terdaftar.
              </p>
            )}
          </div>

          {/* Quantity Required */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Takaran per 1 Porsi Menu:</label>
              {selectedMaterial && (
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Satuan: {selectedMaterial.unit}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.001"
                placeholder={selectedMaterial ? `Misal: 15 (dalam ${selectedMaterial.unit})` : 'Masukkan takaran'}
                value={quantityRequired}
                onChange={(e) => setQuantityRequired(e.target.value)}
                disabled={!selectedMaterialId}
                className="w-full pl-3 pr-16 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                {selectedMaterial?.unit || ''}
              </div>
            </div>
          </div>

          {/* Cost preview card */}
          {selectedMaterial && qtyNumber > 0 && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-900 font-medium">Estimasi Biaya Bahan:</span>
              </div>
              <span className="text-xs font-bold text-amber-900">
                {formatRupiah(estimatedItemCost)}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedMaterialId || qtyNumber <= 0}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Bahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecipeItemModal;
