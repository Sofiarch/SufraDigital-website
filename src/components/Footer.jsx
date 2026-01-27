import React from 'react';

const Footer = ({ lang }) => {
  const bg = "#3c3728"; 
  const text = "#ebe3c6"; 
  const year = new Date().getFullYear();
  const isRTL = lang === 'ar';

  return (
    <footer className="py-12 px-8 font-cairo" style={{ backgroundColor: bg, color: text }}>
      
      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-80 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        
        <div className="text-sm font-light tracking-wide">
          {/* UPDATED: Removed dot from Arabic copyright */}
          © {year} SufraDigital. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
        </div>

        <a 
            href="https://linex.website" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`group flex items-center gap-2 transition-all hover:opacity-100 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span className="text-sm font-light uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
            {lang === 'ar' ? 'تم التطوير بواسطة' : 'Created by'}
          </span>
          
          <div className="flex items-center gap-1 font-bold text-lg relative">
            <span className="tracking-tighter">LineX</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
        </a>

      </div>
    </footer>
  );
};

export default Footer;