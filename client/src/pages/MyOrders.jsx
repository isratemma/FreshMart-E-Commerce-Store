import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const statusColors = {
  'Order Placed':     { bg: '#eff6ff', text: '#3b82f6', dot: '#3b82f6' },
  'Processing':       { bg: '#fef9c3', text: '#ca8a04', dot: '#ca8a04' },
  'Out for Delivery': { bg: '#fff7ed', text: '#f97316', dot: '#f97316' },
  'Delivered':        { bg: '#f0fdf9', text: '#16D291', dot: '#16D291' },
  'Cancelled':        { bg: '#fef2f2', text: '#ef4444', dot: '#ef4444' },
};

const MyOrders = () => {
  const { currency, navigate, API, user, orders, setOrders } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/orders/my`);
        if (data.success) {
          const apiOrders = data.orders.map((o) => ({
            id: o._id,
            items: o.items.map((i) => ({
              product: {
                _id: i.productId, name: i.name,
                image: [i.image], category: i.category, offerPrice: i.offerPrice,
              },
              qty: i.qty,
            })),
            total: o.total,
            payMethod: o.payMethod,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          }));
          setOrders(apiOrders);
        }
      } catch { /* use local orders */ }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="text-7xl mb-5">📦</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-400 text-sm mb-6">You haven't placed any orders. Start shopping!</p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-3 rounded-full text-white font-semibold text-sm active:scale-95 transition-all"
          style={{ background: '#16D291' }}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#16D291' }}>Account</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
      </div>

      <div className="flex flex-col gap-5">
        {orders.map((order) => {
          const sc = statusColors[order.status] || statusColors['Order Placed'];
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-bold text-gray-700">{order.id}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-700">{order.date}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.payMethod === 'cod' ? 'Cash on Delivery' : order.payMethod === 'card' ? 'Card' : 'UPI'}
                    </p>
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                  {order.status}
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4 flex flex-col gap-3">
                {order.items.map(({ product, qty }) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <img src={product.image[0]} alt={product.name} className="w-full h-full object-contain p-1.5" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-[#16D291] transition-colors truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{product.category} · Qty: {qty}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 shrink-0">{currency}{(product.offerPrice * qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 5-8-5M4 7v10l8 5 8-5V7" />
                  </svg>
                  {order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.reduce((s, i) => s + i.qty, 0) > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="text-base font-bold text-gray-800">{currency}{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
