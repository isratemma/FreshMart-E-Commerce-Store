import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { assets } from '../assets/assets';

const DELIVERY_FEE = 5;
const FREE_DELIVERY_ABOVE = 30;

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, removeItemFromCart, setCartItems, currency, navigate, user, setShowUserLogin, sellerProducts } = useAppContext();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const PROMO_CODES = { FRESH20: 20, SAVE10: 10 };

  // Build cart items list from cartItems state
  const cartList = Object.entries(cartItems)
    .map(([id, qty]) => ({ product: sellerProducts.find((p) => p._id === id), qty }))
    .filter((item) => item.product);

  const subtotal = cartList.reduce((sum, { product, qty }) => sum + product.offerPrice * qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const discountAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal + deliveryFee - discountAmt;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (promoApplied) { setPromoMsg('A promo code is already applied.'); return; }
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoApplied(true);
      setPromoMsg(`✓ "${code}" applied — ${PROMO_CODES[code]}% off!`);
    } else {
      setPromoMsg('Invalid promo code. Try FRESH20 or SAVE10.');
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setPromoApplied(false);
    setPromoCode('');
    setPromoMsg('');
  };

  const handleCheckout = () => {
    if (!user) { setShowUserLogin(true); return; }
    // TODO: navigate to checkout / payment
    navigate('/checkout');
  };

  if (cartList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-3 rounded-full text-white font-semibold text-sm transition-all active:scale-95"
          style={{ background: '#16D291' }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#16D291' }}>Your</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-sm text-gray-400 mt-1">{cartList.length} item{cartList.length > 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left — Cart Items */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Column labels */}
          <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {cartList.map(({ product, qty }) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 p-4 grid grid-cols-12 gap-3 items-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image + name */}
              <div
                className="col-span-12 sm:col-span-6 flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <img src={product.image[0]} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 hover:text-[#16D291] transition-colors line-clamp-2">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  {product.price !== product.offerPrice && (
                    <span className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: '#16D291' }}>
                      {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="col-span-4 sm:col-span-2 text-center">
                <p className="text-sm font-semibold text-gray-700">{currency}{product.offerPrice}</p>
                {product.price !== product.offerPrice && (
                  <p className="text-xs text-gray-400 line-through">{currency}{product.price}</p>
                )}
              </div>

              {/* Qty controls */}
              <div className="col-span-5 sm:col-span-2 flex items-center justify-center">
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-gray-800 w-5 text-center">{qty}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold transition-colors"
                    style={{ background: '#16D291' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total + remove */}
              <div className="col-span-3 sm:col-span-2 flex flex-col items-end gap-1">
                <p className="text-sm font-bold text-gray-800">{currency}{(product.offerPrice * qty).toFixed(2)}</p>
                <button
                  onClick={() => removeItemFromCart(product._id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <button
            onClick={() => navigate('/products')}
            className="self-start flex items-center gap-2 text-sm font-semibold mt-2 transition-colors"
            style={{ color: '#16D291' }}
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Right — Order Summary */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

            {/* Promo code */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Promo Code</label>
              {promoApplied ? (
                <div className="flex items-center justify-between bg-[#f0fdf9] border border-[#d0f7eb] rounded-xl px-4 py-2.5">
                  <span className="text-sm font-semibold" style={{ color: '#16D291' }}>{promoCode.toUpperCase()}</span>
                  <button onClick={removePromo} className="text-xs text-red-400 hover:text-red-600 font-semibold">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoMsg(''); }}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#16D291] transition-colors"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                    style={{ background: '#16D291' }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoMsg && (
                <p className={`text-xs mt-2 font-medium ${promoApplied ? 'text-[#16D291]' : 'text-red-500'}`}>{promoMsg}</p>
              )}
            </div>

            <hr className="border-gray-100 mb-5" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartList.length} items)</span>
                <span className="font-semibold text-gray-800">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold" style={{ color: '#16D291' }}>FREE</span>
                ) : (
                  <span className="font-semibold text-gray-800">{currency}{deliveryFee.toFixed(2)}</span>
                )}
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between" style={{ color: '#16D291' }}>
                  <span>Promo Discount</span>
                  <span className="font-semibold">-{currency}{discountAmt.toFixed(2)}</span>
                </div>
              )}
              {subtotal < FREE_DELIVERY_ABOVE && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  Add <span className="font-semibold text-gray-700">{currency}{(FREE_DELIVERY_ABOVE - subtotal).toFixed(2)}</span> more for free delivery
                </p>
              )}
            </div>

            <hr className="border-gray-100 my-5" />

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-gray-900">{currency}{total.toFixed(2)}</span>
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide active:scale-95 transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg, #16D291, #12b87a)', boxShadow: '0 4px 16px rgba(22,210,145,0.35)' }}
            >
              Proceed to Checkout →
            </button>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {[
                { icon: assets.trust_icon, text: 'Secure Payment' },
                { icon: assets.refresh_icon, text: 'Easy Returns' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <img src={icon} alt="" className="w-3.5 h-3.5 opacity-50" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
