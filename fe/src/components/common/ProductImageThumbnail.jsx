import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { getProductImageUrl } from '../../utils/image.util';

/**
 * Reusable product image thumbnail component.
 * Features:
 * - Computes backend image URL using getProductImageUrl
 * - Handles image load errors gracefully by switching to a fallback icon
 * - Supports presets: 'sm' (w-9 h-9), 'md' (w-12 h-12), 'lg' (w-16 h-16) or custom class
 */
export function ProductImageThumbnail({
  imagePath,
  alt = 'Menu',
  size = 'md',
  className = '',
}) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getProductImageUrl(imagePath);

  // Reset error state if imagePath changes
  useEffect(() => {
    setHasError(false);
  }, [imagePath]);

  const sizeClasses = {
    sm: 'w-9 h-9 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  }[size] || size;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size] || 'w-5 h-5';

  return (
    <div
      className={`overflow-hidden bg-orange-50/80 border border-gray-200/90 shrink-0 flex items-center justify-center relative shadow-2xs ${sizeClasses} ${className}`}
    >
      {imageUrl && !hasError ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Package className={`${iconSizes} text-orange-400/80`} />
      )}
    </div>
  );
}

export default ProductImageThumbnail;
