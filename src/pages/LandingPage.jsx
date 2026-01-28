import { useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'; // Use Router instead of state
import { Helmet } from 'react-helmet-async';

// Note: We added '../' to imports because we are now in the 'pages' folder
import ElegantHero from '../components/ElegantHero'
import Footer from '../components/Footer'
import { Reveal } from '../components/ui/Reveal';

const ConceptGrid = lazy(() => import('../components/ConceptGrid'));
const ScanDemo = lazy(() => import('../components/ScanDemo'));
const ControlPanel = lazy(() => import('../components/ControlPanel'));
const BenefitsScroll = lazy(() => import('../components/BenefitsScroll'));
// We don't need ContactPage lazy loaded here, we will route to it directly

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-40">
    <div className="w-8 h-8 border-4 border-[#3c3728] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const LandingPage = () => {
  const [lang, setLang] = useState('ar');
  const navigate = useNavigate(); // Hook for navigation

  const bgColor = "#ebe3c6";
  const textColor = "#3c3728";

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="font-cairo min-h-screen" style={{ backgroundColor: bgColor }}>
      <Helmet>
        <title>Sufra Digital | Smart QR Menu Systems</title>
        <meta name="description" content="Transform your restaurant with Sufra Digital." />
      </Helmet>

      <main className="w-full relative">
        <header className="absolute top-0 left-0 right-0 z-50 border-b border-[#3c3728]/10" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/Logo.webp" alt="SufraDigital Logo" className="h-24 w-auto object-contain" />
                </div>
                <button 
                    onClick={toggleLang}
                    className="border-2 px-8 py-2 rounded-full font-bold uppercase text-sm tracking-widest text-[#3c3728] hover:bg-[#3c3728] hover:text-[#ebe3c6] transition-colors"
                    style={{ borderColor: textColor }}
                >
                    {lang === 'ar' ? 'English' : 'العربية'}
                </button>
            </div>
        </header>

        <div className="pt-28"> 
          <ElegantHero lang={lang} textColor={textColor} onContact={() => navigate('/contact')} />
          
          <Suspense fallback={<LoadingSpinner />}>
            <Reveal><ConceptGrid lang={lang} textColor={textColor} /></Reveal>
            <Reveal><ScanDemo lang={lang} textColor={textColor} /></Reveal>
            <Reveal><ControlPanel lang={lang} textColor={textColor} /></Reveal>
            <Reveal><BenefitsScroll lang={lang} textColor={textColor} /></Reveal>
          </Suspense>
          
          <Reveal>
            <div className="py-24 text-center">
              <h2 className="text-3xl font-bold italic mb-8" style={{ color: textColor }}>
                  {lang === 'ar' ? 'جاهز لتحديث مطعمك؟' : 'Ready to upgrade?'}
              </h2>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-[#3c3728] text-[#ebe3c6] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                  {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}
              </button>
            </div>
          </Reveal>
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  )
}

export default LandingPage;