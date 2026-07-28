import { assets } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';

const Banner = () => {
  const { navigate } = useAppContext();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Desktop banner */}
      <img
        src={assets.main_banner_bg}
        alt="FreshMart Banner"
        className="hidden md:block w-full object-cover min-h-[460px] max-h-[600px]"
      />
      {/* Mobile banner */}
      <img
        src={assets.main_banner_bg_sm}
        alt="FreshMart Banner"
        className="block md:hidden w-full object-cover min-h-[420px]"
      />

      {/* Gradient overlay — left-heavy so image stays visible on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32">

        {/* Badge */}
        <span className="animate-fadeInUp inline-flex items-center gap-1.5 w-fit mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white border border-white/30 bg-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16D291] inline-block" />
          100% Fresh &amp; Organic
        </span>

        {/* Heading */}
        <h1 className="animate-fadeInUp delay-100 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white max-w-sm md:max-w-lg lg:max-w-2xl">
          Fresh Groceries,
          <br />
          <span className="text-[#16D291]">Delivered Fast.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fadeInUp delay-200 mt-3 md:mt-5 text-sm md:text-base text-white/75 max-w-xs md:max-w-sm leading-relaxed">
          Vegetables, fruits, dairy &amp; more — straight from the source to your doorstep in under 30 minutes.
        </p>

        {/* Buttons */}
        <div className="animate-fadeInUp delay-300 mt-6 md:mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/products')}
            className="px-7 md:px-9 py-3 bg-[#16D291] hover:bg-[#16D291] active:scale-95 transition-all duration-200 text-white text-sm md:text-base font-semibold rounded-full shadow-lg shadow-[#16D291]/30"
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 px-7 md:px-9 py-3 text-white text-sm md:text-base font-semibold rounded-full border border-white/40 hover:bg-white/15 active:scale-95 transition-all duration-200 backdrop-blur-sm"
          >
            Explore Deals
            <img src={assets.white_arrow_icon} alt="" className="w-4 h-4" />
          </button>
        </div>

        {/* Mini stats */}
        <div className="animate-fadeInUp delay-400 mt-8 md:mt-10 flex items-center gap-6">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '30 min', label: 'Avg. Delivery' },
            { value: '500+', label: 'Products' },
          ].map(({ value, label }) => (
            <div key={label} className="text-white">
              <div className="text-lg md:text-xl font-bold leading-tight">{value}</div>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>
g      </div>
    </div>
  );
};

export default Banner;
