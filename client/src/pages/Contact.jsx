import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Contact = () => {
  const { setToast } = useAppContext();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setToast({ type: 'success', title: 'Message Sent!', message: "We'll get back to you within 24 hours." });
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#16D291' }}>Get in Touch</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Contact Us</h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
          Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto">

        {/* Contact info */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          {[
            {
              icon: '📍',
              title: 'Our Address',
              lines: ['123 Fresh Street', 'Market District', 'New York, NY 10001'],
            },
            {
              icon: '📞',
              title: 'Phone',
              lines: ['+1 (555) 123-4567', 'Mon–Sat: 8am – 8pm'],
            },
            {
              icon: '✉️',
              title: 'Email',
              lines: ['support@freshmart.com', 'We reply within 24 hours'],
            },
            {
              icon: '🚚',
              title: 'Delivery Hours',
              lines: ['Daily: 7am – 10pm', 'Express: Under 30 minutes'],
            },
          ].map(({ icon, title, lines }) => (
            <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#f0fdf9' }}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
                {lines.map((l, i) => <p key={i} className="text-xs text-gray-500">{l}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input
                  type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <input
                  type="email" value={form.email} required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Subject</label>
              <input
                type="text" value={form.subject} required
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea
                value={form.message} required rows={5}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more about your query..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400 resize-none"
              />
            </div>

            <button
              type="submit" disabled={sending}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: sending ? '#9ca3af' : 'linear-gradient(135deg,#16D291,#12b87a)', boxShadow: '0 4px 16px rgba(22,210,145,0.3)' }}
            >
              {sending ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Sending...</>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
