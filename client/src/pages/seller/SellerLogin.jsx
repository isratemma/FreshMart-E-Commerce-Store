import { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';

const SellerLogin = () => {
  const { setIsSeller, navigate, API } = useAppContext();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/user/seller-login`, form);
      if (data.success) {
        setIsSeller(true);
        navigate('/seller');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-3" style={{ background: 'linear-gradient(135deg,#16D291,#12b87a)' }}>
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FreshMart Seller</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your seller dashboard</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#16D291,#12b87a)' }} />

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#16D291] focus-within:bg-white transition-all">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seller@freshmart.com"
                    required
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#16D291] focus-within:bg-white transition-all">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                style={{ background: loading ? '#9ca3af' : 'linear-gradient(135deg,#16D291,#12b87a)', boxShadow: '0 4px 16px rgba(22,210,145,0.35)' }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Demo seller credentials — contact admin for access.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          <button onClick={() => navigate('/')} className="font-semibold" style={{ color: '#16D291' }}>← Back to Store</button>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
