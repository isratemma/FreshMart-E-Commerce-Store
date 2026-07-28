import { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, currency } = useAppContext();
  const [imgIdx, setImgIdx] = useState(0);

  const qty = cartItems[product._id] || 0;
  const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);
  const imgSrc = product.image?.[imgIdx] || assets.upload_area;

  return (
    <div className="card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden group flex flex-col">
      {/* Image area */}
      <div
        className="relative bg-gray-50 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={product.image[imgIdx]}
          alt={product.name}
          className="w-full h-44 object-contain p-4 group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#16D291] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Image dots if multiple */}
        {product.image.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {product.image.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-[#16D291]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category tag */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {product.category}
        </span>

        {/* Name */}
        <h3
          className="text-sm font-semibold text-gray-800 leading-snug cursor-pointer hover:text-[#16D291] transition-colors line-clamp-2"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt=""
              className="w-3 h-3"
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.0)</span>
        </div>

        {/* Price + Cart — pushed to bottom */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-base font-bold text-gray-900">{currency}{product.offerPrice}</span>
            {product.price !== product.offerPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{currency}{product.price}</span>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={() => addToCart(product._id)}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-[#16D291] hover:bg-[#16D291] active:scale-95 text-white text-xs font-semibold rounded-full transition-all duration-200 shadow-sm shadow-[#d0f7eb]"
            >
              <img src={assets.add_icon} alt="" className="w-3.5 h-3.5 brightness-0 invert" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#f0fdf9] border border-[#d0f7eb] rounded-full px-2 py-1">
              <button
                onClick={() => removeFromCart(product._id)}
                className="w-5 h-5 rounded-full bg-[#16D291] hover:bg-[#16D291] text-white flex items-center justify-center text-sm font-bold leading-none transition-colors"
              >
                −
              </button>
              <span className="text-xs font-bold text-[#12b87a] w-4 text-center">{qty}</span>
              <button
                onClick={() => addToCart(product._id)}
                className="w-5 h-5 rounded-full bg-[#16D291] hover:bg-[#16D291] text-white flex items-center justify-center text-sm font-bold leading-none transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
