// src/components/AddressForm.tsx
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface AddressFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    type: initialData?.type || 'home',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    state: initialData?.state || 'Tamil Nadu',
    pincode: initialData?.pincode || '',
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify pincode format
    const pincodeRegex = /^[6][0-4]\d{4}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      toast.error('Pincode must be a 6-digit number in Tamil Nadu (600xxx - 649xxx)');
      return;
    }

    setIsLoading(true);
    try {
      if (initialData?.id) {
        await api.patch(`/addresses/${initialData.id}`, formData);
        toast.success('Address updated successfully');
      } else {
        await api.post('/addresses', formData);
        toast.success('Address created successfully');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save address. Check pincode serviceability.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-lg">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pincode (Tamil Nadu Only)</label>
              <input
                type="text"
                name="pincode"
                required
                placeholder="600001"
                maxLength={6}
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              required
              placeholder="Door No, Street Name"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address Line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              placeholder="Apartment, Suite, Unit"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                placeholder="e.g. Near Bus Stand"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                name="city"
                required
                placeholder="Chennai"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">District</label>
              <input
                type="text"
                name="district"
                required
                placeholder="Chennai District"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                name="state"
                disabled
                value={formData.state}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isDefault" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
              Make this my default shipping address
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 font-semibold text-sm shadow-md shadow-brand-100 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Address
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
