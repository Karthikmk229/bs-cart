// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usePincode } from '../context/PincodeContext';
import { useTheme } from '../context/ThemeContext';
import { PincodeChecker } from './PincodeChecker';
import { ChevronDown, ShieldAlert, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalQuantity } = useCart();
  const { pincode } = usePincode();
  const { theme, toggleTheme } = useTheme();
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Determine active tab based on query params or path
  const searchParams = new URLSearchParams(location.search);
  const productType = searchParams.get('productType');
  const isPharmacyActive = productType === 'medical' || location.pathname.includes('/prescriptions');
  const isGroceryActive = !isPharmacyActive && (location.pathname === '/' || location.pathname === '/products' || location.pathname === '/cart' || location.pathname === '/checkout');

  return (
    <>
      <header className="bg-[#f8f9ff] dark:bg-surface-container-lowest shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary flex items-center gap-1 select-none">
              &nbsp;BS cart
            </Link>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-6 items-center h-16">
              <Link
                to="/products?productType=grocery"
                className={`h-full flex items-center font-bold text-sm transition-colors border-b-2 ${
                  isGroceryActive
                    ? 'text-primary border-primary'
                    : 'text-[#3c4a42] hover:text-primary border-transparent'
                }`}
              >
                BS cart
              </Link>
              <Link
                to="/products?productType=medical"
                className={`h-full flex items-center font-bold text-sm transition-colors border-b-2 ${
                  isPharmacyActive
                    ? 'text-primary border-primary'
                    : 'text-[#3c4a42] hover:text-primary border-transparent'
                }`}
              >
                Pharmacy
              </Link>
              
              {/* Pincode selector */}
              <button
                onClick={() => setShowPinModal(true)}
                className="flex items-center gap-1 text-[#3c4a42] font-semibold text-xs transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>Pincode: {pincode || 'Select'}</span>
              </button>
            </nav>
          </div>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-6">
            
            {/* Search Input bar */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-[#e6eeff] px-4 py-1.5 rounded-full border border-[#bbcabf]/30">
              <span className="material-symbols-outlined text-[#3c4a42] text-[18px] mr-1">search</span>
              <input
                type="text"
                placeholder="Search fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs w-48 text-[#121c2a] placeholder-[#3c4a42]/60 p-0"
              />
            </form>

            {/* Actions Grid */}
            <div className="flex items-center gap-4">
              
              {/* Dark Mode Toggle Switch */}
              <button
                onClick={toggleTheme}
                className="p-2 text-[#3c4a42] hover:text-primary rounded-full hover:bg-slate-100/60 transition-colors flex items-center justify-center"
                aria-label="Toggle theme mode"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* English / Tamil Language Selector */}
              <div className="flex items-center bg-[#eff4ff] rounded-full p-0.5 border border-[#bbcabf]/30">
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    language === 'EN'
                      ? 'bg-primary text-white'
                      : 'text-[#3c4a42] hover:text-primary'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('TA')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    language === 'TA'
                      ? 'bg-primary text-white'
                      : 'text-[#3c4a42] hover:text-primary'
                  }`}
                >
                  தமிழ்
                </button>
              </div>

              {/* User Account / Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 p-1 rounded-full hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">
                      {user?.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#3c4a42]" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-150 overflow-hidden z-50">
                      <div className="px-4 py-2.5">
                        <p className="text-[10px] text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold truncate text-slate-800">{user?.name}</p>
                      </div>
                      
                      <div className="py-1 text-xs font-semibold">
                        <Link
                          to="/orders"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          My Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-1.5 px-4 py-2 text-amber-700 hover:bg-amber-50 font-bold"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="py-1 text-xs font-semibold">
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="flex w-full items-center gap-1.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#3c4a42] hover:text-primary rounded-full hover:bg-slate-100/60 transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </Link>
              )}

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative p-2 bg-primary text-white rounded-full hover:brightness-105 transition-all flex items-center justify-center shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-white ring-1 ring-white">
                    {totalQuantity}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* Pincode Modal Overlay */}
      {showPinModal && <PincodeChecker onClose={() => setShowPinModal(false)} />}
    </>
  );
};
