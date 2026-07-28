import { footerLinks } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#16D291] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#16D291]">Fresh</span>
              <span className="text-white">Mart</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500 mb-5">
            Your trusted online grocery store. Fresh produce delivered to your doorstep in under 30 minutes.
          </p>
          <div className="flex gap-3">
            {['FB', 'IG', 'TW', 'YT'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#16D291] flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white transition-all duration-200"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map(({ title, links }) => (
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
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
