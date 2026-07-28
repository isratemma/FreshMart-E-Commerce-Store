import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';
import { assets } from '../assets/assets';

const DELIVERY_FEE = 5;
const FREE_DELIVERY_ABOVE = 30;
const ic = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400';

const Checkout = () => {
  const { cartItems, currency, setCartItems, navigate, setOrders, sellerProducts, setToast, API, user, setShowUserLogin, clearCart } = useAppContext();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [address, setAddress] = useState({ firstName:'', lastName:'', email:'', phone:'', street:'', city:'', state:'', zip:'', country:'' });
  const [saveAddr, setSaveAddr] = useState(false);

  // Load saved addresses
  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/api/address`).then(({ data }) => {
      if (data.success && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        setSelectedAddr(def._id);
        setAddress(def);
      }
    }).catch(() => {});
  }, [user]);
  const [payMethod, setPayMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState('FM' + Math.floor(100000 + Math.random() * 900000));
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleAddr = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const cartList = Object.entries(cartItems)
    .map(([id, qty]) => ({ product: sellerProducts.find((p) => p._id === id), qty }))
    .filter((i) => i.product);

  const subtotal = cartList.reduce((s, { product, qty }) => s + product.offerPrice * qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (!user) { setShowUserLogin(true); return; }
    const req = ['firstName','lastName','email','phone','street','city','state','zip','country'];
    if (!req.every((k) => address[k].trim())) {
      setToast({ type: 'error', title: 'Missing Address', message: 'Please fill in all delivery address fields.' });
      return;
    }
    setPlacing(true);
    const snapshot = [...cartList];
    const orderTotal = total;

    try {
      // Save address to DB if checkbox checked
      if (saveAddr && user) {
        await axios.post(`${API}/api/address`, address).catch(() => {});
      }

      // Build items for API
      const items = snapshot.map(({ product, qty }) => ({
        productId:  product._id,
        name:       product.name,
        image:      product.image[0],
        category:   product.category,
        offerPrice: product.offerPrice,
        qty,
      }));

      const { data } = await axios.post(`${API}/api/orders`, {
        items, address, payMethod, total: orderTotal,
      });

      if (data.success) {
        const newOrder = {
          id: data.order._id, items: snapshot, total: orderTotal,
          payMethod, address, status: 'Order Placed',
          date: new Date().toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }),
        };
        setOrders((prev) => [newOrder, ...prev]);
        setConfirmedOrder(newOrder);
        await clearCart();
        setPlaced(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setToast({ type: 'error', title: 'Order Failed', message: data.message });
      }
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not place order. Try again.' });
    }
    setPlacing(false);
  };

  if (cartList.length === 0 && !placed) { navigate('/cart'); return null; }

  /* SUCCESS */
  if (placed) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg,#16D291,#12b87a)', boxShadow: '0 8px 32px rgba(22,210,145,0.35)' }}>
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Order Confirmed!</h2>
        <p className="text-sm text-gray-400 mb-1">Order ID: <span className="font-bold text-gray-600">{orderId}</span></p>
        <p className="text-sm text-gray-500 max-w-xs mt-2 mb-8">
          Your groceries will be delivered in under 30 minutes. Thank you for shopping with FreshMart!
        </p>

        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Order Details</h3>
          <div className="flex flex-col gap-3 mb-4">
            {(confirmedOrder?.items || []).map(({ product, qty }) => (
              <div key={product._id} className="flex items-center gap-3">
                <img src={product.image[0]} alt={product.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">{product.name}</p>
                  <p className="text-xs text-gray-400">Qty: {qty}</p>
                </div>
                <span className="text-xs font-bold text-gray-800">{currency}{(product.offerPrice * qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="border-gray-100 mb-3" />
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-gray-800">{currency}{(confirmedOrder?.total ?? total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-700">
              {payMethod === 'cod' ? 'Cash on Delivery' : payMethod === 'card' ? 'Credit / Debit Card' : 'UPI / Wallet'}
            </span>
          </div>
          {confirmedOrder?.address && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deliver to</span>
              <span className="font-semibold text-gray-700 text-right max-w-[180px]">
                {confirmedOrder.address.firstName} {confirmedOrder.address.lastName}, {confirmedOrder.address.city}
              </span>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/products')}
          className="px-8 py-3 rounded-full text-white font-semibold text-sm active:scale-95 transition-all"
          style={{ background: '#16D291' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  /* CHECKOUT FORM */
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#16D291' }}>Almost there</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">

          {/* 1. Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: '#16D291' }}>1</span>
              Delivery Address
            </h2>

            {/* Saved address picker */}
            {savedAddresses.length > 0 && (
              <div className="mb-5 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Saved Addresses</p>
                {savedAddresses.map((addr) => (
                  <label key={addr._id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddr === addr._id ? 'border-[#16D291] bg-[#f0fdf9]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="savedAddr" checked={selectedAddr === addr._id}
                      onChange={() => { setSelectedAddr(addr._id); setAddress(addr); }}
                      className="mt-0.5 accent-[#16D291]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{addr.firstName} {addr.lastName} {addr.isDefault && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1" style={{ background: '#f0fdf9', color: '#16D291' }}>Default</span>}</p>
                      <p className="text-xs text-gray-500">{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                      <p className="text-xs text-gray-400">{addr.phone}</p>
                    </div>
                  </label>
                ))}
                <button onClick={() => { setSelectedAddr(null); setAddress({ firstName:'', lastName:'', email:'', phone:'', street:'', city:'', state:'', zip:'', country:'' }); }}
                  className="text-xs font-semibold mt-1" style={{ color: '#16D291' }}>
                  + Use a different address
                </button>
              </div>
            )}

            {/* Address form — show when no saved addr selected or adding new */}
            {(!selectedAddr || savedAddresses.length === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name:'firstName', label:'First Name',      placeholder:'John' },
                  { name:'lastName',  label:'Last Name',       placeholder:'Doe' },
                  { name:'email',     label:'Email',           placeholder:'you@example.com', type:'email', span:2 },
                  { name:'phone',     label:'Phone',           placeholder:'+1 234 567 890',  type:'tel' },
                  { name:'street',    label:'Street Address',  placeholder:'123 Main St',     span:2 },
                  { name:'city',      label:'City',            placeholder:'New York' },
                  { name:'state',     label:'State',           placeholder:'NY' },
                  { name:'zip',       label:'ZIP Code',        placeholder:'10001' },
                  { name:'country',   label:'Country',         placeholder:'United States' },
                ].map(({ name, label, placeholder, type='text', span }) => (
                  <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                    <input name={name} type={type} value={address[name]} onChange={handleAddr} placeholder={placeholder} className={ic} />
                  </div>
                ))}
                {user && (
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-[#16D291]" />
                      <span className="text-xs text-gray-500 font-medium">Save this address for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: '#16D291' }}>2</span>
              Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { id:'cod',  label:'Cash on Delivery',   sub:'Pay when your order arrives', icon:'💵' },
                { id:'card', label:'Credit / Debit Card', sub:'Visa, Mastercard, Amex',      icon:'💳' },
                { id:'upi',  label:'UPI / Wallet',        sub:'GPay, PhonePe, Paytm',       icon:'📱' },
              ].map((pm) => (
                <label key={pm.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === pm.id ? 'border-[#16D291] bg-[#f0fdf9]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="pay" value={pm.id} checked={payMethod === pm.id} onChange={() => setPayMethod(pm.id)} className="accent-[#16D291]" />
                  <span className="text-2xl">{pm.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{pm.label}</p>
                    <p className="text-xs text-gray-400">{pm.sub}</p>
                  </div>
                  {payMethod === pm.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#16D291' }}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Card Number</label>
                  <input placeholder="1234 5678 9012 3456" className={ic} maxLength={19} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Expiry</label>
                  <input placeholder="MM / YY" className={ic} maxLength={7} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">CVV</label>
                  <input placeholder="•••" type="password" className={ic} maxLength={4} />
                </div>
              </div>
            )}

            {/* Place Order */}
            <button onClick={placeOrder} disabled={placing}
              className="mt-7 w-full py-4 rounded-2xl text-white font-bold text-base tracking-wide active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg,#16D291,#12b87a)', boxShadow: '0 6px 24px rgba(22,210,145,0.4)' }}>
              {placing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Placing your order...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Place Order · {currency}{total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Order Summary</h3>

            <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto pr-1">
              {cartList.map(({ product, qty }) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <img src={product.image[0]} alt={product.name} className="w-full h-full object-contain p-1.5" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {qty}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-800 shrink-0">{currency}{(product.offerPrice * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100 mb-4" />
            <div className="flex flex-col gap-2.5 text-sm mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className="font-semibold" style={{ color: deliveryFee === 0 ? '#16D291' : undefined }}>
                  {deliveryFee === 0 ? 'FREE' : `${currency}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {subtotal < FREE_DELIVERY_ABOVE && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  Add <span className="font-semibold text-gray-700">{currency}{(FREE_DELIVERY_ABOVE - subtotal).toFixed(2)}</span> more for free delivery
                </p>
              )}
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="flex justify-between items-center mb-5">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-gray-900">{currency}{total.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              {[
                { icon: assets.trust_icon, text: 'Secure' },
                { icon: assets.refresh_icon, text: 'Easy Returns' },
                { icon: assets.delivery_truck_icon, text: '30 min' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1 text-[11px] text-gray-400">
                  <img src={icon} alt="" className="w-3.5 h-3.5 opacity-40" />
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

export default Checkout;
