import { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import { getProductImageUrl } from '../../utils/image.util';

export function PosProductCard({ product, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getProductImageUrl(product.imageUrl);

  useEffect(() => {
    setImgError(false);
  }, [product.imageUrl]);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-white rounded-2xl border border-gray-200/90 hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer shadow-2xs select-none"
    >
      <div className="relative w-full aspect-square bg-orange-50/50 overflow-hidden flex items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <Package className="w-14 h-14 text-orange-300/80" />
        )}

        {product.isActive === false && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-xl bg-gray-900/80 text-white text-xs font-bold uppercase tracking-wider">
              Habis / Nonaktif
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between gap-3.5">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Harga</p>
            <p className="text-base sm:text-lg font-black text-orange-600">
              {formatRupiah(product.sellingPrice)}
            </p>
          </div>

          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
            title={`Pilih ${product.name}`}
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosProductCard;
