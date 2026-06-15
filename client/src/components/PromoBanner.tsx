// src/components/PromoBanner.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Camera } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#0052cc] to-[#07308a] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg relative overflow-hidden gap-6">
      
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Left side content */}
      <div className="flex items-center gap-4 relative z-10 text-center md:text-left flex-col md:flex-row">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-1 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Medicines &amp; Groceries Together
          </h2>
          <p className="text-xs text-blue-100 font-medium leading-relaxed">
            Upload your prescription and we'll match it with your grocery list for a single delivery. Fast, safe, and convenient.
          </p>
        </div>
      </div>

      {/* Right side content: Button & Subtitle */}
      <div className="flex flex-col items-center md:items-end gap-2 relative z-10 flex-shrink-0 w-full md:w-auto">
        <button
          onClick={() => navigate('/prescriptions')}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary hover:shadow-lg transition-all font-bold text-xs rounded-full shadow-md uppercase tracking-wider active:scale-95"
        >
          <Camera className="w-4 h-4" />
          Upload Prescription
        </button>
        <span className="text-[10px] text-blue-200 font-semibold tracking-wide">
          Certified Pharmacists available 24/7
        </span>
      </div>

    </div>
  );
};
