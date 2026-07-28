import { useAppContext } from '../contexts/AppContext';
import ProductCard from './ProductCard';

const BestSellers = () => {
  const { navigate, sellerProducts, productsLoading } = useAppContext();
  const products = sellerProducts.slice(0, 8);

  if (productsLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="flex items-center justify-center py-16">
          <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#16D291] mb-1">Top Picks</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Best Sellers</h2>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#16D291] hover:text-[#12b87a] transition-colors"
        >
          View All
          <span className="text-base">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
        {products.map((product, i) => (
          <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="sm:hidden mt-6 text-center">
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-2.5 border border-[#16D291] text-[#16D291] font-semibold rounded-full text-sm hover:bg-[#f0fdf9] transition-colors"
        >
          View All Products →
        </button>
      </div>
    </section>
  );
};

export default BestSellers;
