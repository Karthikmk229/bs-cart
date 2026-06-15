// src/pages/ProductListing.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { usePincode } from '../context/PincodeContext';
import { PincodeChecker } from '../components/PincodeChecker';

export const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pincode } = usePincode();
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [storageCondition, setStorageCondition] = useState<string>('ambient');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Ooty Farms']);
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get('sort') || 'relevance');
  const [page, setPage] = useState<number>(1);

  // Sync Search Query from URL SearchParams
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Products query
  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, priceRange, storageCondition, selectedBrands, sortOrder, pincode, page],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 12,
        sort: sortOrder,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (pincode) params.pincode = pincode;
      if (priceRange.min > 0) params.priceMin = priceRange.min.toString();
      if (priceRange.max < 500) params.priceMax = priceRange.max.toString();
      // Storage condition mappings
      if (storageCondition === 'chilled') params.perishable = 'true';

      const res = await api.get('/products', { params });
      return res.data.data;
    },
  });

  const handleApplyFilters = () => {
    const params: any = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (sortOrder) params.sort = sortOrder;
    setSearchParams(params);
    refetch();
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 500 });
    setStorageCondition('ambient');
    setSelectedBrands(['Ooty Farms']);
    setSortOrder('relevance');
    setSearchParams({});
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const products: Product[] = productsData?.products || [];
  const totalCount = productsData?.total || 0;

  // Format category display title
  const getCategoryTitle = () => {
    if (!selectedCategory) return 'Fresh Vegetables';
    return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div className="pb-16 text-left">
      {/* Serviceability Banner */}
      {pincode && (
        <section className="mb-xl">
          <div className="bg-primary-container text-on-primary-container px-lg py-sm rounded-xl flex flex-col md:flex-row justify-between items-center gap-md shadow-sm overflow-hidden relative border border-primary/10">
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            ></div>
            <div className="flex items-center gap-md relative z-10">
              <div className="bg-on-primary-container text-primary-container p-sm rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                <p className="font-title-md text-title-md font-bold">
                  Delivering to {pincode} (Chennai Central)
                </p>
                <p className="text-label-sm opacity-90">
                  Earliest slot: Today, 30 mins (Express Delivery)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPinModal(true)}
              className="bg-on-primary-container text-primary-container px-lg py-sm rounded-full font-label-md hover:opacity-90 transition-all relative z-10 active:scale-95"
            >
              Change Pincode
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-lg">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-xl">
            {/* Title */}
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
                {getCategoryTitle()}
              </h1>
              <p className="text-on-surface-variant text-label-md">
                {totalCount} items found
              </p>
            </div>
            {/* Category Groups */}
            <div className="space-y-lg border-t border-outline-variant pt-lg">
              {/* Filter: Sorting (Mobile visible select) */}
              <div className="md:hidden">
                <label className="font-label-md text-on-surface mb-sm block">
                  Sort By
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    handleApplyFilters();
                  }}
                  className="w-full bg-surface-container-low border-outline-variant rounded-lg font-label-md focus:ring-primary focus:border-primary"
                >
                  <option value="relevance">Popularity</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
              {/* Filter: Brand */}
              <div>
                <h3 className="font-title-md text-title-md mb-md flex justify-between items-center">
                  Brand
                  <span className="material-symbols-outlined text-outline">
                    keyboard_arrow_up
                  </span>
                </h3>
                <div className="space-y-sm max-h-48 overflow-y-auto custom-scrollbar pr-xs">
                  {['FreshMed Direct', 'Ooty Farms', 'Bio-Fresh Organic', 'Nilgiris Harvest'].map(
                    (brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-sm cursor-pointer group select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="rounded text-primary focus:ring-primary w-4 h-4 border-outline"
                        />
                        <span className="text-label-md text-on-surface-variant group-hover:text-on-surface">
                          {brand}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
              {/* Filter: Price Range */}
              <div>
                <h3 className="font-title-md text-title-md mb-md">Price Range</h3>
                <div className="px-sm">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value) || 500,
                      }))
                    }
                    className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-sm text-label-sm text-on-surface-variant">
                    <span>₹0</span>
                    <span>₹{priceRange.max === 500 ? '500+' : priceRange.max}</span>
                  </div>
                </div>
              </div>
              {/* Filter: Storage */}
              <div>
                <h3 className="font-title-md text-title-md mb-md">
                  Storage Condition
                </h3>
                <div className="flex flex-wrap gap-sm">
                  <button
                    onClick={() => setStorageCondition('chilled')}
                    className={`px-md py-xs rounded-full text-label-sm transition-colors ${
                      storageCondition === 'chilled'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                    }`}
                  >
                    Refrigerated
                  </button>
                  <button
                    onClick={() => setStorageCondition('ambient')}
                    className={`px-md py-xs rounded-full text-label-sm transition-colors ${
                      storageCondition === 'ambient'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                    }`}
                  >
                    Room Temp
                  </button>
                  <button
                    onClick={() => setStorageCondition('frozen')}
                    className={`px-md py-xs rounded-full text-label-sm transition-colors ${
                      storageCondition === 'frozen'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                    }`}
                  >
                    Frozen
                  </button>
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-on-surface-variant font-bold text-xs rounded-lg transition-colors border border-slate-200"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-grow">
          {/* Sorting & Top Bar */}
          <div className="hidden md:flex justify-between items-center mb-lg pb-md border-b border-outline-variant/30">
            <div className="flex gap-md">
              <button
                onClick={handleApplyFilters}
                className="font-label-md px-md py-sm rounded-lg bg-surface-container text-on-surface-variant flex items-center gap-xs hover:bg-slate-200 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">tune</span> Filter
              </button>
            </div>
            <div className="flex items-center gap-md">
              <span className="text-label-md text-on-surface-variant">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  handleApplyFilters();
                }}
                className="bg-transparent border-none focus:ring-0 font-label-md text-primary font-bold cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Bento Style Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid-gutter">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-slate-150 animate-pulse space-y-3"
                >
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
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-150 p-8 shadow-xs">
              <span className="material-symbols-outlined text-4xl text-slate-300">
                shopping_bag
              </span>
              <h4 className="font-bold text-slate-700 text-sm mt-1">No items found</h4>
              <p className="text-xs text-on-surface-variant font-semibold mt-0.5 max-w-xs mx-auto">
                {pincode
                  ? `There is no stock at the warehouse serving ${pincode}. Try changing location.`
                  : 'Location pincode is not set. Please set pincode above to check warehouse stock.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid-gutter">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-xl py-lg flex justify-center items-center gap-md">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="material-symbols-outlined p-sm border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 flex items-center justify-center w-9 h-9"
                >
                  chevron_left
                </button>
                <div className="flex gap-sm">
                  <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container text-on-surface-variant font-bold transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container text-on-surface-variant font-bold transition-colors">
                    3
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center">...</span>
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container text-on-surface-variant font-bold transition-colors">
                    12
                  </button>
                </div>
                <button
                  disabled={page * 12 >= totalCount}
                  onClick={() => setPage(page + 1)}
                  className="material-symbols-outlined p-sm border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 flex items-center justify-center w-9 h-9"
                >
                  chevron_right
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Prescription Upload Banner (Hybrid Context) */}
      <section className="mt-xl">
        <div className="bg-secondary text-on-secondary px-xl py-lg rounded-2xl flex flex-col md:flex-row items-center gap-lg shadow-lg">
          <div className="p-lg bg-on-secondary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px]">upload_file</span>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg mb-xs">
              Medicines &amp; Groceries Together
            </h2>
            <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
              Upload your prescription and we'll match it with your grocery list for a
              single delivery. Fast, safe, and convenient.
            </p>
          </div>
          <div className="flex flex-col gap-sm w-full md:w-auto">
            <button
              onClick={() => navigate('/prescriptions')}
              className="bg-surface text-secondary px-xl py-md rounded-full font-bold flex items-center justify-center gap-md hover:shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">camera_alt</span>
              Upload Prescription
            </button>
            <p className="text-[12px] text-center opacity-70">
              Certified Pharmacists available 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Pin Modal Checker Overlay */}
      {showPinModal && <PincodeChecker onClose={() => setShowPinModal(false)} />}
    </div>
  );
};
