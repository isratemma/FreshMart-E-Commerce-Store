import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SellerRoute = ({ children }) => {
  const { isSeller, authLoading } = useAppContext();

  // Wait for auth check to complete before redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    );
  }

  // Auth check done — if not seller, redirect to seller login
  if (!isSeller) {
    return <Navigate to="/seller-login" replace />;
  }

  return children;
};

export default SellerRoute;
