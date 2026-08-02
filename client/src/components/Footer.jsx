import { useNavigate } from 'react-router-dom';
import { footerLinks } from '../assets/assets';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#16D291] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#16D291]">Fresh</span>
              <span className="text-white">Mart</span>
            </span>
          </button>
          <p className="text-sm leading-relaxed text-gray-500 mb-5">
            Your trusted online grocery store. Fresh produce delivered to your doorstep in under 30 minutes.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { label: 'FB', href: 'https://facebook.com' },
              { label: 'IG', href: 'https://instagram.com' },
              { label: 'TW', href: 'https://twitter.com' },
              { label: 'YT', href: 'https://youtube.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#16D291] flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links — wired to real routes */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2.5">
            {[
              { text: 'Home',           path: '/' },
              { text: 'All Products',   path: '/products' },
              { text: 'Contact Us',     path: '/contact' },
              { text: 'My Orders',      path: '/my-orders' },
              { text: 'Address Book',   path: '/addresses' },
            ].map(({ text, path }) => (
              <li key={text}>
                <button
                  onClick={() => navigate(path)}
                  className="text-sm text-gray-500 hover:text-[#16D291] transition-colors duration-200 text-left"
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Remaining footer link columns */}
        {footerLinks.slice(1).map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-sm font-bold text-white mb-4">{title}</h3>
            <ul className="flex flex-col gap-2.5">
              {links.map(({ text, url }) => (
                <li key={text}>
                  <a
                    href={url}
                    className="text-sm text-gray-500 hover:text-[#16D291] transition-colors duration-200"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-6 md:px-16 lg:px-24 xl:px-32 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} FreshMart. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/contact')} className="hover:text-gray-400 transition-colors">Privacy Policy</button>
          <button onClick={() => navigate('/contact')} className="hover:text-gray-400 transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
