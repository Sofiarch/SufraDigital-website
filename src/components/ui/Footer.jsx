import React from 'react';

const Footer = ({ isDark, lang = 'en' }) => {
  return (
    <footer className={`w-full py-8 mt-auto text-center transition-colors duration-300 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
      <a 
        href="https://linex.website" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:text-emerald-500 transition-colors duration-300"
      >
        {lang === 'en' ? 'Powered by' : 'مطور بواسطة'} 
        <span className="font-bold">LineX</span>
      </a>
    </footer>
  );
};

export default Footer;