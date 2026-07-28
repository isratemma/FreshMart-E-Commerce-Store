import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems, currency, sellerProducts } = useAppContext();

  const product = sellerProducts.find((p) => p._id === id);
  const related = sellerProducts
    .filter((p) => p.category === product?.category && p._id !== id)
    .slice(0, 4);

  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setImgIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="text-6xl mb-4">🥦</div>
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-5 px-7 py-2.5 text-white rounded-full text-sm font-semibold transition-colors"
          style={{ background: '#16D291' }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const qty = cartItems[product._id] || 0;
  const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);
  const imgSrc = product.image?.[imgIdx] || assets.upload_area;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <button onClick={() => navigate('/')} className="hover:text-[#16D291] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-[#16D291] transition-colors">Products</button>
        <span>/</span>
        <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-[#16D291] transition-colors">{product.category}</button>
        <span>/</span>
        <span className="text-gray-600 font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* Left — Images */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4">
          <div className="relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center aspect-square">
            <img src={imgSrc} alt={product.name} className="w-full h-full object-contain p-8 transition-opacity duration-300" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#16D291' }}>
                -{discount}% OFF
              </span>
            )}
          </div>

          {product.image.length > 1 && (
            <div className="flex gap-3">
              {product.image.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 flex items-center justify-center transition-all ${
                    i === imgIdx ? 'shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={i === imgIdx ? { borderColor: '#16D291' } : {}}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="w-full lg:w-[55%] flex flex-col gap-5">

          <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold border" style={{ background: '#f0fdf9', color: '#16D291', borderColor: '#d0f7eb' }}>
            {product.category}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">{product.name}</h1>

          {/* Star rating */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-4 h-4" />
            ))}
            <span className="text-sm text-gray-400 ml-1">(4.0)</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">{currency}{product.offerPrice}</span>
            {product.price !== product.offerPrice && (
              <>
                <span className="text-lg text-gray-400 line-through mb-0.5">{currency}{product.price}</span>
                <span className="text-sm font-bold mb-0.5" style={{ color: '#16D291' }}>You save {currency}{product.price - product.offerPrice}</span>
              </>
            )}
          </div>

          <hr className="border-gray-100" />

          <ul className="flex flex-col gap-2">
            {(product.description || []).map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#16D291' }} />
                {point}
              </li>
            ))}
          </ul>

          <hr className="border-gray-100" />

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.inStock ? '' : 'bg-red-400'}`} style={product.inStock ? { background: '#16D291' } : {}} />
            <span className={`text-sm font-semibold ${product.inStock ? '' : 'text-red-500'}`} style={product.inStock ? { color: '#16D291' } : {}}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1">
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product._id)}
                disabled={!product.inStock}
                className="flex items-center gap-2 px-8 py-3.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-bold rounded-full"
                style={{ background: '#16D291' }}
              >
                <img src={assets.add_icon} alt="" className="w-4 h-4 brightness-0 invert" />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-full px-4 py-3 border" style={{ background: '#f0fdf9', borderColor: '#d0f7eb' }}>
                <button onClick={() => removeFromCart(product._id)} className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold" style={{ background: '#16D291' }}>−</button>
                <span className="text-base font-bold w-6 text-center" style={{ color: '#12b87a' }}>{qty}</span>
                <button onClick={() => addToCart(product._id)} className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold" style={{ background: '#16D291' }}>+</button>
              </div>
            )}
            <button
              onClick={() => { addToCart(product._id); navigate('/cart'); }}
              className="px-8 py-3.5 border-2 hover:opacity-90 active:scale-95 transition-all font-bold rounded-full text-sm"
              style={{ borderColor: '#16D291', color: '#16D291' }}
            >
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: assets.delivery_truck_icon, text: 'Free Delivery', sub: 'On orders $30+' },
              { icon: assets.refresh_icon,        text: 'Easy Returns',  sub: 'Within 7 days' },
              { icon: assets.trust_icon,          text: '100% Fresh',    sub: 'Guaranteed' },
            ].map(({ icon, text, sub }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img src={icon} alt={text} className="w-5 h-5" />
                <span className="text-xs font-bold text-gray-700">{text}</span>
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description tab */}
      <div className="mt-14 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <h3 className="font-bold text-gray-800 mb-4">Product Description</h3>
        <ul className="flex flex-col gap-3">
          {(product.description || []).map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: '#d0f7eb', color: '#16D291' }}>{i + 1}</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-14">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#16D291' }}>More like this</p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <div key={p._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
