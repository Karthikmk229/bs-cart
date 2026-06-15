// src/pages/Cart.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { ShoppingBag, ArrowRight, ShieldAlert, CreditCard } from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, subTotal, totalTax, totalQuantity, requiresPrescription, isLoading } = useCart();

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="py-12 animate-pulse space-y-6">
        <div className="h-8 bg-slate-100 rounded-md w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-20 bg-slate-100 rounded-2xl"></div>
            <div className="h-20 bg-slate-100 rounded-2xl"></div>
          </div>
          <div className="h-40 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center max-w-sm mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">Your cart is empty</h3>
          <p className="text-xs text-slate-400 mt-1">Looks like you haven't added anything to your cart yet. Explore our grocery and medical catalog!</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-700 shadow-md transition-all"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Inclusive total
  const rawTotal = subTotal + totalTax;

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Shopping Cart ({totalQuantity} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-5 divide-y divide-slate-100 shadow-xs">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Pricing Summary Sidepanel */}
        <aside className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm pb-3 border-b border-slate-100">Order Summary</h3>
            
            <div className="space-y-2 text-sm text-slate-500 font-semibold">
              <div className="flex items-center justify-between">
                <span>Subtotal (Excl. Tax)</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total GST Tax</span>
                <span>₹{totalTax}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-normal">
                <span>CGST Split (Tamil Nadu 50%)</span>
                <span>₹{(totalTax / 2).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-normal">
                <span>SGST Split (Tamil Nadu 50%)</span>
                <span>₹{(totalTax / 2).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span>₹{rawTotal}</span>
              </div>
            </div>

            {/* Prescription Reminder Alert */}
            {requiresPrescription && (
              <div className="flex gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-[10px] text-red-700 leading-normal">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 animate-pulse" />
                <div>
                  <strong>Prescription Required:</strong> Your cart contains medical items that require prescription verification. You must attach/upload a prescription on checkout.
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutRedirect}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-100 hover:shadow-brand-200 transition-all"
            >
              <CreditCard className="w-4.5 h-4.5" />
              Proceed to Checkout
            </button>
          </div>

          <div className="text-center">
            <Link to="/products" className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
};
