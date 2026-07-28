import { useState } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../configs/firebase';
import { useAppContext } from '../contexts/AppContext';

const Login = () => {
  const { setShowUserLogin, setUser, API } = useAppContext();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/api/user/login' : '/api/user/register';
      const { data } = await axios.post(`${API}${endpoint}`, form);
      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;
      const { data } = await axios.post(`${API}/api/user/google-login`, { name: displayName, email });
      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. In your browser address bar, click the popup icon and select "Always allow popups from localhost".');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // User closed it — no message needed
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={() => setShowUserLogin(false)}
    >
      <div
        className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #16D291, #12b87a)' }} />

        {/* Tabs */}
        <div className="flex">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-4 text-sm font-bold tracking-wide transition-all duration-200 border-b-2"
              style={{
                color: mode === m ? '#16D291' : '#9ca3af',
                borderBottomColor: mode === m ? '#16D291' : 'transparent',
                background: mode === m ? '#f0fdf9' : 'white',
              }}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div className="px-8 pt-7 pb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'login' ? 'Sign in to continue shopping fresh' : 'Join thousands of happy FreshMart customers'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#16D291] focus-within:bg-white transition-all">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#16D291] focus-within:bg-white transition-all">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                {mode === 'login' && <button type="button" className="text-xs font-semibold" style={{ color: '#16D291' }}>Forgot password?</button>}
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#16D291] focus-within:bg-white transition-all">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6} className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3.5 rounded-xl text-white text-sm font-bold tracking-wide active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              style={{ background: loading ? '#9ca3af' : 'linear-gradient(135deg, #16D291, #12b87a)', boxShadow: '0 4px 16px rgba(22,210,145,0.35)' }}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Please wait...</>
              ) : mode === 'login' ? 'Login to FreshMart' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all text-sm font-semibold text-gray-700 shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-bold" style={{ color: '#16D291' }}>
              {mode === 'login' ? 'Sign up free' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
