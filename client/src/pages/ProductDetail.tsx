// src/pages/ProductDetail.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { usePincode } from '../context/PincodeContext';
import { toast } from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pincode } = usePincode();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeThumb, setActiveThumb] = useState<number>(0);

  // Fetch product detail
  const { data, isLoading, error } = useQuery({
    queryKey: ['product-detail', slug, pincode],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`, {
        params: { pincode: pincode || undefined },
      });
      return res.data.data;
    },
  });

  const product: Product = data?.product;

  // Initialize default variant
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const def = product.variants.find((v) => v.isDefault) || product.variants[0];
      setSelectedVariant(def);
    }
  }, [product]);

  // Handle Prescription Upload
  const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', file);

    setUploading(true);
    try {
      const res = await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Prescription uploaded and verified by our pharmacists!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      // Handled by context
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 animate-pulse space-y-8 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-100 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-100 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
            <div className="h-10 bg-slate-100 rounded-md w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center max-w-[1280px] mx-auto px-6">
        <h3 className="font-extrabold text-slate-800 text-lg">Failed to load product details</h3>
        <p className="text-xs text-slate-400 mt-1">Please try again later or return to home page.</p>
        <Link to="/" className="mt-4 inline-block px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm">
          Go Home
        </Link>
      </div>
    );
  }

  // Calculate pricing for active variant
  const sellingPrice = selectedVariant?.priceOverride !== null && selectedVariant?.priceOverride !== undefined
    ? selectedVariant.priceOverride
    : product.sellingPrice;

  // Calculate stock for selected variant at the warehouse servicing this pincode
  const variantInventory = selectedVariant?.inventories || [];
  const stockQty = variantInventory.reduce((sum, inv) => sum + inv.quantity, 0);
  const isOutOfStock = stockQty <= 0;

  const images = product.imageUrls || [];
  const imageUrl = images[activeThumb] || images[0] || 'https://placeholder.com';

  const discountPercent = product.mrp > sellingPrice
    ? Math.round(((product.mrp - sellingPrice) / product.mrp) * 100)
    : 0;

  // Mock related products
  const relatedProducts = [
    { name: 'Digital Thermometer MC-246', brand: 'Omron', price: '245.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYU8QJQWPOMzSTnaKpa7wRrWllGLQodveKy3qyTtDOMvi_yEruQ-dRrm5L4WXuV1gIL0Mfo8OdEcFV6EFwsGZGPS31_dj55ZU5SWnkvOFnDium7sbz94gCeZrK32SrCwtNBdH9D2BaT1ZaGXguXA4T_JJy1mD90AWJ9F7yZspcWIzb-T14lhAsxZgk1Q2m7YxYohxyl9r3LKiFQTTjPW9Awk-4ep30GijMjQZFyxIP_QXrx0wxHQLRjsQiBQVkpTP3FUycDyl_Lz0' },
    { name: 'Antiseptic Liquid 250ml', brand: 'Dettol', price: '124.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRfz0ffRYKIFg5KiJN1iBVzHW-By1jGX3GIfzXGxpFLwUUz1yF01aPkF1uQ01lV1MscxHJLeu7OgjAftzbxTQQWuJkAvJslLQqykgIyx71KThsw7BHeEgWtkaF0rncZoffwZa7mW5O1zjf8daNa53RHgccXeZSwfId3y-44lRNIae7-ZEfeERMXqFd5jEbQ8iuqKo19FVyI_aE4zEWRYrkmPCluly06iCiEAIA98XVCGFRzMPqlLXVkjVNDjJl8AZahr4UbNuk49U' },
    { name: 'Pain Relief Gel 30g', brand: 'Volini', price: '105.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL9DQb7Zbj6JQMtsvJfjVbuUflXy1ZV49d0Do8sPN_m8fYk-8526S4zSBaRUSwVGtKihhlaBIk9Vb1u-OMGnqrOxA3Aw-hBP7uKJ8FvnupGUyP0t6WfdKoQyyGt9c-lGqYBbCbF1B3zQk4Z1HGg5IbdDXEFQxD78EA2iXCPHxqA_yE_5ur88afbQuHEUqTP2GzP0Pr4B1b7A98-MDcKJj7LTI0PUhU_NDcoLrE7eqXoz-AjGrnW2Fqd2ykz9yUpflBBW16AQeC1b4' },
    { name: '3-Ply Mask (Pack of 50)', brand: 'Care3', price: '149.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg_FCtiNj2R7z1MJFyxsGQs2L5rEjJFmCwiOMp4ZAYriIuZp9BEzNMVa6k79sBLhoN8OT3um7G9r3Ttiv7X-p_JhfxTLyChOkRREiTMkwdc0oiN4HqrsfxsPtf07x-0nRrI0oPT-g7rxoMmw6nLiL6HXFaeaaX2MaHNX-40Q9nGnSJ52bC2vxya-GPyR8RNSSva6nsF5kN91kcE9rkdA9iWLUDt6TbPtul6fsDQhPCoi3_P8uyL7kdU4Qr_D2Hi_mKrxAeN4_cW4g' }
  ];

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-6 text-left">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 mb-6 text-xs font-semibold text-outline">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/products" className="hover:text-primary">
          {product.productType === 'medical' ? 'Pharmacy' : 'Groceries'}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Image Gallery Bento Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-white rounded-xl overflow-hidden border border-slate-200/50 shadow-xs flex items-center justify-center p-8 relative">
            <img
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              src={imageUrl}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg">
                  Out Of Stock
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnails grid */}
          <div className="grid grid-cols-3 gap-4">
            {images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`aspect-square rounded-lg border-2 bg-white flex items-center justify-center p-2 cursor-pointer transition-all ${
                  activeThumb === i ? 'border-primary' : 'border-slate-200/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  className="max-h-full max-w-full object-contain"
                  src={img}
                  alt={`Product thumbnail ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product details column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {product.productType === 'medical' ? 'Pharma Certified' : 'Vivasayam Harvest'}
              </span>
              <span className="text-outline font-bold text-[10px] tracking-wide">
                HSN: {product.hsnCode}
              </span>
            </div>
            <h2 className="font-bold text-2xl md:text-3xl text-on-surface leading-tight mb-1">
              {product.name}
            </h2>
            <p className="text-on-surface-variant font-semibold text-sm">
              by <span className="text-secondary font-bold">{product.manufacturer}</span>
            </p>
          </div>

          {/* Price details block */}
          <div className="p-6 bg-[#eff4ff] rounded-xl border border-slate-200/40 flex flex-col gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{sellingPrice}</span>
              {product.mrp > sellingPrice && (
                <span className="text-slate-400 line-through text-sm font-semibold">MRP ₹{product.mrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="bg-primary-container text-[#00422b] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[10px] text-outline font-semibold">Inclusive of all taxes. (Pack of {product.unit})</p>
            
            {product.requiresPrescription && (
              <div className="flex items-center gap-2 p-2.5 bg-[#ffddb8] rounded-lg text-[#855300]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  description
                </span>
                <span className="font-bold text-xs">Requires Valid Doctor's Prescription</span>
              </div>
            )}
          </div>

          {/* Conditional Prescription upload banner */}
          {product.requiresPrescription && (
            <div className="relative overflow-hidden bg-secondary text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="relative z-10 space-y-1 text-center md:text-left">
                <h3 className="font-bold text-sm md:text-base">Upload Prescription to Proceed</h3>
                <p className="text-white/80 text-xs font-semibold">எளிதாக மருந்து வாங்க உங்கள் பரிந்துரை சீட்டை இங்கே பதிவேற்றவும்</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 flex-shrink-0 w-full md:w-auto">
                <label className="cursor-pointer bg-white text-secondary px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all transform active:scale-95 shadow-md text-xs w-full md:w-auto">
                  <span className="material-symbols-outlined text-base">add_a_photo</span>
                  {uploading ? 'UPLOADING...' : 'UPLOAD NOW'}
                  <input
                    disabled={uploading}
                    className="hidden"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handlePrescriptionUpload}
                  />
                </label>
                <span className="text-[9px] text-white/75 font-semibold tracking-wide">SUPPORTED: PDF, JPG, PNG (Max 5MB)</span>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          )}

          {/* Quantity and Serviceability area */}
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            <div className="flex-1 flex flex-col gap-2">
              <span className="font-bold text-xs text-outline tracking-wide uppercase">Select Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-full w-fit bg-white p-0.5">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(prev => prev - 1)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-100 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="px-5 font-bold text-slate-800 text-xs w-20 text-center">{quantity} {product.productType === 'medical' ? 'Strip' : 'Item'}(s)</span>
                <button
                  disabled={isOutOfStock || (stockQty > 0 && quantity >= stockQty)}
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:brightness-105"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            <div className="flex-[2] flex flex-col gap-2">
              <span className="font-bold text-xs text-outline tracking-wide uppercase">Delivery Area</span>
              <div className={`flex items-center gap-2 p-2 border rounded-lg text-xs font-semibold ${
                pincode
                  ? 'border-primary/20 bg-primary/5 text-primary'
                  : 'border-amber-200 bg-amber-50 text-amber-800 animate-pulse'
              }`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {pincode ? 'task_alt' : 'error'}
                </span>
                <span>
                  {pincode 
                    ? `Delivery to ${pincode} available in 30 mins` 
                    : 'Set pincode above to check delivery speed'}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart button trigger */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:brightness-105 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined">shopping_basket</span>
            {adding ? 'ADDING...' : 'ADD TO CART'}
          </button>

        </div>
      </div>

      {/* Tabs and specifications */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Specifications detail block */}
        <div className="md:col-span-8 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200/50 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-3.5 border-b border-slate-100 pb-2">
              Product Description
            </h3>
            <p className="text-on-surface-variant font-medium text-xs md:text-sm leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ffddb8] flex items-center justify-center shrink-0 text-[#855300]">
                  <span className="material-symbols-outlined text-lg">thermostat</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Storage Condition</h4>
                  <p className="text-[10px] text-outline mt-0.5 leading-relaxed capitalize">
                    Store under {product.storageCondition} conditions. Keep away from direct sunlight.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d8e2ff] flex items-center justify-center shrink-0 text-[#0058be]">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Usage Warning</h4>
                  <p className="text-[10px] text-outline mt-0.5 leading-relaxed">
                    Check expiry date before consumption. Do not exceed the recommended storage shelf life of {product.shelfLifeDays || 7} days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Medical Specifications table */}
          {product.productType === 'medical' && (
            <section className="bg-[#eff4ff] p-6 rounded-xl border border-slate-200/40">
              <h3 className="font-bold text-slate-800 text-sm mb-3.5">Medical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-200/60 py-2">
                  <span className="text-outline">Active Ingredient</span>
                  <span className="text-slate-800 font-bold">Paracetamol (500mg)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 py-2">
                  <span className="text-outline">Consume Type</span>
                  <span className="text-slate-800 font-bold">Oral</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 py-2">
                  <span className="text-outline">Form</span>
                  <span className="text-slate-800 font-bold">Tablet</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 py-2">
                  <span className="text-outline">Schedule Type</span>
                  <span className="text-slate-800 font-bold">Schedule H Drugs</span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Side Panel helper */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-[#dee9fc] p-6 rounded-xl space-y-3 text-slate-800">
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              Fast Home Delivery
            </h4>
            <ul className="text-[11px] font-bold space-y-2.5 text-on-surface-variant">
              <li className="flex items-start gap-1">
                <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span>
                <span>Free delivery on orders above ₹500</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span>
                <span>Same-day delivery across Tamil Nadu</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span>
                <span>Discreet packaging for all medical items</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border-2 border-primary/20 p-6 rounded-xl space-y-3">
            <h4 className="font-bold text-secondary text-sm">Expert Consultation</h4>
            <p className="text-[11px] text-outline font-semibold leading-relaxed">
              Need help with your dosage? Speak to our certified pharmacists for free.
            </p>
            <a
              href="tel:+916000010000"
              className="w-full block text-center border-2 border-secondary text-secondary py-2 rounded-lg font-bold hover:bg-secondary hover:text-white transition-all text-xs"
            >
              Call Pharmacist
            </a>
          </div>
        </div>

      </div>

      {/* Frequently bought together Related Products */}
      <section className="mt-16 text-left">
        <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-[#121c2a] text-xl">Frequently Bought Together</h3>
            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">Top essentials for your home medicine cabinet</p>
          </div>
          <Link to="/products" className="text-primary font-bold flex items-center gap-0.5 hover:underline text-xs">
            View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-xs group hover:shadow-md transition-all flex flex-col justify-between">
              <div className="aspect-square bg-slate-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center p-3">
                <img className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" src={p.image} alt={p.name} />
              </div>
              <div>
                <p className="text-[10px] text-outline mb-1 font-semibold uppercase tracking-wider">{p.brand}</p>
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1 mb-2">{p.name}</h4>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="font-bold text-primary text-sm">₹{p.price}</span>
                <button
                  onClick={() => toast.success(`Added ${p.name} to cart!`)}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:brightness-105 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};
