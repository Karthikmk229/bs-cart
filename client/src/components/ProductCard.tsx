// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [favorite, setFavorite] = useState<boolean>(false);

  // Find default variant or first variant
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  
  // Check if item is already in cart
  const cartItem = cartItems.find((item) => item.productVariantId === defaultVariant?.id);

  // Check stock
  const isOutOfStock = !product.variants || product.variants.length === 0 || 
    product.variants.every(v => !v.inventories || v.inventories.length === 0 || v.inventories.reduce((sum, inv) => sum + inv.quantity, 0) === 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('Item is currently out of stock');
      return;
    }

    if (defaultVariant) {
      try {
        await addToCart(defaultVariant.id, 1);
      } catch (err) {
        // Handled by context
      }
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItem.id);
      }
    }
  };

  const images = product.imageUrls as string[] | any;
  const imageUrl = Array.isArray(images) && images.length > 0 
    ? images[0]
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';

  // Seed rating and review count consistently
  const seed = product.name.charCodeAt(0) || 5;
  const rating = (4.3 + (seed % 7) * 0.1).toFixed(1);
  const reviewCount = 20 + (seed % 180);

  // Dynamic tags
  const isOrganic = product.brand.toLowerCase().includes('ooty') || product.brand.toLowerCase().includes('organic') || product.brand.toLowerCase().includes('bio-fresh');
  const isPremium = product.brand.toLowerCase().includes('nilgiris') || product.brand.toLowerCase().includes('direct');

  return (
    <article className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-transparent hover:border-primary/20 transition-all group flex flex-col h-full">
      
      {/* Image Gallery Area */}
      <div className="relative mb-4 aspect-square bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
        <Link to={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        
        {isOrganic && (
          <span className="absolute top-2 left-2 bg-error text-on-error text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Organic
          </span>
        )}
        {isPremium && (
          <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Premium
          </span>
        )}
        {product.requiresPrescription && !isOrganic && !isPremium && (
          <span className="absolute top-2 left-2 bg-[#855300] text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Rx Req
          </span>
        )}
        
        {/* Favorite heart icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorite(!favorite);
          }}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full flex items-center justify-center shadow-xs transition-colors"
        >
          <span className={`material-symbols-outlined text-lg ${favorite ? 'text-red-600 fill-current' : 'text-slate-500 hover:text-red-500'}`}>
            favorite
          </span>
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="px-2.5 py-1 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-md">
              Out Of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-outline mb-1 font-semibold uppercase tracking-wider">{product.brand}</p>
          <Link to={`/products/${product.slug}`} className="block">
            <h4 className="font-semibold text-[#121c2a] leading-tight text-sm hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
              {product.name}
            </h4>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
              star
            </span>
            <span className="font-bold text-slate-800">{rating}</span>
            <span className="text-outline">({reviewCount})</span>
          </div>
        </div>

        {/* Size Selection & Action row */}
        <div className="mt-4 pt-2 border-t border-slate-100">
          <div className="mb-3">
            <select className="w-full bg-slate-50 border border-slate-200/60 rounded-lg py-1.5 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-slate-700">
              <option>{product.unit} - ₹{product.sellingPrice}</option>
            </select>
          </div>

          <div className="flex items-center justify-between handed-reverse">
            <span className="text-lg font-bold text-[#121c2a]">₹{product.sellingPrice}</span>
            
            {cartItem ? (
              <div className="flex items-center bg-[#e6eeff] rounded-full p-0.5 gap-1.5 border border-[#bbcabf]/20">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300/80 flex items-center justify-center text-[#3c4a42] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="w-5 text-center font-bold text-xs text-slate-800">{cartItem.quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center transition-colors hover:brightness-105"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="bg-primary text-white flex items-center gap-1 px-4 py-1.5 rounded-full font-bold text-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
