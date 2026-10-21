import { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2, AlertCircle, Coins, Sparkles } from 'lucide-react';
import ProductImageThumbnail from '../../../common/ProductImageThumbnail';
import inventoryService from '../../../../services/inventoryService';

export function BulkRecipeModal({
  isOpen,
  onClose,
  product,
  currentItems = [],
  onSubmit,
}) {
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [rows, setRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      fetchMaterials();
      // Initialize rows with current recipe items
      if (currentItems && currentItems.length > 0) {
        setRows(
          currentItems.map((item) => ({
            rawMaterialId: String(item.rawMaterialId),
            quantityRequired: String(item.quantityRequired),
          }))
        );
      } else {
        setRows([{ rawMaterialId: '', quantityRequired: '' }]);
      }
    }
  }, [isOpen, currentItems]);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await inventoryService.getRawMaterials({ limit: 100 });
      setMaterials(res.data?.rawMaterials || []);
    } catch (err) {
      console.error('Failed to load raw materials:', err);
      setError('Gagal memuat inventori bahan baku.');
    } finally {
      setLoadingMaterials(false);
    }
  };

  if (!isOpen || !product) return null;

  const handleAddRow = () => {
    setRows((prev) => [...prev, { rawMaterialId: '', quantityRequired: '' }]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Calculate live total cost
  let totalCost = 0;
  for (const row of rows) {
    if (row.rawMaterialId && row.quantityRequired) {
      const mat = materials.find((m) => String(m.id) === String(row.rawMaterialId));
      if (mat) {
        const qty = parseFloat(row.quantityRequired) || 0;
        const cost = Number(mat.costPerUnit || 0);
        totalCost += qty * cost;
      }
    }
  }

  const sellingPrice = Number(product.sellingPrice || 0);
  const grossProfit = Math.max(0, sellingPrice - totalCost);
  const marginPercentage = sellingPrice > 0 ? ((grossProfit / sellingPrice) * 100).toFixed(1) : 0;

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
    if (rows.length === 0) {
      setError('Minimal tambahkan 1 bahan baku ke dalam resep.');
      return;
    }

    const seenIds = new Set();
    const itemsToSubmit = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.rawMaterialId) {
        setError(`Baris #${i + 1}: Bahan baku belum dipilih.`);
        return;
      }
      if (seenIds.has(row.rawMaterialId)) {
        const mat = materials.find((m) => String(m.id) === String(row.rawMaterialId));
        setError(`Duplikasi bahan baku: "${mat?.name || row.rawMaterialId}". Bahan baku yang sama tidak boleh diinput lebih dari sekali.`);
        return;
      }
      seenIds.add(row.rawMaterialId);

      const qty = parseFloat(row.quantityRequired);
      if (isNaN(qty) || qty <= 0) {
        setError(`Baris #${i + 1}: Takaran harus lebih besar dari 0.`);
        return;
      }

      itemsToSubmit.push({
        rawMaterialId: row.rawMaterialId,
        quantityRequired: qty,
      });
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(product.id, itemsToSubmit);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan konfigurasi resep massal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-orange-100 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <ProductImageThumbnail
              imagePath={product.imageUrl}
              alt={product.name}
              size="md"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight">Bulk Racik Resep (Bill of Materials)</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Menu: <span className="font-semibold text-gray-800">{product.name}</span> ({formatRupiah(sellingPrice)})
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
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Formula Table */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {rows.map((row, idx) => {
              const selectedMat = materials.find((m) => String(m.id) === String(row.rawMaterialId));
              const qty = parseFloat(row.quantityRequired) || 0;
              const subtotal = selectedMat ? qty * Number(selectedMat.costPerUnit || 0) : 0;

              return (
                <div
                  key={idx}
                  className="p-3 bg-gray-50/75 rounded-xl border border-gray-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">
                    #{idx + 1}
                  </div>

                  {/* Material dropdown */}
                  <div className="flex-1 min-w-0">
                    <select
                      value={row.rawMaterialId}
                      onChange={(e) => handleRowChange(idx, 'rawMaterialId', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">-- Pilih Bahan Baku --</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.unit}) — {formatRupiah(m.costPerUnit)}/{m.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="w-full sm:w-36 relative shrink-0">
                    <input
                      type="number"
                      step="any"
                      min="0.001"
                      placeholder="Takaran"
                      value={row.quantityRequired}
                      onChange={(e) => handleRowChange(idx, 'quantityRequired', e.target.value)}
                      className="w-full pl-2.5 pr-12 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-400 pointer-events-none">
                      {selectedMat?.unit || 'unit'}
                    </span>
                  </div>

                  {/* Subtotal Preview */}
                  <div className="w-full sm:w-28 text-right text-xs font-bold text-amber-800 shrink-0">
                    {formatRupiah(subtotal)}
                  </div>

                  {/* Delete row */}
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    disabled={rows.length <= 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 cursor-pointer shrink-0 self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 shrink-0">
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer border border-dashed border-orange-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris Bahan</span>
            </button>

            {/* Total summary */}
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block">Total Estimasi HPP:</span>
              <span className="text-base font-extrabold text-amber-900">{formatRupiah(totalCost)}</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">
                Margin: {marginPercentage}% ({formatRupiah(grossProfit)})
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100 shrink-0">
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
              disabled={submitting}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Menyimpan Resep...' : 'Simpan Semua Formula'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BulkRecipeModal;
