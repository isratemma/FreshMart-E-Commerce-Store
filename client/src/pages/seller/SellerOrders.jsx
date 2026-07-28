import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';

const STATUS_OPTS = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
  'Order Placed':     { bg: '#eff6ff', text: '#3b82f6' },
  'Processing':       { bg: '#fef9c3', text: '#ca8a04' },
  'Out for Delivery': { bg: '#fff7ed', text: '#f97316' },
  'Delivered':        { bg: '#f0fdf9', text: '#16D291' },
  'Cancelled':        { bg: '#fef2f2', text: '#ef4444' },
};

const SellerOrders = () => {
  const { currency, orders, setOrders, API } = useAppContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API}/api/orders`);
        if (data.success) {
          const mapped = data.orders.map((o) => ({
            id: o._id,
            items: o.items.map((i) => ({
              product: { _id: i.productId, name: i.name, image: [i.image], category: i.category, offerPrice: i.offerPrice },
              qty: i.qty,
            })),
            total: o.total,
            payMethod: o.payMethod,
            address: o.address,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }),
          }));
          setOrders(mapped);
        }
      } catch { /* use local */ }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    try {
      await axios.put(`${API}/api/orders/${id}/status`, { status });
    } catch { /* revert silently */ }
  };

  if (orders.length === 0) {
    return (
      <div className="px-6 md:px-10 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">0 orders</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-700">No orders yet</h3>
          <p className="text-sm text-gray-400 mt-1">Orders placed by customers will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const sc = statusColors[order.status] || statusColors['Order Placed'];
          const addr = order.address;

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-5 flex-wrap">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Order ID</p>
                    <p className="text-sm font-bold text-gray-700">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Date</p>
                    <p className="text-sm font-semibold text-gray-700">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Payment</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.payMethod === 'cod' ? 'Cash on Delivery' : order.payMethod === 'card' ? 'Card' : 'UPI'}
                    </p>
                  </div>
                </div>

                {/* Status dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer transition-all"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Items */}
                <div className="flex-1 px-5 py-4 flex flex-col gap-3">
                  {order.items.map(({ product, qty }) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <img src={product.image[0]} alt={product.name} className="w-full h-full object-contain p-1" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category} · Qty: {qty}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 shrink-0">{currency}{(product.offerPrice * qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Customer address + total */}
                <div className="md:w-56 shrink-0 px-5 py-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">📍 Ship to</p>
                  {addr ? (
                    <>
                      <p className="text-sm font-bold text-gray-700">{addr.firstName} {addr.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{addr.street}</p>
                      <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="text-xs text-gray-500">{addr.country}</p>
                      <p className="text-xs text-gray-400 mt-1">📞 {addr.phone}</p>
                      <p className="text-xs text-gray-400">✉️ {addr.email}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No address provided</p>
                  )}
                  <hr className="border-gray-200 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-sm font-bold text-gray-800">{currency}{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerOrders;
