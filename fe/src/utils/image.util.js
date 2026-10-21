/**
 * Get full URL for product image.
 * Handles relative paths (e.g. /uploads/products/xxx.jpg) and full/blob URLs.
 * @param {string|null|undefined} imagePath
 * @returns {string|null}
 */
export const getProductImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendBase}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default getProductImageUrl;
