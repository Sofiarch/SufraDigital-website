import { useState } from 'react'
import ElegantHero from './components/ElegantHero'
import Features from './components/Features'
import ScanDemo from './components/ScanDemo'

function App() {
  const [lang, setLang] = useState('ar'); // Default Arabic
  const bgColor = "#ebe3c6";
  const textColor = "#3c3728";

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen font-cairo" style={{ backgroundColor: bgColor }}>
      
      {/* Navigation */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto border-b" style={{ borderColor: `${textColor}40` }}>
        <div className="text-2xl tracking-widest font-bold" style={{ color: textColor }}>LUXE MENU</div>
        <button 
          onClick={toggleLang}
          className="border px-6 py-1 rounded-full hover:bg-opacity-10 transition-all uppercase text-sm tracking-tighter"
          style={{ borderColor: textColor, color: textColor }}
        >
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </nav>

      <ElegantHero lang={lang} textColor={textColor} />
      
      {/* Scan Demo (Includes "How it works" header now) */}
      <ScanDemo lang={lang} textColor={textColor} />

      <Features lang={lang} textColor={textColor} />
      
    </div>
  )
}

export default App