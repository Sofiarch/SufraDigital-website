import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Search, Coffee, Utensils } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- REUSING UI COMPONENTS ---
import ItemModal from '../../components/ui/ItemModal';
import MenuNavbar from '../../components/ui/MenuNavbar';
import SearchInput from '../../components/ui/SearchInput';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Footer from '../../components/ui/Footer';
import BlurImage from '../../components/ui/BlurImage';

// =================================================================
// ☕ COZY COFFEE SHOP DESIGN
// =================================================================
const DESIGN = {
  primary: "#6F4E37", // Coffee Brown
};

const RESTAURANT_INFO = {
  logo: "https://cdn-icons-png.flaticon.com/512/924/924514.png", 
  address_en: "The Coffee Workspace",
  address_ar: "مساحة القهوة والعمل"
};

// BACKGROUND TEXTURES
const BG_DARK_TEXTURE = "https://images.unsplash.com/photo-1621193677209-66126b88019a?q=80&w=2574&auto=format&fit=crop"; 
const BG_LIGHT_TEXTURE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=2574&auto=format&fit=crop";

// =================================================================

const Template3Menu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  
  const [activeCat, setActiveCat] = useState(null);
  const [activeSubCat, setActiveSubCat] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [lang, setLang] = useState('ar'); 
  const [isDark, setIsDark] = useState(true); 

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      const { data: rest } = await supabase.from('restaurants').select('id, slug, name_en, name_ar').eq('slug', 'template1').single();
      if (!rest) return;
      setRestaurant(rest);

      const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id).order('sort_order', { ascending: true });
      setCategories(cats || []);
      if (cats && cats.length > 0) setActiveCat(cats[0].id);

      const catIds = cats?.map(c => c.id) || [];
      if (catIds.length > 0) {
        const { data: subs } = await supabase.from('subcategories').select('*').in('category_id', catIds);
        setSubcategories(subs || []);
      }

      const { data: menu } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id).order('created_at', { ascending: false });
      setItems(menu || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- UX ---
  useEffect(() => {
     const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
     return () => clearTimeout(timer);
  }, [activeCat, activeSubCat]); 

  useEffect(() => { setActiveSubCat('ALL'); }, [activeCat]);

  // --- FILTER ---
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen font-sans pb-0 flex flex-col transition-colors duration-500 relative`}
    >
      {/* BACKGROUND LAYERS */}
      {/* 1. Base Color */}
      <div className={`fixed inset-0 z-[-1] transition-colors duration-700 ${isDark ? 'bg-[#1E1B18]' : 'bg-[#F5F2EA]'}`} />
      
      {/* 2. Texture Image (Fixed) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-700 opacity-30"
        style={{ backgroundImage: `url(${isDark ? BG_DARK_TEXTURE : BG_LIGHT_TEXTURE})` }}
      />
      
      {/* 3. Tint Overlay */}
      <div className={`fixed inset-0 z-0 ${isDark ? 'bg-black/30' : 'bg-[#6F4E37]/5'} backdrop-blur-[1px]`} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Cairo:wght@400;600;700&display=swap');
        .font-sans { font-family: 'DM Sans', sans-serif; }
        [dir="rtl"] .font-sans { font-family: 'Cairo', sans-serif; }
      `}</style>

      {/* 1. NAVBAR */}
      <div className="relative z-20">
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
      </div>

      {/* 2. SEARCH & TABS */}
      <div className="pt-6 pb-2 px-4 sticky top-0 z-30">
         <div className={`max-w-3xl mx-auto rounded-[24px] p-2 backdrop-blur-xl border shadow-xl transition-colors
             ${isDark ? 'bg-[#2A2624]/80 border-white/5' : 'bg-white/70 border-white/60'}
         `}>
            {/* Search */}
            <div className="px-2 pt-2">
                <SearchInput 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                    accentColor={DESIGN.primary} 
                    isDark={isDark} 
                    placeholder={lang === 'en' ? "Find your favorite roast..." : "ابحث عن قهوتك المفضلة..."} 
                />
            </div>
         
            {/* Elegant Tabs */}
            {!searchQuery && (
                <div className="flex gap-8 overflow-x-auto no-scrollbar mt-3 px-4 pb-2 justify-start md:justify-center border-t border-white/5 pt-2">
                    {categories.map((cat) => {
                        const isActive = activeCat === cat.id;
                        return (
                            <button 
                                key={cat.id} 
                                onClick={() => setActiveCat(cat.id)}
                                className={`shrink-0 relative pb-2 text-sm font-bold transition-colors duration-300
                                    ${isActive 
                                        ? (isDark ? 'text-[#D7CCC8]' : 'text-[#6F4E37]') 
                                        : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
                                    }
                                `}
                            >
                                {lang === 'en' ? cat.name_en : cat.name_ar}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                                        style={{ backgroundColor: DESIGN.primary }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
         </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 flex-1 w-full min-h-[60vh]">
        
        {/* === SECTION 1: SUBCATEGORIES === */}
        <AnimatePresence mode="wait">
          {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && (
             <motion.div 
               key="sub-grid"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="mb-12"
             >
                <div className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-70 flex items-center gap-2
                    ${isDark ? 'text-[#A1887F]' : 'text-[#8D6E63]'}`}>
                    <Coffee size={14} /> {lang === 'en' ? 'Collections' : 'المجموعات'}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {visibleSubcategories.map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => setActiveSubCat(sub.id)}
                        className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border shadow-sm transition-all hover:-translate-y-1
                           ${isDark ? 'border-white/10' : 'border-white/60'}
                        `}
                      >
                        {sub.image_url ? (
                            <BlurImage 
                                src={sub.image_url} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center backdrop-blur-md ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
                                <Coffee className={`opacity-20 ${isDark ? 'text-white' : 'text-[#6F4E37]'}`} size={32} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2 group-hover:bg-black/10 transition-colors">
                             <span className="text-white text-sm font-bold tracking-wide text-center drop-shadow-md backdrop-blur-[4px] px-3 py-1 rounded-full bg-black/20 border border-white/10">
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
           <button 
             onClick={() => setActiveSubCat('ALL')}
             className={`mb-8 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full backdrop-blur-md border shadow-sm transition-all hover:scale-105
                ${isDark ? 'bg-[#3E3A36]/80 border-white/10 text-[#D7CCC8]' : 'bg-[#FFF]/80 border-white/60 text-[#5D4037]'}
             `}
           >
             <ArrowLeft size={16} /> {lang === 'en' ? 'Back to Collections' : 'العودة للمجموعات'}
           </button>
        )}

        {/* === SECTION 2: ITEMS LIST === */}
        <AnimatePresence mode="wait">
            <motion.div 
               key={`${activeCat}-${activeSubCat}-${searchQuery}`}
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
                {/* DIVIDER */}
                {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && filteredItems.length > 0 && (
                    <div className="flex items-center gap-4 my-8 opacity-50">
                        <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/20' : 'bg-[#6F4E37]/20'}`}></div>
                        <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-[#D7CCC8]' : 'text-[#6F4E37]'}`}>
                             <Utensils size={14}/> {lang === 'en' ? 'Menu Selection' : 'قائمة الطلبات'}
                        </span>
                        <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/20' : 'bg-[#6F4E37]/20'}`}></div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
                    {filteredItems.map(item => {
                        const isAvailable = item.is_available !== false;
                        return (
                            <motion.div 
                                key={item.id} 
                                variants={itemVariants}
                                onClick={() => isAvailable && setSelectedItem(item)}
                                className={`group relative flex flex-col overflow-hidden rounded-[16px] cursor-pointer shadow-lg transition-all 
                                    ${isAvailable ? 'hover:shadow-2xl hover:-translate-y-1' : 'grayscale opacity-75 cursor-not-allowed'}
                                    ${isDark 
                                        ? 'bg-[#25211E] border border-white/5' 
                                        : 'bg-white border border-[#E5E0D8]'}
                                `}
                            >
                                {/* Image Area */}
                                <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-200">
                                    {item.image_url ? (
                                        <BlurImage src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className={`flex items-center justify-center h-full text-xs opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>No Image</div>
                                    )}
                                    
                                    {/* SOLD OUT OVERLAY */}
                                    {!isAvailable && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                            <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider transform -rotate-3">
                                                {lang === 'en' ? 'Sold Out' : 'نفذت الكمية'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Price Tag */}
                                    {isAvailable && (
                                        <div className={`absolute top-2 right-2 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md
                                            ${isDark ? 'bg-black/70 text-[#D7CCC8]' : 'bg-white/90 text-[#5D4037]'}
                                        `}>
                                            {Number(item.price).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="p-3 pt-4 text-center">
                                    <h3 className={`font-bold text-sm leading-tight line-clamp-2 
                                        ${isDark ? 'text-[#E5E0D8]' : 'text-[#44403C]'}
                                        ${!isAvailable ? 'line-through opacity-60' : ''}
                                    `}>
                                        {lang === 'en' ? item.name_en : item.name_ar}
                                    </h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </AnimatePresence>
        
        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
            <div className={`text-center py-20 text-sm font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                {lang === 'en' ? 'No items available.' : 'لا توجد عناصر متاحة.'}
            </div>
        )}
      </div>

      {/* FOOTER - Updated with distinct background and z-index to fix "burning" issue */}
      <div className={`relative z-20 mt-auto border-t backdrop-blur-xl 
          ${isDark ? 'border-white/5 bg-[#1E1B18]/90' : 'border-[#6F4E37]/10 bg-[#F5F2EA]/90'}`}>
          <Footer isDark={isDark} lang={lang} />
      </div>

      <ItemModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        currency={lang === 'en' ? 'IQD' : 'د.ع'}
        accentColor={DESIGN.primary}
        lang={lang}
        isDark={isDark}
        variant="cafe"
      />
    </div>
  );
};

export default Template3Menu;