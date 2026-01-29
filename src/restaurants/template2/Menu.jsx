import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- REUSING UI COMPONENTS ---
import ItemModal from '../../components/ui/ItemModal';
import MenuNavbar from '../../components/ui/MenuNavbar';
import CategoryFilter from '../../components/ui/CategoryFilter';
import SearchInput from '../../components/ui/SearchInput';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Footer from '../../components/ui/Footer';
import BlurImage from '../../components/ui/BlurImage';

// =================================================================
// 💎 LUXURY DESIGN CONSTANTS
// =================================================================
const DESIGN = {
  primary: "#D4AF37", // Metallic Gold
};

const RESTAURANT_INFO = {
  // UPDATED: Same logo as Template 1
  logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png", 
  address_en: "Downtown, Luxury Ave",
  address_ar: "وسط المدينة، شارع الفخامة"
};
// =================================================================

const Template2Menu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  
  const [activeCat, setActiveCat] = useState(null);
  const [activeSubCat, setActiveSubCat] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Default: Arabic & Dark Mode
  const [lang, setLang] = useState('ar'); 
  const [isDark, setIsDark] = useState(true); 

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Template 1 (The Source)
      const { data: rest } = await supabase.from('restaurants').select('id, slug, name_en, name_ar').eq('slug', 'template1').single();
      if (!rest) return;
      setRestaurant(rest);

      // 2. Get Categories
      const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id).order('sort_order', { ascending: true });
      setCategories(cats || []);
      if (cats && cats.length > 0) setActiveCat(cats[0].id);

      // 3. Get Subcategories
      const catIds = cats?.map(c => c.id) || [];
      if (catIds.length > 0) {
        const { data: subs } = await supabase.from('subcategories').select('*').in('category_id', catIds);
        setSubcategories(subs || []);
      }

      // 4. Get Items
      const { data: menu } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', rest.id)
        .order('created_at', { ascending: false }); 
      
      setItems(menu || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- UX EFFECTS ---
  useEffect(() => {
     const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
     return () => clearTimeout(timer);
  }, [activeCat, activeSubCat, searchQuery]);

  useEffect(() => { setActiveSubCat('ALL'); }, [activeCat]);

  // --- FILTERING ---
  const visibleSubcategories = searchQuery ? [] : subcategories.filter(sub => sub.category_id === activeCat);
  
  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const name = lang === 'en' ? item.name_en : item.name_ar;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (item.category_id !== activeCat) return false;
    if (activeSubCat === 'ALL') return true; 
    return item.subcategory_id === activeSubCat;
  });

  if (loading) return <LoadingSkeleton isDark={isDark} />;

  // --- ANIMATIONS ---
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen font-serif pb-0 flex flex-col transition-colors duration-700 
        ${isDark ? 'bg-[#080808] text-[#E5E5E5]' : 'bg-[#FAF9F6] text-[#2D2D2D]'}`}
    >
      {/* FONTS INJECTION */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600&family=Cairo:wght@300;400;600;700&display=swap');
        
        .font-luxury { font-family: 'Playfair Display', serif; }
        .font-display { font-family: 'Cinzel', serif; }

        /* ARABIC OVERRIDES */
        [dir="rtl"] .font-luxury, 
        [dir="rtl"] .font-display, 
        [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3, [dir="rtl"] h4,
        [dir="rtl"] button, [dir="rtl"] input, [dir="rtl"] p, [dir="rtl"] span { 
            font-family: 'Cairo', sans-serif !important; 
        }
      `}</style>

      {/* 1. NAVBAR */}
      <MenuNavbar 
        restaurant={restaurant}
        logo={RESTAURANT_INFO.logo}
        address={lang === 'en' ? RESTAURANT_INFO.address_en : RESTAURANT_INFO.address_ar}
        accentColor={DESIGN.primary}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
      />

      {/* 2. SEARCH */}
      <div className="pt-10 px-4 max-w-2xl mx-auto w-full">
        <div className="relative group">
            <SearchInput 
                value={searchQuery}
                onChange={setSearchQuery}
                accentColor={DESIGN.primary}
                isDark={isDark}
                placeholder={lang === 'en' ? "Search for excellence..." : "ابحث عن التميز..."}
            />
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        </div>
      </div>

      {/* 3. CATEGORIES */}
      {!searchQuery && (
        <div className={`py-6 border-b transition-colors duration-700 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <CategoryFilter 
                categories={categories}
                activeCat={activeCat}
                setActiveCat={setActiveCat}
                accentColor={DESIGN.primary}
                lang={lang}
                isDark={isDark}
            />
        </div>
      )}

      {/* 4. MAIN CONTENT */}
      <div className="max-w-5xl mx-auto p-6 md:p-12 flex-1 w-full min-h-[60vh]">
        
        {/* SUBCATEGORIES */}
        <AnimatePresence mode="wait">
          {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && (
             <motion.div 
               key="sub-grid"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, transition: { duration: 0.8 }}}
               exit={{ opacity: 0 }}
               className="mb-16"
             >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                   {visibleSubcategories.map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => setActiveSubCat(sub.id)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border transition-all duration-500
                            ${isDark ? 'border-white/10 hover:border-[#D4AF37]' : 'border-black/5 hover:border-[#D4AF37]'}
                        `}
                      >
                        {sub.image_url ? (
                            <BlurImage 
                                src={sub.image_url} 
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-500">
                             <span className="font-display text-white text-sm md:text-base tracking-widest uppercase text-center px-2 drop-shadow-lg">
                                 {lang === 'en' ? sub.name_en : sub.name_ar}
                             </span>
                        </div>
                      </button>
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* BACK BUTTON */}
        {!searchQuery && activeSubCat !== 'ALL' && (
           <motion.button 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             onClick={() => setActiveSubCat('ALL')}
             style={{ color: DESIGN.primary }}
             className="mb-10 flex items-center gap-2 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity mx-auto"
           >
             <ArrowLeft size={14} /> {lang === 'en' ? 'Back to Full Menu' : 'العودة للقائمة الكاملة'}
           </motion.button>
        )}

        {/* ITEMS LIST */}
        <AnimatePresence mode="wait">
            <motion.div 
               key={`${activeCat}-${activeSubCat}-${searchQuery}`}
               variants={listVariants}
               initial="hidden"
               animate="visible"
               exit={{ opacity: 0 }}
               className="space-y-12"
            >
                {/* HEADING */}
                {!searchQuery && (
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="font-luxury text-3xl md:text-4xl text-[#D4AF37] italic">
                            {categories.find(c => c.id === activeCat) ? (lang === 'en' ? categories.find(c => c.id === activeCat).name_en : categories.find(c => c.id === activeCat).name_ar) : ''}
                        </h2>
                        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-4 opacity-60"></div>
                    </motion.div>
                )}

                {/* THE LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  {filteredItems.map(item => (
                     <motion.div 
                        key={item.id} 
                        variants={itemVariants}
                        onClick={() => setSelectedItem(item)}
                        className="group cursor-pointer"
                     >
                        <div className="flex gap-4 items-center">
                            {/* Text Info */}
                            <div className="flex-1 min-w-0">
                                <div className={`flex items-baseline justify-between border-b border-dashed pb-2 mb-2 transition-colors duration-500
                                    ${isDark 
                                        ? 'border-white/10 group-hover:border-[#D4AF37]/50' 
                                        : 'border-black/10 group-hover:border-[#D4AF37]/50'
                                    }`}
                                >
                                    <h3 className={`font-display text-lg tracking-wide transition-colors duration-300 truncate pr-2
                                        ${isDark 
                                            ? 'text-[#E5E5E5] group-hover:text-[#D4AF37]' 
                                            : 'text-[#2D2D2D] group-hover:text-[#D4AF37]'
                                        }`}
                                    >
                                        {lang === 'en' ? item.name_en : item.name_ar}
                                    </h3>
                                    <span className="font-luxury font-bold text-[#D4AF37] text-lg whitespace-nowrap">
                                        {Number(item.price).toLocaleString()} <span className="text-[10px] text-gray-500">{lang === 'en' ? 'IQD' : 'د.ع'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {item.image_url && (
                                <div className={`w-16 h-16 shrink-0 rounded-full overflow-hidden border transition-colors duration-500
                                    ${isDark 
                                        ? 'border-white/10 group-hover:border-[#D4AF37]' 
                                        : 'border-black/5 group-hover:border-[#D4AF37]'
                                    }`}
                                >
                                    <BlurImage src={item.image_url} alt={item.name_en} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            )}
                        </div>
                     </motion.div>
                  ))}
                </div>
                
                {filteredItems.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-40 font-luxury italic">
                        {lang === 'en' ? 'Selection currently unavailable.' : 'الاختيار غير متوفر حالياً.'}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      <Footer isDark={isDark} lang={lang} />

      <ItemModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        currency={lang === 'en' ? 'IQD' : 'د.ع'}
        accentColor={DESIGN.primary}
        lang={lang}
        isDark={isDark}
        variant="luxury"
      />
    </div>
  );
};

export default Template2Menu;