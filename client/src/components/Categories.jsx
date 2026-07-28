import { categories } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <section className="py-8 md:py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#16D291] mb-1">Browse by</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Shop by Category</h2>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#16D291] hover:text-[#12b87a] transition-colors"
        >
          View All
          <span className="text-base">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {categories.map(({ text, path, image, bgColor }, i) => (
          <button
            key={path}
            onClick={() => navigate(`/products?category=${path}`)}
            className="card-hover animate-fadeInUp flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border border-transparent hover:border-[#d0f7eb] cursor-pointer group"
            style={{
              backgroundColor: bgColor,
              animationDelay: `${i * 0.06}s`,
            }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={image}
                alt={text}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xs md:text-sm font-semibold text-gray-700 text-center leading-snug">
              {text}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
