import React from 'react';
import { Moon, Sun, Globe, MapPin } from 'lucide-react'; 

const MenuNavbar = ({ restaurant, logo, accentColor, isDark, toggleTheme, lang, toggleLang, placeholderLogo = "https://cdn-icons-png.flaticon.com/512/3448/3448609.png" }) => {
  const addressEn = restaurant?.address || "Baghdad, Iraq";
  const addressAr = restaurant?.address || "بغداد، العراق";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${isDark ? 'bg-black/60 backdrop-blur-xl border-white/5 text-white' : 'bg-white/70 backdrop-blur-xl border-gray-200/50 text-gray-900'}`}>
      {/* Changed max-w-md to max-w-7xl */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 shrink-0 rounded-full overflow-hidden border shadow-sm flex items-center justify-center ${isDark ? 'border-white/10 bg-[#1C1C1C]' : 'border-gray-200 bg-gray-100'}`}>
            <img src={logo || restaurant?.logo_url || placeholderLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none tracking-tight">{lang === 'en' ? restaurant?.name_en : restaurant?.name_ar}</h1>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
               <MapPin size={10} /><span className="truncate max-w-[140px] opacity-80">{lang === 'en' ? addressEn : addressAr}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={toggleLang} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${isDark ? 'bg-white/10 hover:bg-white/20 border border-white/5' : 'bg-black/5 hover:bg-black/10 border border-black/5'}`}>
            <Globe size={14} /> <span>{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button onClick={toggleTheme} style={{ backgroundColor: isDark ? accentColor : '#1a1a1a', color: isDark ? '#000' : '#fff', boxShadow: isDark ? `0 0 15px ${accentColor}50` : '' }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 active:rotate-12`}>
            {isDark ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default MenuNavbar;