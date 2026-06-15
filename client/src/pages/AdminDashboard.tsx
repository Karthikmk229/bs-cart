// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order, Prescription } from '../types';
import { BarChart3, Package, FileText, ShoppingCart, Check, X, ShieldAlert, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'prescriptions' | 'orders'>('stats');

  // Stats State
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Products CRUD State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    brand: '',
    hsnCode: '',
    gstPercent: 18,
    mrp: 100,
    sellingPrice: 85,
    unit: '1 Unit',
    imageUrls: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    productType: 'grocery',
    requiresPrescription: false,
    isPerishable: false,
    shelfLifeDays: 30,
    storageCondition: 'ambient',
    manufacturer: 'Local Farmer Co',
    countryOfOrigin: 'India',
  });

  // Prescriptions Moderation
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Categories list
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Prescriptions
  const fetchPrescriptions = async () => {
    setLoadingPrescriptions(true);
    try {
      const res = await api.get('/admin/prescriptions');
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'prescriptions') fetchPrescriptions();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // Product actions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', newProduct);
      toast.success('Product and default variant created successfully');
      setShowAddProductModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  // Prescription Moderation (approve/reject)
  const handlePrescriptionReview = async (id: string, status: 'approved' | 'rejected') => {
    const adminRemarks = prompt(`Enter remarks for this ${status}:`) || '';
    try {
      await api.patch(`/admin/prescriptions/${id}/review`, { status, adminRemarks });
      toast.success(`Prescription ${status}`);
      fetchPrescriptions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  // Order status update
  const handleOrderStatusUpdate = async (id: string, status: string) => {
    const comment = prompt(`Enter comment for updating status to ${status}:`) || '';
    try {
      await api.patch(`/admin/orders/${id}/status`, { status, comment });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-medical-600" />
            Admin Operations Panel
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Control center for managing items, inventory, prescriptions, and order fulfillment.</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'stats') fetchStats();
            if (activeTab === 'products') fetchProducts();
            if (activeTab === 'prescriptions') fetchPrescriptions();
            if (activeTab === 'orders') fetchOrders();
            toast.success('Refreshed stats');
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'stats' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview Stats
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'prescriptions' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Rx Moderation
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Fulfill Orders
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Customers</span>
                <p className="text-3xl font-black text-slate-800 mt-2">{stats.userCount}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
                <p className="text-3xl font-black text-slate-800 mt-2">{stats.orderCount}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Catalog Items</span>
                <p className="text-3xl font-black text-slate-800 mt-2">{stats.productCount}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Rx</span>
                <p className="text-3xl font-black text-red-600 mt-2">{stats.pendingPrescriptions}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center col-span-2 md:col-span-1 bg-gradient-to-tr from-brand-600 to-emerald-500 text-white">
                <span className="text-xs font-bold text-brand-100 uppercase">Total Revenue</span>
                <p className="text-2xl font-black mt-2">₹{stats.totalRevenue}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Failed to load statistics.</p>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-base">Product Catalog</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Add New Product
            </button>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product details</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">GST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{p.name} ({p.unit})</td>
                      <td className="p-4 text-slate-500">{p.brand}</td>
                      <td className="p-4 font-extrabold text-slate-900">₹{p.sellingPrice}</td>
                      <td className="p-4 capitalize text-slate-500">{p.productType}</td>
                      <td className="p-4 text-slate-500">{p.gstPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-slate-800 text-base">Prescription Review Queue</h3>

          {loadingPrescriptions ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : prescriptions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No prescriptions uploaded for verification.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((rx) => {
                const isPending = rx.status === 'pending';
                return (
                  <div key={rx.id} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="font-bold text-slate-800 text-sm">Patient: {rx.user?.name || 'Customer'}</strong>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Uploaded: {new Date(rx.uploadedAt).toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                        rx.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : rx.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rx.status.toUpperCase()}
                      </span>
                    </div>

                    <a
                      href={`http://localhost:4000${rx.imageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs font-bold text-brand-600 hover:text-brand-850 bg-slate-50 border border-slate-100 p-3 rounded-xl text-center"
                    >
                      View Uploaded Document Link (New Tab)
                    </a>

                    {isPending && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePrescriptionReview(rx.id, 'rejected')}
                          className="flex-1 py-2 rounded-xl border border-red-500/20 text-red-600 hover:bg-red-50 font-bold text-xs uppercase"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handlePrescriptionReview(rx.id, 'approved')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-slate-800 text-base">Order Shipments Queue</h3>

          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No orders found in the database.</p>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Order details</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{o.orderNumber}</td>
                      <td className="p-4 text-slate-500">{o.user?.name || 'Customer'}</td>
                      <td className="p-4 font-extrabold text-slate-900">₹{o.total}</td>
                      <td className="p-4 uppercase text-slate-500">{o.paymentMethod} ({o.paymentStatus})</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : o.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 space-x-1.5">
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                          className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal Overlay */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm">Add New Catalog Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Premium Ponni Rice"
                    value={newProduct.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewProduct(prev => ({ ...prev, name, slug }));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  required
                  placeholder="Enter details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Type</label>
                  <select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, productType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="grocery">Grocery</option>
                    <option value="medical">Medical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    required
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Selling (₹)</label>
                  <input
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">GST (%)</label>
                  <input
                    type="number"
                    value={newProduct.gstPercent}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, gstPercent: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unit</label>
                  <input
                    type="text"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={newProduct.hsnCode}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, hsnCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={newProduct.manufacturer}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, manufacturer: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.requiresPrescription}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, requiresPrescription: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-600">Requires Rx Prescription</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isPerishable}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isPerishable: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-600">Perishable (Fresh)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
