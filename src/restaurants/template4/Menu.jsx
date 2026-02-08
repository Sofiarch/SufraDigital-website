import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Moon, Sun, ChevronLeft, Menu as MenuIcon, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import ItemModal from '../../components/ui/ItemModal';
import Cart from '../../components/ui/Cart';
import IraqiLoader from '../../components/ui/IraqiLoader'; 
import Particles from '../../components/Particles'; 
import MenuCard from '../../components/ui/MenuCard';

// --- ASSETS ---
import Logo from './logo_new_transparent.webp'; 

// =================================================================
// 🏰 TRADITIONAL IRAQI DESIGN
// =================================================================
const THEME = {
  light: {
    bg: "#FDF6E3",      // Cream
    text: "#422006",    // Oak
    primary: "#78350F", // Saddle Brown
    accent: "#D4AF37",  // Gold
    border: "#E7E5E4",
    navBg: "#FDF6E3"
  },
  dark: {
    bg: "#0F0F0F",      // Rich Black
    text: "#E7E5E4",    // Stone White
    primary: "#ECAE36", // Gold
    accent: "#F59E0B",  // Amber
    border: "#27272A",
    navBg: "#18181B"
  }
};

const Template4Menu = () => {
  const [restaurant, setRestaurant] = useState(null);
  
  // --- DATA ---
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  
  // --- UI STATES ---
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'menu'
  const [activeCat, setActiveCat] = useState('all');
  const [activeSubCat, setActiveSubCat] = useState('all');
  const [loading, setLoading] = useState(true); 
  const [welcomeVisible, setWelcomeVisible] = useState(true); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lang, setLang] = useState('ar'); 
  const [isDark, setIsDark] = useState(false); 
  const [cart, setCart] = useState([]);

  // --- CAROUSEL STATE ---
  const [cardIndex, setCardIndex] = useState(0);

  // --- THEME PERSISTENCE ---
  const [isDarkState, setIsDarkState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkState ? 'dark' : 'light');
    setIsDark(isDarkState);
  }, [isDarkState]);

  const colors = isDark ? THEME.dark : THEME.light;

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      const startTime = Date.now(); 
      try {
        const { data: rest, error: restError } = await supabase
            .from('restaurants').select('id, slug, name_en, name_ar').eq('slug', 'template1').single();
        if (restError || !rest) throw new Error("Restaurant not found");
        setRestaurant(rest);

        const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id).order('sort_order', { ascending: true });
        setCategories(cats || []);

        const { data: subcats } = await supabase.from('subcategories').select('*').order('sort_order', { ascending: true });
        setSubcategories(subcats || []);

        const { data: menu } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id).order('created_at', { ascending: false });
        setItems(menu || []);

      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 3000 - elapsedTime;
        if (remainingTime > 0) await new Promise(resolve => setTimeout(resolve, remainingTime));
        setLoading(false); 
      }
    }
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleItemUpdate = (item, qty) => {
    setCart(prev => {
        if (qty <= 0) return prev.filter(i => i.id !== item.id);
        const existing = prev.find(i => i.id === item.id);
        if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: qty } : i);
        return [...prev, { ...item, quantity: qty }];
    });
  };
  const clearCart = () => setCart([]);

  const handleCategoryClick = (catId) => {
    setActiveCat(catId);
    setViewMode('menu'); 
    setActiveSubCat('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('gallery');
    setActiveCat('all');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && cardIndex < categories.length - 1) {
        setCardIndex(cardIndex + 1);
    } else if (direction === 'right' && cardIndex > 0) {
        setCardIndex(cardIndex - 1);
    }
  };

  // --- FILTERING ---
  const currentSubcats = subcategories.filter(s => s.category_id === activeCat);
  const filteredItems = items.filter(item => {
    if (searchQuery) return (lang === 'en' ? item.name_en : item.name_ar).toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCat !== 'all' && item.category_id !== activeCat) return false;
    if (activeSubCat !== 'all' && item.subcategory_id !== activeSubCat) return false;
    return true;
  });

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-serif overflow-x-hidden relative transition-colors duration-700`} style={{ color: colors.text }}>
      
      {/* BACKGROUND PARTICLES */}
      <div className="fixed inset-0 -z-50 overflow-hidden transition-colors duration-700" style={{ backgroundColor: colors.bg }}>
        <div className="absolute inset-0 w-full h-full">
            <Particles
                particleCount={80}
                particleSpread={10}
                speed={0.1}
                particleColors={isDark ? ["#F59E0B", "#D4AF37", "#F97316"] : ["#5D4037", "#8D6E63", "#D4AF37"]}
                moveParticlesOnHover={true}
                particleHoverFactor={1}
                alphaParticles={false}
                particleBaseSize={100}
                sizeRandomness={1}
                cameraDistance={20}
                disableRotation={false}
            />
        </div>
      </div>

      {/* LOADER - High Z-Index */}
      <AnimatePresence>
        {welcomeVisible && (
            <div className="relative z-[9999]"> 
                <IraqiLoader 
                    isDark={isDark} 
                    isLoading={loading} 
                    restaurantName="حبايبنا" 
                    logo={Logo}
                    onEnter={() => setWelcomeVisible(false)} 
                />
            </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          🏰 GRID LAYOUT HEADER (FIXED NO OVERLAP)
      ========================================================= */}
      <header className="sticky top-0 z-40 transition-colors duration-500 backdrop-blur-xl border-b shadow-sm" 
        style={{ 
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.98)' : 'rgba(253, 246, 227, 0.98)',
            borderColor: colors.accent
        }}>
         
         {/* TOP ROW: Grid Layout (Left - Center - Right) */}
         <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
             
             {/* 1. LEFT: Navigation */}
             <div className="flex items-center justify-start gap-2">
                 {viewMode === 'menu' ? (
                     <button 
                        onClick={handleGoHome}
                        className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110 active:scale-95 bg-black/5"
                        style={{ borderColor: colors.accent, color: colors.text }}
                     >
                        <ChevronLeft size={24} className={lang === 'ar' ? 'rotate-180' : ''} />
                     </button>
                 ) : (
                    <div className="w-10 h-10" /> // Spacer
                 )}
             </div>

             {/* 2. CENTER: LOGO (Natural Flow - No Overlap) */}
             <div 
                className="flex items-center justify-center cursor-pointer group"
                onClick={handleGoHome}
             >
                <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // Explicit Size: 80px (w-20)
                    className="w-24 h-24 rounded-full bg-white shadow-lg border-2 overflow-hidden p-2 flex items-center justify-center"
                    style={{ borderColor: colors.accent }}
                >
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain scale-110" />
                </motion.div>
             </div>

             {/* 3. RIGHT: Controls */}
             <div className="flex items-center justify-end gap-2">
                 
                 {/* Search Toggle (Menu Mode Only) */}
                 {viewMode === 'menu' && (
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-95 hover:bg-black/5"
                        style={{ borderColor: colors.accent, color: colors.text }}
                    >
                        {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                    </button>
                 )}

                 {/* Theme Toggle */}
                 <button onClick={() => setIsDarkState(!isDarkState)} className="w-10 h-10 flex items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-95" style={{ borderColor: colors.accent, color: colors.accent }}>
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 
                 {/* Lang Toggle */}
                 <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="w-10 h-10 flex items-center justify-center rounded-full border font-bold text-xs transition-all hover:scale-110 active:scale-95" style={{ borderColor: colors.accent, color: colors.accent }}>
                    {lang === 'en' ? 'ع' : 'En'}
                 </button>
             </div>
         </div>

         {/* MOBILE SEARCH BAR (Slide Down) */}
         <AnimatePresence>
            {isSearchOpen && viewMode === 'menu' && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 pb-3"
                >
                    <div className="relative w-full">
                        <input 
                            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 rounded-xl pl-10 pr-4 focus:outline-none border shadow-inner bg-transparent"
                            style={{ borderColor: colors.accent, color: colors.text, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}
                            placeholder={lang === 'en' ? 'Search items...' : 'ابحث عن صنف...'}
                            autoFocus
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center justify-center w-10 pointer-events-none">
                            <Search size={18} style={{ color: colors.accent }} />
                        </div>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>

         {/* BOTTOM ROW: Text Categories (Own Row - No Overlap) */}
         <AnimatePresence>
            {viewMode === 'menu' && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                >
                    <div 
                        className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-3 md:justify-center items-center"
                        style={{ 
                            maskImage: 'linear-gradient(to right, transparent, black 10px, black 90%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10px, black 90%, transparent)' 
                        }}
                    >
                        <button 
                            onClick={() => { setActiveCat('all'); setActiveSubCat('all'); }}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap
                                ${activeCat === 'all' ? 'shadow-md scale-105' : 'hover:bg-black/5 opacity-70'}
                            `}
                            style={{
                                backgroundColor: activeCat === 'all' ? colors.primary : 'transparent',
                                color: activeCat === 'all' ? (isDark ? '#000' : '#FFF') : colors.text,
                                borderColor: activeCat === 'all' ? colors.primary : colors.border
                            }}
                        >
                            {lang === 'en' ? 'All Menu' : 'كل القائمة'}
                        </button>
                        
                        <div className="w-[1px] h-6 mx-1 opacity-20" style={{ backgroundColor: colors.text }}></div>
                        
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => { setActiveCat(cat.id); setActiveSubCat('all'); }}
                                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap
                                    ${activeCat === cat.id ? 'shadow-md scale-105' : 'hover:bg-black/5 opacity-70'}
                                `}
                                style={{
                                    backgroundColor: activeCat === cat.id ? colors.primary : 'transparent',
                                    color: activeCat === cat.id ? (isDark ? '#000' : '#FFF') : colors.text,
                                    borderColor: activeCat === cat.id ? colors.primary : colors.border
                                }}
                            >
                                {lang === 'en' ? cat.name_en : cat.name_ar}
                            </button>
                        ))}
                    </div>
                    
                    {/* Subcategories (if any) */}
                    {currentSubcats.length > 0 && (
                        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-2 border-t md:justify-center pt-2" style={{ borderColor: colors.border }}>
                            <button onClick={() => setActiveSubCat('all')} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all ${activeSubCat === 'all' ? 'bg-black/10' : ''}`} style={{ borderColor: colors.border }}>{lang === 'en' ? 'All' : 'الكل'}</button>
                            {currentSubcats.map(sub => (
                                <button key={sub.id} onClick={() => setActiveSubCat(sub.id)} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all ${activeSubCat === sub.id ? 'bg-black/10' : ''}`} style={{ borderColor: colors.border }}>{lang === 'en' ? sub.name_en : sub.name_ar}</button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
         </AnimatePresence>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-32 relative min-h-[80vh] flex flex-col justify-center">
         
         {/* VIEW 1: 3D STACKED GALLERY (HOME) */}
         <AnimatePresence mode="wait">
            {viewMode === 'gallery' && (
                <motion.div 
                    key="gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center w-full"
                >
                    {/* Hero Text */}
                    <div className="text-center mb-8 mt-4">
                        <h2 className="text-4xl md:text-6xl font-black font-cairo mb-2" style={{ color: colors.primary }}>
                            {lang === 'en' ? "Explore Our Menu" : "اكتشف قائمتنا"}
                        </h2>
                        <p className="opacity-70 text-sm md:text-base font-medium">
                            {lang === 'en' ? "Swipe to choose a category" : "اسحب لاختيار الصنف"}
                        </p>
                    </div>

                    {/* --- 3D CARD STACK --- */}
                    <div className="relative w-full max-w-sm h-[420px] md:h-[500px] flex items-center justify-center perspective-1000">
                        {categories.map((cat, index) => {
                            // Calculate position relative to active card
                            const offset = index - cardIndex;
                            const isActive = index === cardIndex;
                            
                            // Only render cards close to active to save performance
                            if (Math.abs(offset) > 2) return null;

                            return (
                                <motion.div 
                                    key={cat.id}
                                    layout
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = offset.x;
                                        if (swipe < -50) handleSwipe('left');
                                        else if (swipe > 50) handleSwipe('right');
                                    }}
                                    animate={{
                                        scale: isActive ? 1 : 0.85,
                                        x: offset * 40, // Horizontal stack offset
                                        y: Math.abs(offset) * 10, // Slight curve
                                        zIndex: 100 - Math.abs(offset),
                                        rotateY: offset * -5,
                                        opacity: isActive ? 1 : 0.5,
                                        filter: isActive ? 'blur(0px)' : 'blur(2px) grayscale(50%)'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    onClick={() => isActive ? handleCategoryClick(cat.id) : setCardIndex(index)}
                                    className={`absolute w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border-4 cursor-pointer bg-black/50`}
                                    style={{ 
                                        borderColor: isActive ? colors.accent : colors.border,
                                        boxShadow: isActive ? `0 20px 50px -10px ${colors.accent}40` : 'none'
                                    }}
                                >
                                    {/* Image */}
                                    {cat.image_url ? (
                                        <img src={cat.image_url} alt={cat.name_en} className="w-full h-full object-cover pointer-events-none" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/10">
                                            <UtensilsCrossed size={64} className="opacity-20 mb-4" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent ${isActive ? 'opacity-80' : 'opacity-90'}`} />
                                    
                                    {/* Text Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
                                        <h3 className="text-3xl font-black font-cairo text-white mb-2 drop-shadow-lg tracking-wide">
                                            {lang === 'en' ? cat.name_en : cat.name_ar}
                                        </h3>
                                        {isActive && (
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: 60 }} 
                                                className="h-1.5 rounded-full" 
                                                style={{ backgroundColor: colors.accent }} 
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-6">
                        {categories.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === cardIndex ? 'w-6' : ''}`}
                                style={{ backgroundColor: idx === cardIndex ? colors.accent : (isDark ? '#333' : '#CCC') }}
                            />
                        ))}
                    </div>

                    {/* BUTTON BELOW GALLERY */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryClick('all')}
                        className="group relative px-12 py-5 mt-8 rounded-full font-black text-xl shadow-2xl flex items-center gap-3 overflow-hidden border-2 z-10"
                        style={{ 
                            backgroundColor: colors.primary, 
                            color: '#FFF',
                            borderColor: colors.accent
                        }}
                    >
                        <span className="relative z-10 uppercase tracking-widest text-sm md:text-base">
                            {lang === 'en' ? 'View Full Menu' : 'عرض القائمة الكاملة'}
                        </span>
                        <MenuIcon className="relative z-10 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
                    </motion.button>

                </motion.div>
            )}

            {/* VIEW 2: MENU GRID (ACTIVE) */}
            {viewMode === 'menu' && (
                <motion.div 
                    key="menu"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mt-4">
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <MenuCard 
                                    key={item.id}
                                    item={item}
                                    cart={cart}
                                    onUpdateCart={handleItemUpdate}
                                    currency={lang === 'en' ? 'IQD' : 'د.ع'}
                                    isDark={isDark}
                                    accentColor={colors.accent}
                                    lang={lang}
                                    onImageClick={setSelectedItem}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 opacity-50 font-bold">
                            {lang === 'en' ? 'No items found.' : 'لا توجد عناصر.'}
                        </div>
                    )}
                </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* MODALS */}
      <ItemModal 
        item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} 
        cart={cart} onUpdateCart={handleItemUpdate} 
        currency={lang === 'en' ? 'IQD' : 'د.ع'} 
        accentColor={colors.primary} lang={lang} isDark={isDark} variant="cafe" 
      />
      
      {/* CART */}
      {!selectedItem && !welcomeVisible && (
        <Cart 
            cart={cart} onUpdateQty={(id, qty) => handleItemUpdate({id}, qty)} onRemove={(id) => handleItemUpdate({id}, 0)} onClear={clearCart} 
            currency={lang === 'en' ? 'IQD' : 'د.ع'} lang={lang} isDark={isDark} accentColor={colors.accent} 
        />
      )}
    </div>
  );
};

export default Template4Menu;