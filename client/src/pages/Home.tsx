import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePincode } from '../context/PincodeContext';
import { PincodeChecker } from '../components/PincodeChecker';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { pincode } = usePincode();
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'latest' | 'best'>('all');

  // Timer state for Flash Sale (5h 12m 30s in seconds)
  const [timeLeft, setTimeLeft] = useState<number>((5 * 3600) + (12 * 60) + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0'),
    };
  };

  const timeStr = formatTime(timeLeft);

  // Fetch featured products based on active pincode
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products', pincode],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: {
          pincode: pincode || undefined,
          limit: 8,
        },
      });
      return res.data.data;
    },
  });

  const featuredProducts: Product[] = data?.products || [];

  const categories = [
    {
      name: 'Fruits',
      slug: 'fruits',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWpksoVcCRzfeHv1QdVd6_U7AKyGAgK0TlU1gKmMeCZHHl3Y3NyCaQxq-rrf54cBRB1EFHIBrXRp8xtKQkRY3vSjJcUechg-0x_27o2FbJxeSPQac3WBXwYJZ028h7-Uh4EsCje1mkaju8YCQR7BZpvEVPpKHGrxe4-zzXsJl9NiiplLw13MNFf47GexzOZRzFTYhQc_HKlretg1Z0GE2gCm0nYHATGYFkVPz4K3XgOb0wrBqAZ355D-9dlgaVr4LODxFISTalSU8',
    },
    {
      name: 'Vegetables',
      slug: 'vegetables',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPROf0MJNIl12_03RB2hL-7IXN4xHPtMId5rzpMvBMF3i0pEr6H67sQhZBNutMYcQ556t81w3dCXoOy_CS0lsHA0rd-mhmvoVdesq83e2S4PMXssFT8YtR_3vtz6KnzeKTdlzmVQlNv3-VcJQmld8yUO1uGCkjyvFj429-tqaAWqBIXJnTpffCNwpw5USlJwkhw6CkP1Xk3VirX0lvwLSwp06UILVD_at1OgPMltL-0dfjHQ8BAElze5oDyXv0Y1lXzD6VxmR9xcI',
    },
    {
      name: 'Dairy',
      slug: 'dairy',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZOYA2KaMOtMJIy7ko-gdL3oDklshDoW88KAkAVV3UFsDUFfeuiIDGDr73NxXNAlp-4pcsVZp7WjApyQ7Ro8xzZilh2lvihYDW_AMM58sxG-O3PIjo68Q9gV3wjwGr3nGySKtBHvhONJLFh1V4epOx--5XDqJOqNvujs6jgyZbxZpMb0Mzl-hQVEzJDZIwlcU27Ma8YCgVE-xazjXnzxAF4R7Yo0kdKUEX1hTu5u1o_zpKb3QQY0_vo0wlripLq6FS6ukDnT08eCI',
    },
    {
      name: 'Staples',
      slug: 'staples',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdGjmLXein6wRuC1R3o1w87kQrX6I0ejPGC1EtljABMJ1_LLvhrjLjF9tAd6fvulsEV0SvW0ufNjgusoxB6NCmgWldBRHr1ehJROsa1FYGnG3IBCJg2gewsPFDNbVDI2Q6s-pna5-5aRsyw8CU25j_uXn_hMTwuSllCcuYwgos6KFU_gv-X416IJQZnHgULwWnxfPD3HnTcDpuDn6yQ9bmlHUgF6rPlmAtcVqXkZZirVZgMZpQgw-PRHi0v0cbkMyYVAOTnIJR1ak',
    },
    {
      name: 'Medicines',
      slug: 'medicines',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeI3N7BnkRXvsui47Q2PjheA2vnFmFmfACRCvpt0Mhc2fhM5_8iOTgrjkC7a46q5ACw6Ir7NAbPBoneNne6eK0-PDQx3wG3ZqpTHqJOYpu8m_40_nunVVmSuJGcVdNAbREz1zQKwmrbw5ea4jZcLHqLPz066zdw0Yc_VjHNVGCvlU8EOjvm4N_YaTQe9Jih1jQ31rN4wHCkOoRdlTpHvUEztDFNhsRUewOiao_k58yK95xUBEejB6Iqf1D7MAoOP60_GwaIiTQQJk',
    },
    {
      name: 'Personal Care',
      slug: 'personalcare',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB9sTRSZ1gOCc2lrKTcD7gEhZclFCzb0Xvf36vUN-ocLVGzufmotTeA8_0VrTFdtHq50SjqaCHVne0TZLT_tyzDK04ly8TDlqJ1d0wKEyfQ9OBN8NBLe49h0zHIdJ3LFnVsvv76Vx5jc07sjqGlkI5hJhYxyf87t4UJXsGdfnrZfS7uFtI0bW6azBIz3GNF9meMuEaNz0msuh1iqoyxWUj3sXRt-AYOMVb8n7v9z6rIvBJJDRmyNA6yzf08uYt0q2kyVm4bBGbPrM',
    },
  ];

  return (
    <div className="space-y-xl pb-16">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden min-h-[400px] md:min-h-[520px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Organic agricultural harvest backdrop"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChoXzEm5GkrmpdLLd04_B7vzP0VJylj0oyGSRQ8TQjt65K1OoJqzJnU2RUqHiH12v3lNgLHVF6T5gfMdXrQ4_k6875YcxXAa6GT1ndyOMXHTcFEVhmyyXYDP1rWQ9qcutAk2ym0Bg4vFXAUDURK6G5aJAgXRbnZ9fWW3Bx3Fyvu4oN_PnyuuQgOxDt7EOmg0fZElzFL3hd6QwetHAT9EaCvc53fnmMhckNig4Pr22iQimmeufy779jk-75Eozlto_Hhiu7dsfVRyQ"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full md:w-3/5 space-y-md p-md md:p-xl text-left">
          <div className="inline-flex items-center gap-sm bg-[#10b981] px-md py-base rounded-full text-white">
            <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
            <span className="font-bold text-xs">Govt. Certified Pharmacy</span>
          </div>
          
          <p className="text-secondary font-bold tracking-widest text-sm uppercase">
            Quick Delivery at your Door
          </p>
          
          <h1 className="font-bold text-[#121c2a] leading-tight text-3xl md:text-5xl">
            Explore Our <span className="text-primary">Fresh &amp; Safe</span> Essentials Collection
          </h1>
          
          <p className="text-sm md:text-base text-slate-700 max-w-md leading-relaxed font-semibold">
            Bringing the freshest farm produce and essential healthcare to your doorstep with <span className="font-bold text-secondary">Same-day delivery</span> across Tamil Nadu.
          </p>
          
          <div className="flex flex-wrap gap-md pt-md">
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-white px-xl py-md rounded-lg font-bold hover:scale-[0.98] transition-transform flex items-center gap-sm shadow-md"
            >
              Shop Now <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-white border-2 border-primary text-primary px-xl py-md rounded-lg font-bold hover:bg-primary-container/10 transition-colors"
            >
              View All Products
            </button>
          </div>
          
          {/* Avatar reviews group */}
          <div className="flex items-center gap-md pt-xl">
            <div className="flex -space-x-3">
              <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATVjOCUXdG89Y2KxTVp1S9uT0GD9zg444mEB8OHZR9T5Q7EjZB_kfWQLrylSbC7hbO6FaNLlQJa4HH1tEfKGF8pS7JkOZbUPy2PShkaTHFegLIob6qu5IAXAUUl0pTse2dOUFjlOQFCDg7TrrYYO778bkPi8ZPRb64QUq7rlmtPSwANK-OQPWjy_IeidGdu4z1EPEXWizm-fQ09RogRa623j5SCBzHnpVAQh8J4sZAPtKaSxVuVn73RQyiYDm-Sg5ot4tP4az3IEw" />
              <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_9oCvwYUB5aVenboaqVYCRdtzTu1pqJFMvzWdUIW6wR6IrbZ9DiCdS3nW3-fKj2tAXCi7Hc-0Gk0kTrqcLN4azZ_4f54GMyWyBl81e8Xe8mbmWfNkJnywAe8rzbw8ehstPMbkcp9E86bbPWBytefDPQ99HU3YFkVWiF6jffXtoZoOUtRdnfa9MOdOkgE82uXOUSgxcmG4EIOlS6CpEalMHyGQtOKyvEud4T-UUohDsFx35ZGTtTkQ7VAFQrKivjwVJN50-F_C8Po" />
              <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxYacpLK-j6uBJcBjlx4CAZ31fu2UcvD1HKxCG14bCAcCHG4I3PuU6uatKiOxcGiSvG26OQ8t4oNcdWXgX8L7a0M99KbM-ThHSAmtqnmvO7LoOxAwW5ZbQJniMZnlU5RqPyXdbYnWun_G5J6sw9YkfllwdS-Tq3RMRoRbeLUoq9qPzgMFa_zLoQspySkJdcgxQynQpORzre7bWx-zGQFcTJhcXLKDzPc6dhH5z1NtQ8pAbNrxUjA15uVwiy3qvoaukqwE7e0g3PTA" />
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-primary">+15k</div>
            </div>
            <div>
              <div className="flex text-tertiary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 0.5' }}>star_half</span>
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">4.9 Ratings+ (50k+ Customers)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter py-md">
        <div className="flex items-center gap-md p-md bg-white border border-outline-variant/30 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-800">Free Shipping</h4>
            <p className="text-xs text-on-surface-variant">On orders above ₹500</p>
          </div>
        </div>
        <div className="flex items-center gap-md p-md bg-white border border-outline-variant/30 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-800">Flexible Payment</h4>
            <p className="text-xs text-on-surface-variant">Multiple secure options</p>
          </div>
        </div>
        <div className="flex items-center gap-md p-md bg-white border border-outline-variant/30 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">headset_mic</span>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-800">24x7 Support</h4>
            <p className="text-xs text-on-surface-variant">Dedicated pharmacists</p>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <section className="space-y-lg text-left">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-primary font-bold tracking-widest text-sm uppercase">Quick Access</p>
            <h2 className="font-headline-lg text-headline-lg">Shop by Category</h2>
          </div>
          <button onClick={() => navigate('/products')} className="text-primary font-bold flex items-center gap-xs">
            See All <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-grid-gutter">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group cursor-pointer block"
            >
              <div className="aspect-square rounded-2xl bg-white shadow-sm overflow-hidden flex items-center justify-center p-md group-hover:shadow-md transition-shadow mb-sm border border-outline-variant/30">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className="text-center font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Prescription Upload Banner */}
      <section className="bg-secondary p-xl rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white shadow-lg text-left">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>
              description
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-lg text-headline-lg">Fast-Track Your Prescription</h3>
            <p className="font-body-lg text-body-lg opacity-90 max-w-lg">
              Upload your prescription and let our certified pharmacists handle the rest. Safety and accuracy guaranteed for all orders.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/prescriptions')}
          className="relative z-10 mt-xl md:mt-0 bg-white text-secondary px-xl py-md rounded-lg font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-sm active:scale-95"
        >
          <span className="material-symbols-outlined">upload_file</span>
          Upload Prescription
        </button>
      </section>

      {/* Flash Sale Section */}
      <section className="space-y-lg py-xl text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-lg">
          <div className="flex items-center gap-lg flex-wrap">
            <h2 className="font-headline-lg text-headline-lg text-error flex items-center gap-sm">
              <span className="material-symbols-outlined text-4xl">bolt</span> Flash Sale!
            </h2>
            <div className="flex gap-sm items-center">
              <div className="bg-error text-white w-10 h-12 flex flex-col items-center justify-center rounded-lg shadow-xs">
                <span className="text-lg font-bold leading-none">{timeStr.h}</span>
                <span className="text-[8px] uppercase font-bold mt-1">Hrs</span>
              </div>
              <div className="bg-error text-white w-10 h-12 flex flex-col items-center justify-center rounded-lg shadow-xs">
                <span className="text-lg font-bold leading-none">{timeStr.m}</span>
                <span className="text-[8px] uppercase font-bold mt-1">Min</span>
              </div>
              <div className="bg-error text-white w-10 h-12 flex flex-col items-center justify-center rounded-lg shadow-xs">
                <span className="text-lg font-bold leading-none">{timeStr.s}</span>
                <span className="text-[8px] uppercase font-bold mt-1">Sec</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-sm overflow-x-auto no-scrollbar pb-sm md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-md py-xs rounded-full font-bold transition-all text-sm ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-md py-xs rounded-full font-bold transition-all text-sm ${
                activeTab === 'latest'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab('best')}
              className={`px-md py-xs rounded-full font-bold transition-all text-sm ${
                activeTab === 'best'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10'
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* Featured Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-grid-gutter">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-outline-variant/20 animate-pulse space-y-3">
                <div className="aspect-square bg-slate-100 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-100 rounded-md w-1/3"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-outline-variant/30 p-6">
            <span className="material-symbols-outlined text-4xl text-slate-350">shopping_bag</span>
            <h4 className="font-bold text-slate-700 text-sm mt-1">No products found</h4>
            <p className="text-xs text-slate-450 font-semibold mt-0.5">Please check back later or modify your active pincode settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bento Grid Promotions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter text-left">
        <div className="md:col-span-2 relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
          <img
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt="Organic food flatlay layout"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8NxiDmjn6h8u1gq3Qlx5zyFQ4i_sMh1eMCmjrHlBJIZeth1U5_HXMqgSYsZ_BSQAeZWhAPxjPL6E0-whttEirXzwZr6EliF2U6ikMqXpGA7ZHXT7Pb74jspqtbwl49Y0B17FjW-SKWht_JXaZJGTSJIhiJsV_LjOV2BXmFAkP5GZsnSDGjkkPPZsc-69_nuYcyUHPiWU9fqhAdnHL3d93-bC5UcZD4I5peJtVLET8gbauuO4W2LynRnLVQ6NUK0JQJjhcoYq7Zb8"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-xl">
            <div className="text-white space-y-sm">
              <h3 className="font-headline-lg text-headline-lg">Weekend Pantry Refill</h3>
              <p className="font-body-md opacity-90">
                Up to 40% off on all pantry staples. Stock up for the week ahead!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary text-white hover:brightness-105 px-lg py-sm rounded-lg font-bold text-xs uppercase shadow-md active:scale-95"
              >
                Claim Deal
              </button>
            </div>
          </div>
        </div>
        
        <div
          onClick={() => navigate('/products?productType=medical')}
          className="relative h-64 rounded-2xl overflow-hidden bg-secondary shadow-sm flex flex-col justify-end p-xl group cursor-pointer text-left"
        >
          <div className="absolute top-0 right-0 p-lg opacity-20 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-white text-[120px]">
              vaccines
            </span>
          </div>
          <div className="relative z-10 text-white space-y-sm">
            <h3 className="font-title-md text-title-md">Health First</h3>
            <p className="text-sm opacity-90">
              Flat 20% off on First Aid &amp; Wellness essentials.
            </p>
            <button className="text-white border-b border-white font-bold inline-block text-xs pb-0.5 hover:border-white">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Pincode Alert Checker */}
      {showPinModal && <PincodeChecker onClose={() => setShowPinModal(false)} />}
    </div>
  );
};
