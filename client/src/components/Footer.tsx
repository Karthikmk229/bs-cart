// src/components/Footer.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) return;

    setSubmitting(true);
    try {
      await api.post('/newsletter/subscribe', { email: targetEmail });
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-surface-container-low dark:bg-[#121c2a] border-t border-outline-variant dark:border-slate-800 mt-16 pb-16 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12 max-w-[1280px] mx-auto text-left">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary dark:text-primary-fixed">BS cart</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Your trusted partner for fresh local produce and vital healthcare in Tamil Nadu.
          </p>
          <p className="text-primary font-bold text-xs italic">
            Quick Delivery at your Door
          </p>
          <div className="flex gap-3 pt-2">
            <button className="material-symbols-outlined text-primary p-2 rounded-full bg-surface-container-highest hover:opacity-80 transition-opacity">
              public
            </button>
            <button className="material-symbols-outlined text-primary p-2 rounded-full bg-surface-container-highest hover:opacity-80 transition-opacity">
              mail
            </button>
            <button className="material-symbols-outlined text-primary p-2 rounded-full bg-surface-container-highest hover:opacity-80 transition-opacity">
              phone
            </button>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-bold text-on-surface text-sm mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#about">
                About BS cart
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#laws">
                Pharmacy Laws
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#support">
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Information */}
        <div>
          <h3 className="font-bold text-on-surface text-sm mb-4">Information</h3>
          <ul className="space-y-3">
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#terms">
                Terms of Sale
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#privacy">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#shipping">
                Shipping Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h3 className="font-bold text-on-surface text-sm">Newsletter</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
            Stay updated with fresh arrivals and health tips.
          </p>
          <form onSubmit={handleSubscribe} className="flex bg-white rounded-full p-1 border border-outline-variant max-w-xs relative items-center">
            <input
              className="bg-transparent border-none focus:ring-0 px-4 flex-grow text-xs text-on-surface font-semibold focus:outline-none placeholder-slate-400 disabled:opacity-50"
              placeholder="Email address"
              type="email"
              required
              disabled={submitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center material-symbols-outlined hover:brightness-105 transition-all shadow-sm disabled:opacity-50"
            >
              {submitting ? 'hourglass_empty' : 'send'}
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Centered */}
      <div className="max-w-[1280px] mx-auto px-6 py-6 border-t border-outline-variant/30 text-center">
        <p className="text-on-surface-variant text-xs font-semibold">
          © 2024 BS cart. Certified Pharmacy &amp; Grocery Delivery. Lic: TN-CHE-2023.
        </p>
      </div>
    </footer>
  );
};
