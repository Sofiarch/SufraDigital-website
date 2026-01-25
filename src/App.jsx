import { useState, Suspense, lazy } from 'react'
import ElegantHero from './components/ElegantHero'
import Footer from './components/Footer'
import { Reveal } from './components/ui/Reveal';

const ConceptGrid = lazy(() => import('./components/ConceptGrid'));
const ScanDemo = lazy(() => import('./components/ScanDemo'));
const ControlPanel = lazy(() => import('./components/ControlPanel'));
const BenefitsScroll = lazy(() => import('./components/BenefitsScroll'));
const ContactPage = lazy(() => import('./components/ContactPage'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-40">
    <div className="w-8 h-8 border-4 border-[#3c3728] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [lang, setLang] = useState('ar');
  const [currentPage, setCurrentPage] = useState('home');

  const bgColor = "#ebe3c6";
  const textColor = "#3c3728";

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const navigateTo = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  return (
    <div className="font-cairo min-h-screen" style={{ backgroundColor: bgColor }}>
      
      <main className="w-full relative">

        {/* --- HEADER --- */}
        {/* UPDATED: Changed 'fixed' to 'absolute'. 
            It now stays at the very top of the website and won't follow you down. 
        */}
        <header className="absolute top-0 left-0 right-0 z-50 border-b border-[#3c3728]/10" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center">
                
                {/* Logo */}
                <div 
                    className="cursor-pointer" 
                    onClick={() => navigateTo('home')}
                >
                    <img 
                        src="/Logo.webp" 
                        alt="SufraDigital Logo" 
                        className="h-24 w-auto object-contain" 
                    />
                </div>

                {/* Language Button */}
                <button 
                    onClick={toggleLang}
                    className="border-2 px-8 py-2 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-[#3c3728] hover:text-[#ebe3c6] transition-colors"
                    style={{ borderColor: textColor, color: textColor }}
                >
                    {lang === 'ar' ? 'English' : 'العربية'}
                </button>

            </div>
        </header>

        {/* --- PAGE CONTENT SWITCHER --- */}
        {/* UPDATED: Removed 'pt-32'. We don't need extra padding anymore since the header isn't fixed. 
            I kept 'pt-32' effectively as 'pt-28' inside the Hero or just let the Hero start naturally.
            However, to ensure the Hero content doesn't go UNDER the absolute header, we add a smaller padding like 'pt-28'.
        */}
        <div className="pt-28"> 
          {currentPage === 'home' ? (
            <>
              <ElegantHero 
                lang={lang} 
                textColor={textColor} 
                onContact={() => navigateTo('contact')} 
              />
              
              <Suspense fallback={<LoadingSpinner />}>
                <Reveal>
                  <ConceptGrid lang={lang} textColor={textColor} />
                </Reveal>
                
                <Reveal>
                  <ScanDemo lang={lang} textColor={textColor} />
                </Reveal>
                
                <Reveal>
                  <ControlPanel lang={lang} textColor={textColor} />
                </Reveal>
                
                <BenefitsScroll lang={lang} textColor={textColor} />
              </Suspense>
              
              {/* CTA Section */}
              <Reveal>
                <div className="py-24 text-center">
                  <h2 className="text-3xl font-bold italic mb-8" style={{ color: textColor }}>
                      {lang === 'ar' ? 'جاهز لتحديث مطعمك؟' : 'Ready to upgrade?'}
                  </h2>
                  <button 
                    onClick={() => navigateTo('contact')}
                    className="bg-[#3c3728] text-[#ebe3c6] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
                  >
                      {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                  </button>
                </div>
              </Reveal>
            </>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage 
                  lang={lang} 
                  textColor={textColor} 
                  onBack={() => navigateTo('home')} 
              />
            </Suspense>
          )}
        </div>

        <Footer lang={lang} />

      </main>
    </div>
  )
}

export default App