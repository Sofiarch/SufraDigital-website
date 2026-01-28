import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search...", isDark = false, accentColor }) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6 px-6 animate-fade-in group">
      <div className={`absolute left-10 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`} style={{ color: value ? accentColor : undefined }}>
        <Search size={18} />
      </div>

      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ borderColor: 'transparent' }} // Base border style
        // Note: Focus styles with dynamic colors are tricky in inline styles without state, 
        // so we use a focus-within wrapper or simple border overrides if needed.
        className={`w-full py-3.5 pl-12 pr-12 rounded-2xl text-[15px] font-medium outline-none transition-all duration-300 shadow-inner ${isDark ? 'bg-[#1C1C1C] text-white placeholder-gray-600 focus:bg-[#252525]' : 'bg-white text-gray-900 placeholder-gray-400 focus:border-gray-300'}`}
      />

      {value && <button onClick={() => onChange('')} className={`absolute right-9 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all active:scale-90 ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-black hover:bg-black/5'}`}><X size={14} strokeWidth={3} /></button>}
    </div>
  );
};
export default SearchInput;