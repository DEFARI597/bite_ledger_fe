import React, { useState, useEffect, memo } from 'react';
import { Package, Plus, Minus, AlertCircle, AlertTriangle, Ban } from 'lucide-react';
import { getProductImageUrl } from '../../utils/image.util';

export const PosProductCard = memo(function PosProductCard({
  product,
  onSelect,
  onDecrement,
  cartQuantity = 0,
}) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getProductImageUrl(product?.imageUrl);

  useEffect(() => {
    setImgError(false);
  }, [product?.imageUrl]);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const hasRecipe = Boolean(product?.recipe?.items && product.recipe.items.length > 0);

  const emptyIngredients = product?.recipe?.emptyIngredients || (hasRecipe
    ? product.recipe.items.filter((i) => i.stock !== undefined && i.stock < i.quantityRequired)
    : []);

  const lowStockIngredients = product?.recipe?.lowStockIngredients || (hasRecipe
    ? product.recipe.items.filter((i) => i.stock !== undefined && i.minStockAlert !== undefined && i.stock <= i.minStockAlert && i.stock >= i.quantityRequired)
    : []);

  const isInsufficient = emptyIngredients.length > 0;
  const isLowStock = lowStockIngredients.length > 0;
  const isOutOfStock = Boolean(product?.isOutOfStock || isInsufficient || isLowStock);
  const isInactive = product?.isActive === false;
  const isUnavailable = isInactive || isOutOfStock;

  const maxPortions = product?.maxPortionsAvailable !== undefined && product?.maxPortionsAvailable !== null
    ? product.maxPortionsAvailable
    : (hasRecipe
      ? Math.min(...product.recipe.items.map((i) => (i.quantityRequired > 0 ? Math.floor((i.stock || 0) / i.quantityRequired) : 0)))
      : null);

  const isMaxReached = maxPortions !== null && cartQuantity >= maxPortions;

  const handleCardClick = () => {
    if (isUnavailable) return;
    if (isMaxReached) return;
    onSelect?.(product);
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    if (isUnavailable) return;
    if (isMaxReached) return;
    onSelect?.(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col group select-none relative ${isUnavailable
        ? 'border-gray-200/80 bg-gray-50/40 cursor-not-allowed opacity-90'
        : cartQuantity > 0
          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md cursor-pointer'
          : 'border-gray-200/90 hover:border-orange-300 hover:shadow-md cursor-pointer shadow-2xs'
        }`}
    >
      <div className="relative w-full aspect-square bg-orange-50/50 overflow-hidden flex items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-300 ${isUnavailable ? 'grayscale-[0.35]' : 'group-hover:scale-105'
              }`}
            onError={() => setImgError(true)}
          />
        ) : (
          <Package className={`w-14 h-14 ${isUnavailable ? 'text-gray-300' : 'text-orange-300/80'}`} />
        )}

        {isUnavailable && (
          <div className="absolute inset-0 bg-gray-950/45 backdrop-blur-[1.5px] flex items-center justify-center p-3 text-center transition-all">
            <span className="px-3.5 py-1.5 rounded-xl bg-red-600/95 text-white text-xs font-black tracking-wide uppercase shadow-md flex items-center gap-1.5 border border-red-400/40">
              <Ban className="w-3.5 h-3.5" />
              <span>Habis</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between gap-3.5">
        <div>
          <h3
            className={`font-bold text-sm sm:text-base leading-snug line-clamp-2 transition-colors ${isUnavailable
              ? 'text-gray-500'
              : 'text-gray-900 group-hover:text-orange-600'
              }`}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Harga</p>
            <p
              className={`text-base sm:text-lg font-black ${isUnavailable ? 'text-gray-400 line-through decoration-red-400/50' : 'text-orange-600'
                }`}
            >
              {formatRupiah(product.sellingPrice)}
            </p>
          </div>

          {isUnavailable ? (
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center border border-gray-200 cursor-not-allowed shrink-0"
              title="Habis"
            >
              <Ban className="w-4 h-4 text-gray-400" />
            </div>
          ) : cartQuantity > 0 ? (
            <div
              className="flex items-center bg-orange-50/90 border border-orange-200/90 rounded-xl p-1 gap-1 shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement?.(product);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-orange-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-orange-100 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
                title={`Kurangi 1 ${product.name}`}
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <span className="min-w-6 text-center font-black text-xs sm:text-sm text-gray-900 px-1 select-none">
                {cartQuantity}
              </span>

              <button
                type="button"
                onClick={handlePlusClick}
                disabled={isMaxReached}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all shadow-2xs shrink-0 ${isMaxReached
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 cursor-pointer'
                  }`}
                title={
                  isMaxReached
                    ? `Stok bahan baku maksimal (${maxPortions} porsi) tercapai`
                    : `Tambah 1 ${product.name}`
                }
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePlusClick}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
              title={`Pilih ${product.name}`}
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default PosProductCard;
