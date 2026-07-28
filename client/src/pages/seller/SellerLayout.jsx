import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';
import { assets } from '../../assets/assets';

const navItems = [
  { to: '/seller',          label: 'Dashboard',    icon: assets.product_list_icon, end: true },
  { to: '/seller/products', label: 'Products',     icon: assets.product_list_icon },
  { to: '/seller/orders',   label: 'Orders',       icon: assets.order_icon },
  { to: '/seller/add',      label: 'Add Product',  icon: assets.add_icon },
];

const SellerLayout = () => {
  const { setIsSeller, navigate, API } = useAppContext();

  const logout = async () => {
    try { await axios.post(`${API}/api/user/seller-logout`); } catch {}
    setIsSeller(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#16D291' }}>
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">FreshMart</p>
            <p className="text-[10px] text-gray-400 font-medium">Seller Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg,#16D291,#12b87a)' } : {}}
            >
              <img src={icon} alt="" className={`w-4 h-4`} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Go to Store */}
        <div className="px-3 pb-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
            </svg>
            Go to Store
          </button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
