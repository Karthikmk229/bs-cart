// src/components/PincodeChecker.tsx
import React, { useState } from 'react';
import { X, CheckCircle, MapPin } from 'lucide-react';
import { usePincode } from '../context/PincodeContext';
import { toast } from 'react-hot-toast';

interface PincodeCheckerProps {
  onClose: () => void;
}

export const PincodeChecker: React.FC<PincodeCheckerProps> = ({ onClose }) => {
  const { pincode, setPincode } = usePincode();
  const [inputPin, setInputPin] = useState<string>(pincode || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Indian pincode check: 6 digits, and starts with 60 to 64 for Tamil Nadu
    const tnPinRegex = /^[6][0-4]\d{4}$/;
    if (!tnPinRegex.test(inputPin)) {
      toast.error('Please enter a valid 6-digit Tamil Nadu pincode (60xxxx to 64xxxx)');
      return;
    }

    setPincode(inputPin);
    toast.success(`Location set to ${inputPin}`);
    onClose();
    // Reload components depending on pincode
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-fade-in-up">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        {/* Info */}
        <div className="text-center mt-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mx-auto mb-3">
            <MapPin className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg">Enter Delivery Location</h3>
          <p className="text-xs text-slate-400 mt-1">Provide your pincode to check stock availability in local warehouses.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="e.g. 600001 (Chennai)"
              maxLength={6}
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-100 hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Verify Location
          </button>
        </form>

        {/* Region notes */}
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mt-4 text-[10px] text-amber-700 leading-relaxed">
          <strong>Note:</strong> We currently service major metropolitan and urban hubs in Tamil Nadu including Chennai, Madurai, Coimbatore, Trichy, and Salem.
        </div>

      </div>
    </div>
  );
};
