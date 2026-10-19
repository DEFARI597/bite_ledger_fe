
import { Boxes, Plus } from 'lucide-react';

export function InventoryHeader({
  onOpenCreateMaterial,
  lowStockCount = 0,
}) {
  return (
    <div className="space-y-4 pb-2 border-b border-orange-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Inventori & Bahan Baku
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                  Admin & Kitchen
                </span>
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {lowStockCount} Menipis
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Pantau stok bahan dapur, pencatatan mutasi stok, serta peringatan batas minimum persediaan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCreateMaterial}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 100%)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bahan Baku</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryHeader;
