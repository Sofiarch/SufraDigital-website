import { useState, Suspense, lazy } from 'react'
import ElegantHero from './components/ElegantHero'
import Footer from './components/Footer'
import { Reveal } from './components/ui/Reveal';

// Lazy Load components
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

        {/* Navigation Bar */}
        <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto border-b" style={{ borderColor: `${textColor}40` }}>
          <div 
            className="text-2xl tracking-widest font-bold cursor-pointer" 
            style={{ color: textColor }}
            onClick={() => navigateTo('home')}
          >
            LUXE MENU
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={toggleLang}
              className="border px-6 py-1 rounded-full hover:bg-opacity-10 transition-all uppercase text-sm tracking-tighter"
              style={{ borderColor: textColor, color: textColor }}
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </nav>

        {/* --- PAGE CONTENT SWITCHER --- */}
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
                    {/* UPDATED: Just "Start Now" */}
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

        <Footer lang={lang} />

      </main>
    </div>
  )
}

export default App