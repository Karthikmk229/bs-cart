// src/pages/Orders.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Order, Address } from '../types';
import { ShoppingBag, ChevronRight, Loader2, ArrowRight, Phone, MessageSquare, Edit3, Trash2, MapPin, User, Home, Briefcase, Plus, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AddressForm } from '../components/AddressForm';
import { toast } from 'react-hot-toast';

export const Orders: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'orders' | 'notifications' | 'settings'>('orders');
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [selectedAddressForEdit, setSelectedAddressForEdit] = useState<Address | null>(null);

  // Query orders
  const { data: orders, isLoading: isLoadingOrders, error: orderError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data as Order[];
    },
  });

  // Query addresses
  const { data: addresses, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await api.get('/addresses');
      return res.data.data as Address[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-100';
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      default:
        return 'bg-sky-50 text-sky-800 border-sky-100';
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted successfully');
      refetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'addresses', label: 'Addresses', icon: 'location_on' },
    { id: 'orders', label: 'Orders', icon: 'package_2' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="space-y-6 pb-16 text-left">
      <h1 className="text-2xl font-black text-on-surface tracking-tight">My Account</h1>

      <div className="flex flex-col md:flex-row gap-lg">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-sm border border-outline-variant/30">
            <nav className="flex flex-col gap-xs">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id as any)}
                    className={`relative flex items-center gap-md p-md rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'text-primary font-bold bg-primary-container/10'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r" />}
                    <span className="material-symbols-outlined">{sec.icon}</span>
                    <span className="font-semibold text-xs">{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Panel */}
        <div className="flex-1 flex flex-col gap-lg">
          
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-xl border border-outline-variant/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-lg mb-lg">
                <div className="flex items-center gap-lg">
                  <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-black text-2xl uppercase border-2 border-secondary/20">
                    {getInitials(user?.name || 'Customer')}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-on-surface">{user?.name || 'Karthik M'}</h2>
                    <p className="text-on-surface-variant text-xs mt-0.5 font-bold">Platinum Member • Joined Jan 2024</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Profile changes are managed automatically via login settings.')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-container/20 hover:bg-primary-container/30 text-primary rounded-lg font-bold transition-all active:scale-95 text-xs shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm font-bold">edit</span>
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-md border-t border-slate-100 pt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <p className="font-bold text-sm text-on-surface">{user?.email || 'm.karthik@example.com'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <p className="font-bold text-sm text-on-surface">{user?.phone || '+91 95669 93875'}</p>
                </div>
              </div>
            </section>
          )}

          {/* ADDRESSES SECTION */}
          {activeSection === 'addresses' && (
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  Manage Saved Addresses
                </h3>
              </div>

              {isLoadingAddresses ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-surface-container-lowest rounded-xl shadow-sm p-lg border-2 border-outline-variant/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-md">
                          <span className="flex items-center gap-1.5 text-primary font-bold text-xs capitalize">
                            <span className="material-symbols-outlined text-sm">
                              {addr.type === 'home' ? 'home' : addr.type === 'work' ? 'work' : 'other'}
                            </span>
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">Default</span>
                          )}
                        </div>
                        <p className="text-on-surface font-semibold text-xs leading-relaxed text-left mb-6">
                          {addr.addressLine1}
                          {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                          <br />
                          {addr.city}, {addr.district}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                      <div className="flex gap-md pt-4 border-t border-slate-50">
                        <button
                          onClick={() => {
                            setSelectedAddressForEdit(addr);
                            setShowAddressForm(true);
                          }}
                          className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs font-bold text-on-surface-variant hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setSelectedAddressForEdit(null);
                      setShowAddressForm(true);
                    }}
                    className="bg-background border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary transition-all group min-h-[160px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined text-[32px]">add_location_alt</span>
                    </div>
                    <span className="font-bold text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                      Add New Address
                    </span>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ORDERS & LIVE TRACKING SECTION */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              
              {/* Live Order Tracking Map Overlay */}
              <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
                <div className="p-lg bg-primary/5 flex justify-between items-center flex-wrap gap-4">
                  <div className="text-left">
                    <span className="bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1.5 inline-block">
                      Active Order
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">Order #BS-9921</h3>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-primary font-bold flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-base">local_shipping</span>
                      Out for Delivery
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-bold mt-0.5">Arriving in ~12 mins (Tenkasi Express)</p>
                  </div>
                </div>

                <div className="relative h-[300px] w-full">
                  <img
                    className="w-full h-full object-cover"
                    alt="Live delivery tracking route map in Tenkasi district"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvHZO1XXanieFUuvpQlbUqdSsFq9ThYYsscUk7f44GPDUo0fnYKH-AZ8Q_gQrPplYVqqhqRIT-16dLREBz6R4vFGyFyLW1NsfL3pSN3uj3VDvX9WEYpSsJKBbNp5rItEGmW3mBKidizch58xLkUPqxj7BaPIr08hzLoE8SzYo5oYjueGQwzBO6mi9g7cXUBaOyxHq2fV9II0swYkBnGyA8MwC8OxFdlPSYsdraTHrIbuScJTa8e8jEn_CmydiD1sqP0ti1ZGMgvOw"
                  />
                  
                  {/* Delivery Partner Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg flex items-center justify-between border border-outline-variant">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-primary-container shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt="Delivery partner portrait Arjun K"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDGcIm2suJbc9ZtQes0GYsgxBZktMLaLvfpcNLcp2boJQu6_p0ubOV2R7M3oph-RGcaICJJ94FHt3RwGwepTdn7AbZWxT3arb-og76X2J_G_IcWh5hgHLRn4xqHifJ5QTjd9D7SmcuR8hu5e7w2zHmKEaG05b606V2OidR9YfxCauIhcUvF77wcUdAKSTAJoprRtH8x7g4D_GqrptIhiaGZjbhOCyEKrOEYjVUi6kxcLgmSLQ_syaYvvFsJz99eoq7zXsyx-UooyQ"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-on-surface-variant font-bold">Delivery Partner</p>
                        <p className="font-bold text-on-surface text-sm">Arjun K.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="tel:+916000010002"
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-on-surface-variant"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toast.success('Chat function is opening in messaging dashboard.')}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-on-surface-variant"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Historical Orders list */}
              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-slate-800 text-sm">Past Order History</h4>
                
                {isLoadingOrders ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : orderError || !orders ? (
                  <p className="text-xs text-slate-400 font-semibold italic">Failed to load order history.</p>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-semibold">You have no historical orders.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-black text-slate-850 text-sm">{order.orderNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              order.paymentStatus === 'success' ? 'bg-emerald-55 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              PAYMENT: {order.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-3">
                            <span>Placed on: {formatDateTime(order.createdAt)}</span>
                            <span>•</span>
                            <span>Payment: <strong className="uppercase">{order.paymentMethod}</strong></span>
                          </div>
                          {order.items && order.items.length > 0 && (
                            <p className="text-xs text-slate-650 mt-1 font-semibold leading-relaxed">
                              {order.items.map((item) => `${item.productName} (${item.quantity})`).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 pt-3 md:pt-0 border-t border-slate-50 md:border-0">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Order Total</span>
                            <strong className="font-black text-slate-900 text-base">₹{order.total.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-xl border border-outline-variant/30 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-primary" /> Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Rx Verified</span>
                    <span className="text-[10px] text-slate-400 font-semibold">1 hour ago</span>
                  </div>
                  <p className="font-semibold text-on-surface-variant leading-relaxed">
                    Your prescription for Paracetamol 500mg has been verified by our pharmacist. It has been attached to your order successfully.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Order Delivered</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Yesterday</span>
                  </div>
                  <p className="font-semibold text-on-surface-variant leading-relaxed">
                    Your order #BS-9918 has been delivered successfully by Arjun K. Thank you for shopping with BS cart!
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Weekend Offer Live!</span>
                    <span className="text-[10px] text-slate-400 font-semibold">2 days ago</span>
                  </div>
                  <p className="font-semibold text-on-surface-variant leading-relaxed">
                    Claim up to 40% off on all pantry staples. Stock up for the week ahead with our Weekend Pantry Refill deal!
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-xl border border-outline-variant/30 space-y-6">
              <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <Settings className="w-4.5 h-4.5 text-primary" /> Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800">Email Notifications</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive order tracking receipts and slot updates.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800">SMS Alerts</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Get live delivery agent tracking SMS alerts on your mobile.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800">Language Preference</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Toggle default app navigation labels between English and Tamil.</p>
                  </div>
                  <div className="bg-surface-container-high rounded-full p-0.5 flex">
                    <button className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary text-white">EN</button>
                    <button className="px-3 py-1 rounded-full text-[10px] font-semibold text-slate-550">தமிழ்</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase transition-all shadow-md shadow-red-100 active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Account
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>

      </div>

      {/* Address Form modal for editing or creating */}
      {showAddressForm && (
        <AddressForm
          onClose={() => {
            setShowAddressForm(false);
            setSelectedAddressForEdit(null);
          }}
          onSuccess={refetchAddresses}
          initialData={selectedAddressForEdit}
        />
      )}

    </div>
  );
};
