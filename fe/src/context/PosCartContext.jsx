import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const PosCartContext = createContext(null);

const STORAGE_KEY = 'biteledger_pos_cart';

export function PosCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse cart from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    if (!product || !product.id) return;

    const hasRecipe = Boolean(product.recipe?.items && product.recipe.items.length > 0);
    const isInsufficient = hasRecipe && product.recipe.items.some((i) => i.stock !== undefined && i.stock < i.quantityRequired);
    const isLowStock = hasRecipe && product.recipe.items.some((i) => i.stock !== undefined && i.minStockAlert !== undefined && i.stock <= i.minStockAlert);
    const isOutOfStock = Boolean(product.isOutOfStock || isInsufficient || isLowStock);

    if (product.isActive === false || isOutOfStock) {
      return;
    }

    const maxPortions = product.maxPortionsAvailable !== undefined && product.maxPortionsAvailable !== null
      ? product.maxPortionsAvailable
      : (hasRecipe
        ? Math.min(...product.recipe.items.map((i) => (i.quantityRequired > 0 ? Math.floor((i.stock || 0) / i.quantityRequired) : 0)))
        : null);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.product.id) === String(product.id));
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (maxPortions !== null && currentQty >= maxPortions) {
          return prev;
        }
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: currentQty + 1,
        };
        return next;
      }

      if (maxPortions !== null && maxPortions <= 0) {
        return prev;
      }

      return [
        ...prev,
        {
          id: product.id,
          product,
          quantity: 1,
          notes: '',
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQty = item.quantity + delta;
            const maxPortions = item.product?.maxPortionsAvailable;
            if (delta > 0 && maxPortions !== null && maxPortions !== undefined && newQty > maxPortions) {
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  }, []);

  const updateNotes = useCallback((productId, notes) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.product.id) === String(productId) ? { ...item, notes } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => String(i.product.id) === String(productId));
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product?.sellingPrice || 0);
      return sum + price * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      updateNotes,
      clearCart,
      getItemQuantity,
      totalQuantity,
      totalAmount,
    }),
    [
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      updateNotes,
      clearCart,
      getItemQuantity,
      totalQuantity,
      totalAmount,
    ]
  );

  return <PosCartContext.Provider value={value}>{children}</PosCartContext.Provider>;
}

export function usePosCart() {
  const context = useContext(PosCartContext);
  if (!context) {
    throw new Error('usePosCart must be used within a PosCartProvider');
  }
  return context;
}

export default PosCartContext;
