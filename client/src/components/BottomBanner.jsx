import { assets, features } from '../assets/assets';
import { useState } from 'react';

const BottomBanner = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '' | 'loading' | 'success' | 'error'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    // TODO: connect to real API
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };
  return (
    <div>
      {/* Why We Are the Best */}
      <section className="py-10 md:py-14">
        <div
          className="relative overflow-hidden rounded-3xl flex flex-col lg:flex-row items-center"
          style={{
            background: 'linear-gradient(135deg, #eafaf5 0%, #d4f5e9 100%)',
            minHeight: '520px',
          }}
        >
          {/* Left Image — visible from lg and up */}
          <div className="hidden lg:flex relative w-full lg:w-1/2 h-[320px] lg:h-[520px] items-end">
            <img
              src={assets.bottom_banner_image}
              alt="Fresh groceries"
              className="w-full h-full object-cover object-left"
            />
          </div>

          {/* Delivery Badge — visible from lg and up */}
          <div className="hidden lg:flex absolute bottom-14 left-[35%] bg-white rounded-full shadow-xl px-5 py-3 items-center gap-3 z-10">
            <img
              src={assets.delivery_truck_icon}
              alt=""
              className="w-12 h-12"
            />
            <div>
              <p className="text-bold font-semibold text-gray-800">
                Fast Delivery
              </p>
              <p className="text-sm text-gray-500">In 30 Min</p>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#16D291] mb-10">
              Why We Are the Best?
            </h2>

            <div className="space-y-7">
              {features.map(({ icon, title, description }) => (
                <div key={title} className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-[#16D291] rounded-xl flex items-center justify-center shadow-md">
                    <img
                      src={icon}
                      alt={title}
                      className="w-7 h-7 brightness-0 invert"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>

                    <p className="text-gray-500 mt-1 text-base">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
          Never Miss a Deal!
        </h2>

        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          Subscribe to get the latest offers, new arrivals, and exclusive
          discounts.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="mt-10 max-w-3xl mx-auto flex flex-col sm:flex-row bg-white rounded-full overflow-hidden border border-gray-200 shadow-md"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus(''); }}
            placeholder="Enter your email address"
            required
            className="flex-1 px-8 py-5 outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-[#16D291] hover:bg-[#12b87a] active:scale-95 transition-all text-white px-10 py-5 font-semibold disabled:opacity-70 flex items-center gap-2 justify-center"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Subscribing...
              </>
            ) : status === 'success' ? '✓ Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-sm font-semibold" style={{ color: '#16D291' }}>
            🎉 You're subscribed! Check your inbox for deals.
          </p>
        )}
      </section>
    </div>
  );
};

export default BottomBanner;
