import { features } from '../assets/assets';

const TrustBar = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {features.map(({ icon, title, description }, i) => (
          <div
            key={title}
            className="animate-fadeInUp flex flex-col items-center text-center gap-3 p-5 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#d0f7eb] transition-all duration-300"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-12 h-12 bg-[#f0fdf9] rounded-xl flex items-center justify-center">
              <img src={icon} alt={title} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-0.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
