// src/components/CouponInput.tsx
import React, { useState } from 'react';
import { Tag, Check, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface CouponInputProps {
  subTotal: number;
  onCouponApplied: (couponCode: string, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCode: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  subTotal,
  onCouponApplied,
  onCouponRemoved,
  appliedCode,
}) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim().toUpperCase(),
        subTotal,
      });

      const { discountAmount, code } = res.data.data;
      onCouponApplied(code, discountAmount);
      toast.success(`Coupon "${code}" applied! You saved ₹${discountAmount}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
        <Tag className="w-4 h-4 text-brand-600" />
        Apply Promo Coupon
      </h4>

      {appliedCode ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-sm">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <Check className="w-4.5 h-4.5 text-emerald-600" />
            <span>Code <strong>{appliedCode}</strong> Applied</span>
          </div>
          <button
            onClick={() => {
              onCouponRemoved();
              setCouponCode('');
              toast.success('Coupon removed');
            }}
            className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="ENTER COUPON CODE"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-bold uppercase tracking-wider placeholder:normal-case placeholder:font-normal"
          />
          <button
            type="submit"
            disabled={isLoading || !couponCode.trim()}
            className="flex items-center justify-center gap-1.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Apply
          </button>
        </form>
      )}

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-600 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
