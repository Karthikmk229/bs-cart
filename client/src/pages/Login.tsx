// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Phone, Mail, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, adminLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Customer OTP states
  const [phone, setPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [testCodeMsg, setTestCodeMsg] = useState<string>('');

  // Staff Password states
  const [staffEmail, setStaffEmail] = useState<string>('');
  const [staffPassword, setStaffPassword] = useState<string>('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add Indian +91 format
    let cleanPhone = phone.trim();
    if (!cleanPhone.startsWith('+91')) {
      cleanPhone = `+91${cleanPhone}`;
    }

    const indianRegex = /^\+91[6-9]\d{9}$/;
    if (!indianRegex.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(cleanPhone);
      setOtpSent(true);
      toast.success('OTP sent successfully!');
      
      if (res?.testOtp) {
        setTestCodeMsg(`Test OTP code is: ${res.testOtp}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 4) {
      toast.error('OTP code must be 4 digits');
      return;
    }

    let cleanPhone = phone.trim();
    if (!cleanPhone.startsWith('+91')) {
      cleanPhone = `+91${cleanPhone}`;
    }

    setIsLoading(true);
    try {
      await verifyOtp(cleanPhone, otpCode, name || undefined, email || undefined);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail || !staffPassword) return;

    setIsLoading(true);
    try {
      await adminLogin(staffEmail, staffPassword);
      toast.success('Staff login successful!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid staff credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      
      {/* Brand info */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-saffron-600 to-medical-600 bg-clip-text text-transparent">
          TN Market
        </h1>
        <p className="text-xs text-slate-400">Grocery and medical portal for Tamil Nadu, India.</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl flex flex-col space-y-6">
        
        {/* Tab switch */}
        <div className="flex border-b border-slate-100 pb-1">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
              activeTab === 'customer'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-400'
            }`}
          >
            Customer OTP Login
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
              activeTab === 'staff'
                ? 'border-medical-600 text-medical-600'
                : 'border-transparent text-slate-400'
            }`}
          >
            Staff Portal
          </button>
        </div>

        {/* Customer OTP Form */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm font-bold tracking-wider"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-brand-100"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                
                {/* User Info inputs for Register */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="kumar@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="xxxx"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-bold py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {testCodeMsg && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-800 font-bold flex items-center gap-1.5 justify-center">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    {testCodeMsg}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setTestCodeMsg('');
                      setOtpCode('');
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Change Phone Number
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify &amp; Sign In
                </button>
              </form>
            )}
          </div>
        )}

        {/* Staff Password Portal Form */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@tnmarket.in"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-medical-100"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Access Staff Portal
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
