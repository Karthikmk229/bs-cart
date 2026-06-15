// src/pages/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Address, Prescription, DeliverySlot } from '../types';
import { AddressForm } from '../components/AddressForm';
import { DeliverySlotPicker } from '../components/DeliverySlotPicker';
import { CouponInput } from '../components/CouponInput';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, Loader2, Landmark, Tag, AlertCircle, ShoppingBag, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subTotal, totalTax, requiresPrescription, clearCart } = useCart();

  // Step Data States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'other' | null>(null);
  const [notes, setNotes] = useState<string>('');

  // Coupon
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Modal Toggles
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [showMockGateway, setShowMockGateway] = useState<boolean>(false);
  const [gatewayData, setGatewayData] = useState<any>(null);

  // Loading States
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState<boolean>(false);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  
  // Direct prescription upload state
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [uploadingRx, setUploadingRx] = useState<boolean>(false);

  // Fetch initial setup
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await api.get('/addresses');
      const list = res.data.data || [];
      setAddresses(list);
      // Auto-select default address
      const def = list.find((a: Address) => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchPrescriptions = async () => {
    if (!requiresPrescription) return;
    setLoadingPrescriptions(true);
    try {
      const res = await api.get('/prescriptions');
      const list = res.data.data || [];
      setPrescriptions(list);
      // Auto-select approved prescription if available
      const approved = list.find((p: Prescription) => p.status === 'approved');
      if (approved) setSelectedPrescriptionId(approved.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchPrescriptions();
  }, [requiresPrescription]);

  // Selected address object
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);
  const activePincode = activeAddress?.pincode || '';

  // Rx Direct Upload
  const handleRxUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionFile) return;

    setUploadingRx(true);
    const formData = new FormData();
    formData.append('image', prescriptionFile);
    formData.append('doctorName', 'Local Healthcare Center');

    try {
      const res = await api.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Prescription uploaded successfully. Awaiting admin approval (in development you can approve it in admin panel).');
      setPrescriptionFile(null);
      await fetchPrescriptions();
      // Auto-select newly uploaded rx
      setSelectedPrescriptionId(res.data.data.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rx upload failed');
    } finally {
      setUploadingRx(false);
    }
  };

  // Checkout submission
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!selectedSlotId) {
      toast.error('Please select a delivery slot');
      return;
    }
    if (requiresPrescription && !selectedPrescriptionId) {
      toast.error('Prescription verification is required to place this order');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await api.post('/orders/checkout', {
        addressId: selectedAddressId,
        deliverySlotId: selectedSlotId,
        paymentMethod,
        couponCode: appliedCouponCode || undefined,
        prescriptionId: selectedPrescriptionId || undefined,
        notes: notes || undefined,
      });

      const { orderId, orderNumber, total, paymentDetails } = res.data.data;

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully (COD)');
        clearCart();
        navigate(`/order-confirmation?orderNumber=${orderNumber}`);
      } else {
        // Trigger mock online payment gateway modal
        setGatewayData({ orderId, orderNumber, total, ...paymentDetails });
        setShowMockGateway(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Handle Mock Payment Action
  const processMockPayment = async (status: 'success' | 'failed') => {
    try {
      const res = await api.post('/payments/verify', {
        razorpayOrderId: gatewayData.razorpayOrderId,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        status,
      });

      if (status === 'success') {
        toast.success('Online payment verified successfully!');
        clearCart();
        setShowMockGateway(false);
        navigate(`/order-confirmation?orderNumber=${gatewayData.orderNumber}`);
      } else {
        toast.error('Payment failed or cancelled. Please try again.');
        setShowMockGateway(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment verification failed');
    }
  };

  // Cost breakdown variables
  const deliveryCharge = activeAddress ? 40 : 0; // standard mock charge
  const rawTotal = subTotal + totalTax;
  const finalTotal = Math.max(0, Number((rawTotal - discountAmount + deliveryCharge).toFixed(2)));
  const cgstSplit = Number((totalTax / 2).toFixed(2));
  const sgstSplit = Number((totalTax / 2).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center max-w-sm mx-auto">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800 text-sm">Your cart is empty</h3>
        <button onClick={() => navigate('/products')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold uppercase">
          Go Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 text-left">
      <h1 className="text-2xl font-black text-on-surface tracking-tight">Secure Checkout</h1>

      {/* Prescription Banner (Conditional) */}
      {requiresPrescription && selectedPrescriptionId && (
        <div className="bg-secondary text-on-secondary p-md rounded-xl flex items-center gap-4 shadow-sm mb-6">
          <div className="bg-white/20 p-3 rounded-lg">
            <span className="material-symbols-outlined text-[32px] text-white">description</span>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-title-md text-title-md font-bold text-white text-sm">Prescription Verified</h3>
            <p className="font-body-md text-body-md text-white/90 text-xs mt-0.5">Your medical items require a prescription. Our pharmacists have verified your uploaded Rx for this order.</p>
          </div>
          <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Column: Checkout Details */}
        <div className="lg:col-span-8 space-y-lg">
          
          {/* Delivery Address */}
          <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-title-md text-title-md font-bold flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Delivery Address
              </h2>
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-secondary font-label-md text-label-md hover:underline font-bold text-xs"
              >
                Change/Add Address
              </button>
            </div>

            {loadingAddresses ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold">No addresses found. Add a delivery address to continue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-md border-2 rounded-xl text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/10'
                          : 'border-outline-variant hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-on-surface text-sm capitalize">{user?.name || 'Customer'} ({addr.type})</p>
                          <p className="text-on-surface-variant font-body-md text-xs mt-1 leading-relaxed">
                            {addr.addressLine1}
                            {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                            <br />
                            {addr.city}, {addr.district}, {addr.state} - <strong>{addr.pincode}</strong>
                            {user?.phone && <><br />Phone: {user.phone}</>}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Delivery Slot Picker */}
          {activePincode && (
            <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <DeliverySlotPicker
                pincode={activePincode}
                selectedSlotId={selectedSlotId}
                onSelectSlot={setSelectedSlotId}
              />
            </section>
          )}

          {/* Prescription Upload / Selection */}
          {requiresPrescription && (
            <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span className="material-symbols-outlined text-primary">description</span>
                Prescription Verification (Rx Items)
              </h3>

              <div className="bg-red-50 rounded-xl p-3.5 border border-red-150 flex gap-2.5 text-xs text-red-700">
                <ShieldAlert className="w-4.5 h-4.5 text-red-605 flex-shrink-0" />
                <div className="font-semibold leading-relaxed">
                  <strong>Important:</strong> You have prescription-only medical items in your cart. You must select an already approved prescription below, or upload a new one to be reviewed by our admin pharmacists.
                </div>
              </div>

              {/* Upload Direct form */}
              <form onSubmit={handleRxUpload} className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-600">Upload New Prescription</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary-container/10 file:text-primary hover:file:bg-primary-container/20 text-xs text-slate-500 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={uploadingRx || !prescriptionFile}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors disabled:opacity-40"
                  >
                    {uploadingRx ? 'Uploading...' : 'Upload Rx'}
                  </button>
                </div>
              </form>

              {/* Prescription List Selector */}
              {loadingPrescriptions ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : prescriptions.length === 0 ? (
                <p className="text-xs text-slate-400 italic font-semibold">No historical prescriptions found. Please upload a new prescription above.</p>
              ) : (
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Approved Prescription</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prescriptions.map((rx) => {
                      const isSelected = selectedPrescriptionId === rx.id;
                      const isApproved = rx.status === 'approved';
                      return (
                        <button
                          key={rx.id}
                          type="button"
                          disabled={!isApproved}
                          onClick={() => setSelectedPrescriptionId(rx.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            !isApproved
                              ? 'opacity-50 border-slate-100 bg-slate-50 cursor-not-allowed'
                              : isSelected
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/10'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-700">{rx.doctorName || 'Dr. Health Center'}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Uploaded: {new Date(rx.uploadedAt).toLocaleDateString('en-IN')}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rx.status.toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Payment Methods */}
          <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-md border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="font-title-md text-title-md font-bold text-sm">Payment Method</h2>
            </div>
            <div className="space-y-4">
              
              {/* UPI Options */}
              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <div className="p-4 bg-surface-container-low flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
                  <span className="font-bold text-on-surface text-sm">UPI (GPay / PhonePe / Paytm)</span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      setUpiProvider('gpay');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
                      paymentMethod === 'upi' && upiProvider === 'gpay'
                        ? 'border-secondary ring-2 ring-secondary/20 bg-secondary/5'
                        : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    <img alt="GPay" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWfW2eQ6RCMyeSyWMfZPCU9z59X_5qTsPPYO-Fn2FC0jWjefd4GU3YouUxzrGYDYZWEvhXKEGGXOYR4ffRjIKRBklyFa8qgRu2t2b9WrvGtsj8bNcVNybAMmDBjFs1PEqQfUD0NSmShkLkdFJJJ_Vi2lZO5FPrMOeNHMAcdXtHeWQbYz_yLMbDCjBxV3dF_r2tsc15sTFYMmMxwNOjOgi_-c8vYKguF-G_ZV_HxRdDsYIEVa65HBGhZ18AVTHrP3IPuFyUrENVCPU" />
                    <span className="text-[10px] font-bold">Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      setUpiProvider('phonepe');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
                      paymentMethod === 'upi' && upiProvider === 'phonepe'
                        ? 'border-secondary ring-2 ring-secondary/20 bg-secondary/5'
                        : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    <img alt="PhonePe" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEx6qWGqQCJsTcSQVmU81vilhVHcXWsOTlUTBEYtDIj1tM53Z0Ynr0v_zIMmtTC-IGBnF4mvh9IZ5UYkQ3EV6M9Z1H2pRC0kaM6rSLM_1TTy-Ji-pkDejR_HKMivzlAk3dMeigqgawYqEOub4YqfXyLqKNUfw_m22CqM7xfoSPJOVoI0YXFuTwoNHl08OcFSacD8lTI4g2hhyfxhNWnf9Z6sMQuF9XFicjsZdYGNEve4rRnzqM92FvExqjjFpOMdGzQgPg1kR3Ev4" />
                    <span className="text-[10px] font-bold">PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      setUpiProvider('paytm');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
                      paymentMethod === 'upi' && upiProvider === 'paytm'
                        ? 'border-secondary ring-2 ring-secondary/20 bg-secondary/5'
                        : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    <img alt="Paytm" className="h-4 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVwU3KF82yhzBrJpQc-SdLFqqTpSMQWMciftNTr0fsoTKZvpwT5Gs9yXpT5nrGj2Sxshxdvr4ee8GRO7RlmYsR2yNtAFqtcqiRoMnyWAzx60p18_BiZC9LUCJDluh68FuKa2twL915m1O1A9h6L9aQ9fIFpm91ZSd4XUc7Pt8MtatUmptl0m53HI39fatgTOqcy10cB9DBSWw7gRR50AjCl4Tmys5OZw06KEp-YAkASY9K3q2esovD3n2pTXTEtKszYqFKGZKCSVk" />
                    <span className="text-[10px] font-bold mt-1">Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      setUpiProvider('other');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
                      paymentMethod === 'upi' && upiProvider === 'other'
                        ? 'border-secondary ring-2 ring-secondary/20 bg-secondary/5'
                        : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">qr_code</span>
                    <span className="text-[10px] font-bold">Other UPI</span>
                  </button>
                </div>
              </div>

              {/* Card / COD Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center p-4 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4 text-primary opacity-50"
                  />
                  <div className="ml-4 flex items-center gap-3 opacity-50">
                    <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                    <span className="font-bold text-on-surface text-xs">Credit / Debit Card (Unavailable)</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => {
                      setPaymentMethod('cod');
                      setUpiProvider(null);
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                    <span className="font-bold text-on-surface text-xs">Cash on Delivery</span>
                  </div>
                </label>
              </div>

            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-md">
            <h2 className="font-title-md text-title-md font-bold text-sm mb-2 text-left">Order Summary</h2>
            
            {/* Items Brief */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar border-b border-outline-variant pb-md">
              {cartItems.map((item) => {
                const images = item.productVariant.product.imageUrls;
                const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : '';
                const itemPrice = item.productVariant.priceOverride ?? item.productVariant.product.sellingPrice;
                return (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img className="w-12 h-12 rounded-lg object-cover bg-surface-container flex-shrink-0" src={imageUrl} alt={item.productVariant.product.name} />
                    <div className="flex-1 text-left">
                      <p className="font-label-md text-label-md line-clamp-1 font-bold text-xs">{item.productVariant.product.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold">Qty: {item.quantity} • ₹{itemPrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <CouponInput
              subTotal={subTotal + totalTax}
              onCouponApplied={(code, discount) => {
                setAppliedCouponCode(code);
                setDiscountAmount(discount);
              }}
              onCouponRemoved={() => {
                setAppliedCouponCode('');
                setDiscountAmount(0);
              }}
              appliedCode={appliedCouponCode}
            />

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-2 text-xs font-semibold text-left">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal (Excl. Tax)</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span className="text-primary font-bold">FREE</span>
                ) : (
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                )}
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo Discount ({appliedCouponCode})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {/* GST Splits */}
              <div className="border-t border-outline-variant/30 my-2 pt-2 space-y-1">
                <div className="flex justify-between text-on-surface-variant text-[11px]">
                  <span>CGST (2.5%)</span>
                  <span>₹{cgstSplit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-[11px]">
                  <span>SGST (2.5%)</span>
                  <span>₹{sgstSplit.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm pt-2 border-t border-outline-variant text-on-surface">
                <span>Total Payable</span>
                <span className="text-secondary font-black">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Notes */}
            <div className="space-y-1 text-left pt-2">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Delivery Instructions (Optional)</label>
              <textarea
                placeholder="e.g. Leave package with security guard"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                rows={2}
              />
            </div>

            {/* Checkout Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-primary hover:bg-primary/95 text-on-primary py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-white disabled:opacity-40"
            >
              {placingOrder && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              Place Order &amp; Pay
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            
            <div className="flex items-center justify-center gap-2 text-on-surface-variant font-label-sm text-[10px] font-bold py-2">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              100% Safe &amp; Secure Payments
            </div>
          </div>
        </aside>

      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          onClose={() => setShowAddressForm(false)}
          onSuccess={fetchAddresses}
        />
      )}

      {/* Mock Razorpay Gateway processing Modal */}
      {showMockGateway && gatewayData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-slate-800 text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Landmark className="w-6 h-6 text-sky-400" />
              <span className="text-sm font-black text-slate-300 uppercase tracking-wider">Razorpay Mock Gateway</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <span className="text-xs text-slate-500">Order Number</span>
              <p className="font-bold text-white text-base mt-0.5">{gatewayData.orderNumber}</p>
              <span className="block text-xs text-slate-500 mt-2">Amount to pay</span>
              <p className="font-black text-sky-400 text-2xl mt-0.5">₹{gatewayData.total}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => processMockPayment('failed')}
                className="flex-1 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel / Fail
              </button>
              <button
                onClick={() => processMockPayment('success')}
                className="flex-1 py-3 bg-sky-500 text-slate-950 hover:bg-sky-400 rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 transition-colors"
              >
                Authorize &amp; Pay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
