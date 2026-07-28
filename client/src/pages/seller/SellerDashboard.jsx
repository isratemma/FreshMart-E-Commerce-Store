import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    <div className="mt-3 h-1 rounded-full w-16" style={{ background: color }} />
  </div>
);

const SellerDashboard = () => {
  const { currency, sellerProducts, orders } = useAppContext();
  const allProducts = sellerProducts;
  const recentProducts = allProducts.slice(0, 5);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, Seller 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products"  value={allProducts.length}                       sub="Active listings"    color="#16D291" />
        <StatCard label="Total Orders"    value={orders.length}                             sub="All time"           color="#3b82f6" />
        <StatCard label="Revenue"         value={`${currency}${totalRevenue.toFixed(2)}`}  sub="All time"           color="#f59e0b" />
        <StatCard label="Categories"      value={7}                                         sub="Product categories" color="#8b5cf6" />
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Recent Products</h2>
          <Link to="/seller/products" className="text-xs font-semibold" style={{ color: '#16D291' }}>View All →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentProducts.map((p) => (
            <div key={p._id} className="flex items-center gap-4 px-6 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <img src={p.image[0]} alt={p.name} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{currency}{p.offerPrice}</p>
                <p className="text-xs text-gray-400 line-through">{currency}{p.price}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-50 text-[#16D291]' : 'bg-red-50 text-red-500'}`}>
                {p.inStock ? 'In Stock' : 'Out'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
