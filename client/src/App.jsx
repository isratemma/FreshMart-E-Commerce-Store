import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Toast from './components/Toast';
import { useAppContext } from './contexts/AppContext';

// Lazy load all pages — only downloaded when visited
const Home           = lazy(() => import('./pages/Home'));
const AllProducts    = lazy(() => import('./pages/AllProducts'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart           = lazy(() => import('./pages/Cart'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const MyOrders       = lazy(() => import('./pages/MyOrders'));
const AddressBook    = lazy(() => import('./pages/AddressBook'));
const Contact        = lazy(() => import('./pages/Contact'));

// Seller pages
const SellerLogin      = lazy(() => import('./pages/seller/SellerLogin'));
const SellerLayout     = lazy(() => import('./pages/seller/SellerLayout'));
const SellerDashboard  = lazy(() => import('./pages/seller/SellerDashboard'));
const SellerProducts   = lazy(() => import('./pages/seller/SellerProducts'));
const SellerOrders     = lazy(() => import('./pages/seller/SellerOrders'));
const SellerAddProduct = lazy(() => import('./pages/seller/SellerAddProduct'));

import SellerRoute from './components/SellerRoute';

// Minimal loading spinner shown between page transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  </div>
);

const App = () => {
  const location = useLocation();
  const { showUserLogin } = useAppContext();
  const isSellerPath = location.pathname.includes('seller');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toast />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/products"   element={<AllProducts />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart"       element={<Cart />} />
            <Route path="/checkout"   element={<Checkout />} />
            <Route path="/my-orders"  element={<MyOrders />} />
            <Route path="/addresses"  element={<AddressBook />} />
            <Route path="/contact"    element={<Contact />} />

            {/* Seller routes */}
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
              <Route index           element={<SellerRoute><SellerDashboard /></SellerRoute>} />
              <Route path="products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
              <Route path="orders"   element={<SellerRoute><SellerOrders /></SellerRoute>} />
              <Route path="add"      element={<SellerRoute><SellerAddProduct /></SellerRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
