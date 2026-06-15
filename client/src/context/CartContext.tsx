// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductVariant } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  subTotal: number;
  totalTax: number;
  totalQuantity: number;
  requiresPrescription: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (variantId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await api.post('/cart/items', { productVariantId: variantId, quantity });
      toast.success('Added to cart');
      await refreshCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error adding to cart';
      toast.error(msg);
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity });
      await refreshCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error updating quantity';
      toast.error(msg);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.success('Removed from cart');
      await refreshCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error removing item';
      toast.error(msg);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Math totals
  let subTotal = 0;
  let totalTax = 0;
  let totalQuantity = 0;
  let requiresPrescription = false;

  cartItems.forEach((item) => {
    const variant = item.productVariant;
    const product = variant.product;
    const price = variant.priceOverride ?? product.sellingPrice;
    
    totalQuantity += item.quantity;
    
    // Total price is inclusive. Split GST:
    const totalPrice = price * item.quantity;
    const baseValue = totalPrice / (1 + product.gstPercent / 100);
    const tax = totalPrice - baseValue;

    subTotal += baseValue;
    totalTax += tax;

    if (product.requiresPrescription) {
      requiresPrescription = true;
    }
  });

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subTotal: Number(subTotal.toFixed(2)),
        totalTax: Number(totalTax.toFixed(2)),
        totalQuantity,
        requiresPrescription,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
