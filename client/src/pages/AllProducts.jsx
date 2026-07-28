import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount' },
];

const AllProducts = () => {
  const { sellerProducts, productsLoading } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [sort, setSort] = useState('default');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeCategory = searchParams.get('category') || 'All';

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = useMemo(() => {
    let list = [...sellerProducts];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === 'price_asc') list.sort((a, b) => a.offerPrice - b.offerPrice);
    else if (sort === 'price_desc') list.sort((a, b) => b.offerPrice - a.offerPrice);
    else if (sort === 'discount') {
      list.sort((a, b) => (b.price - b.offerPrice) / b.price - (a.price - a.offerPrice) / a.price);
    }

    return list;
  }, [activeCategory, search, sort]);

  const allCats = ['All', ...categories.map((c) => c.path)];

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">

      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#16D291] mb-1">Store</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Products</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} products found</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 hover:border-[#16D291] transition-colors px-4 py-2.5 rounded-xl">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none cursor-pointer hover:border-[#16D291] transition-colors"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          Filter
        </button>
      </div>

      <div className="flex gap-8">

        {/* Sidebar — desktop */}
        <aside className="hidden sm:block w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Categories</h3>
            <ul className="flex flex-col gap-1">
              {allCats.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#16D291] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileFilterOpen(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-fadeInUp"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-gray-800 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {allCats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setMobileFilterOpen(false); }}
                    className={`px-4 py-2 rounded-full text-bold font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#16D291] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="flex items-center justify-center py-24">
              <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">Try a different search or category</p>
              <button
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="mt-4 px-6 py-2.5 bg-[#16D291] hover:bg-[#16D291] text-white rounded-full text-sm font-semibold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
