// src/components/PrescriptionBadge.tsx
import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface PrescriptionBadgeProps {
  required: boolean;
}

export const PrescriptionBadge: React.FC<PrescriptionBadgeProps> = ({ required }) => {
  if (required) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200">
        <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
        Prescription (Rx) Required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200">
      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
      No Prescription Needed
    </span>
  );
};
