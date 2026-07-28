import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import { useAppContext } from '../contexts/AppContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const { user, setUser, setShowUserLogin, navigate, getCartCount, isSeller, API } = useAppContext();

  const logout = async () => {
    try { await axios.post(`${API}/api/user/logout`); } catch {}
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-[15px] font-semibold tracking-wide transition-colors duration-200 ${
      isActive ? 'text-[#16D291]' : 'text-gray-700 hover:text-[#16D291]'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3.5">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-1.5 group">
          <div className="w-8 h-8 bg-[#16D291] rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#16D291] transition-colors duration-200">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#16D291]">Fresh</span>
            <span className="text-gray-800">Mart</span>
          </span>
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 text-xl">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>All Products</NavLink>
         
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-[#16D291] transition-colors duration-200 px-3.5 py-2 rounded-full text-xl w-44 lg:w-56">
            <img src={assets.search_icon} alt="Search" className="w-3.5 h-3.5 opacity-50" />
            <input
              className="bg-transparent outline-none placeholder-gray-400 text-gray-700 w-full text-sm"
              type="text"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/products?search=${encodeURIComponent(e.target.value.trim())}`);
                  e.target.value = '';
                }
              }}
            />
          </div>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Cart"
          >
            <img src={assets.nav_cart_icon} alt="Cart" className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold text-white bg-[#16D291] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-0.5">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Login / Profile */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-6 py-2 bg-[#16D291] hover:bg-[#12b87a] active:scale-95 transition-all duration-200 text-white text-sm font-semibold rounded-full shadow-sm"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={profileRef}>
              {/* Account trigger button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-[#16D291] hover:shadow-sm transition-all duration-200"
              >
                {/* Avatar circle with initial */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg,#16D291,#12b87a)' }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden lg:block max-w-[90px] truncate">{user.name}</span>
                {/* Chevron */}
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 animate-fadeInUp overflow-hidden">

                  {/* User info header */}
                  <div className="px-4 py-3 bg-[#f0fdf9] border-b border-[#d0f7eb]">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    {[
                      { label: 'My Orders',    icon: assets.order_icon, path: '/my-orders' },
                      { label: 'Address Book', icon: assets.box_icon,   path: '/addresses' },
                    ].map(({ label, icon, path }) => (
                      <button
                        key={label}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <img src={icon} alt="" className="w-4 h-4 opacity-60" />
                        </div>
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}

                    {/* Seller Dashboard — always visible, redirects to login if not seller */}
                    <button
                      onClick={() => { navigate(isSeller ? '/seller' : '/seller-login'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <img src={assets.product_list_icon} alt="" className="w-4 h-4 opacity-60" />
                      </div>
                      <span className="font-medium">Seller Dashboard</span>
                    </button>                  </div>

                  <div className="border-t border-gray-100 py-1.5">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => navigate('/cart')} className="relative p-1.5" aria-label="Cart">
            <img src={assets.nav_cart_icon} alt="Cart" className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold text-white bg-[#16D291] min-w-[16px] min-h-[16px] rounded-full flex items-center justify-center px-0.5">
                {getCartCount()}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-1.5">
            <img src={assets.menu_icon} alt="menu" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 flex flex-col gap-1 px-6 z-50 animate-fadeInUp">
          {[
            { to: '/', label: 'Home' },
            { to: '/products', label: 'All Products' },
            { to: '/cart', label: 'My Cart' },
            { to: '/my-orders', label: 'My Orders' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-[#16D291] bg-[#f0fdf9]' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-100">
            {!user ? (
              <button
                onClick={() => { setOpen(false); setShowUserLogin(true); }}
                className="w-full py-2.5 bg-[#16D291] hover:bg-[#16D291] text-white font-semibold rounded-full text-sm transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-full text-sm transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
