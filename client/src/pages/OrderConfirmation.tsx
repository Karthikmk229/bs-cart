// src/pages/OrderConfirmation.tsx
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, ClipboardList } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'TN-xxxxxxxx-xxxx';

  return (
    <div className="py-12 max-w-md mx-auto text-center space-y-6">
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order Placed Successfully!</h1>
        <p className="text-sm text-slate-500">Thank you for shopping with TN Market. Your order is registered in our local neighborhood fulfillment hub.</p>
      </div>

      {/* Order Info Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3.5 shadow-sm text-slate-800 text-sm">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
          <span className="text-xs text-slate-400 font-bold uppercase">Order Number</span>
          <strong className="font-extrabold text-slate-800">{orderNumber}</strong>
        </div>
        <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
          <span className="text-xs text-slate-400 font-bold uppercase">Estimated Delivery</span>
          <strong className="font-extrabold text-brand-700">Today, within 2 Hours</strong>
        </div>
        <div className="flex items-center justify-between text-left">
          <span className="text-xs text-slate-400 font-bold uppercase">Fulfillment Partner</span>
          <strong className="font-semibold text-slate-700">TN Market Delivery Service</strong>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          to="/orders"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ClipboardList className="w-4 h-4 text-slate-400" />
          View My Orders
        </Link>
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-brand-100"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
