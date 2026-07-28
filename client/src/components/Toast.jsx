import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Toast = () => {
  const { toast, setToast } = useAppContext();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const icons = {
    success: (
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#16D291' }}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fadeInUp">
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-xl px-4 py-3 min-w-[260px] max-w-xs">
        {icons[toast.type || 'success']}
        <div className="flex-1">
          {toast.title && (
            <p className="text-sm font-bold text-gray-800">{toast.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-gray-300 hover:text-gray-500 transition-colors ml-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 rounded-full mt-1 mx-1 overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{ background: '#16D291', animation: 'shrink 3s linear forwards' }}
        />
      </div>
    </div>
  );
};

export default Toast;
