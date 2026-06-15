// src/components/CartItem.tsx
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const variant = item.productVariant;
  const product = variant.product;

  const price = variant.priceOverride ?? product.sellingPrice;

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const images = product.imageUrls as string[] | any;
  const imageUrl = Array.isArray(images) && images.length > 0 
    ? images[0]
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 text-sm truncate">{product.name}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{variant.size}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-extrabold text-sm text-slate-900">₹{price}</span>
          {product.mrp > price && (
            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
          )}
        </div>
      </div>

      {/* Quantity Editor */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
          <button
            onClick={handleDecrement}
            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-xs font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
