import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UI COMPONENTS ---
import MenuCard from '../../components/ui/MenuCard';
import ItemModal from '../../components/ui/ItemModal';
import MenuNavbar from '../../components/ui/MenuNavbar';
import CategoryFilter from '../../components/ui/CategoryFilter';
import SubCategoryCard from '../../components/ui/SubCategoryCard';
import SearchInput from '../../components/ui/SearchInput';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Footer from '../../components/ui/Footer';

// =================================================================
// 🔧 BRANDING & SETTINGS
// =================================================================
const DESIGN = {
  primary: "#EAC8CA", // Your reusable accent color
};

const RESTAURANT_INFO = {
  logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png", 
  address_en: "Baghdad, Zayona",
  address_ar: "بغداد، زيونة"
};
// =================================================================

const Template1Menu = () => {
  // --- STATE ---
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  
  const [activeCat, setActiveCat] = useState(null);
  const [activeSubCat, setActiveSubCat] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [lang, setLang] = useState('en'); 
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  // --- HANDLERS ---
  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchData() {
      // 1. Get Restaurant Data
      const { data: rest } = await supabase
        .from('restaurants')
        .select('id, slug, name_en, name_ar')
        .eq('slug', 'template1')
        .single();
      
      if (!rest) return;
      setRestaurant(rest);

      // 2. Get Categories (Sorted by your Admin Panel order)
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', rest.id)
        .order('sort_order', { ascending: true });

      setCategories(cats || []);
      
      // Auto-select the first category in the sorted list
      if (cats && cats.length > 0) {
        setActiveCat(cats[0].id);
      }

      // 3. Get Subcategories
      const catIds = cats?.map(c => c.id) || [];
      if (catIds.length > 0) {
        const { data: subs } = await supabase
          .from('subcategories')
          .select('*')
          .in('category_id', catIds);
        setSubcategories(subs || []);
      }

      // 4. Get All Menu Items
      const { data: menu } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', rest.id);
      
      setItems(menu || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- UX EFFECTS ---
  
  // Auto-scroll to top when navigating categories or searching
  useEffect(() => {
     const timer = setTimeout(() => {
       window.scrollTo({ top: 0, behavior: 'smooth' });
     }, 100);
     return () => clearTimeout(timer);
  }, [activeCat, activeSubCat, searchQuery]);

  // Reset subcategory selection when switching main categories
  useEffect(() => { 
    setActiveSubCat('ALL'); 
  }, [activeCat]);

  // --- FILTERING LOGIC ---
  const visibleSubcategories = searchQuery ? [] : subcategories.filter(sub => sub.category_id === activeCat);
  
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery) {
      const name = lang === 'en' ? item.name_en : item.name_ar;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // Category match
    if (item.category_id !== activeCat) return false;

    // Subcategory logic (Optional subcategories)
    if (activeSubCat === 'ALL') {
      return item.subcategory_id === null; // Show items sitting directly in the category
    } else {
      return item.subcategory_id === activeSubCat;
    }
  });

  if (loading) return <LoadingSkeleton isDark={isDark} />;

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.06 } // Smooth waterfall entry
    },
    exit: { opacity: 0 }
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen font-sans pb-0 flex flex-col transition-colors duration-500 ${
        isDark ? 'bg-[#121212] text-white' : 'bg-[#f4f4f4] text-[#1a1a1a]'
      }`}
    >
      
      {/* 1. NAVIGATION BAR */}
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

      {/* 2. SEARCH INTERFACE */}
      <div className="pt-6">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          accentColor={DESIGN.primary}
          isDark={isDark}
          placeholder={lang === 'en' ? "Search for items..." : "ابحث عن طبق..."}
        />
      </div>

      {/* 3. CATEGORY TABS */}
      {!searchQuery && (
        <CategoryFilter 
           categories={categories}
           activeCat={activeCat}
           setActiveCat={setActiveCat}
           accentColor={DESIGN.primary}
           lang={lang}
           isDark={isDark}
        />
      )}

      {/* 4. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 w-full min-h-[60vh]">
        
        {/* --- SUBCATEGORIES GRID --- */}
        <AnimatePresence mode="wait">
          {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && (
             <motion.div 
               key="sub-grid"
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="mb-12"
             >
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                   {lang === 'en' ? 'Explore Sections' : 'استكشف الأقسام'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {visibleSubcategories.map(sub => (
                      <SubCategoryCard 
                        key={sub.id} 
                        subcategory={sub} 
                        lang={lang} 
                        onClick={(id) => setActiveSubCat(id)} 
                        accentColor={DESIGN.primary} 
                      />
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* --- BACK NAVIGATION --- */}
        {!searchQuery && activeSubCat !== 'ALL' && (
           <motion.button 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             onClick={() => setActiveSubCat('ALL')}
             style={{ 
               color: isDark ? DESIGN.primary : '#fff', 
               backgroundColor: isDark ? '#2a2a2a' : DESIGN.primary 
             }}
             className="mb-8 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
           >
             <ArrowLeft size={18} /> {lang === 'en' ? 'Back' : 'رجوع'}
           </motion.button>
        )}

        {/* --- MENU ITEMS GRID --- */}
        <AnimatePresence mode="wait">
            <motion.div 
               key={`${activeCat}-${activeSubCat}-${searchQuery}`}
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="space-y-4"
            >
                {searchQuery && (
                   <div className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'en' ? `Found ${filteredItems.length} results` : `نتائج البحث: ${filteredItems.length}`}
                   </div>
                )}
                
                {/* Visual Label for direct items in a category */}
                {!searchQuery && activeSubCat === 'ALL' && filteredItems.length > 0 && visibleSubcategories.length > 0 && (
                   <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                     {lang === 'en' ? 'General' : 'عام'}
                   </h3>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {filteredItems.map(item => (
                     <MenuCard 
                       key={item.id}
                       item={{ 
                         ...item, 
                         name_en: lang === 'en' ? item.name_en : item.name_ar, 
                         description_en: lang === 'en' ? item.description_en : item.description_ar 
                       }}
                       currency={lang === 'en' ? 'IQD' : 'د.ع'}
                       accentColor={DESIGN.primary}
                       isDark={isDark}
                       onClick={(clickedItem) => setSelectedItem(clickedItem)}
                     />
                  ))}
                </div>
                
                {/* Empty State */}
                {filteredItems.length === 0 && !visibleSubcategories.length && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className={`text-center py-24 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}
                    >
                        {lang === 'en' ? 'No items available in this section.' : 'لا توجد عناصر في هذا القسم.'}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      <Footer isDark={isDark} lang={lang} />

      {/* 5. ITEM DETAIL MODAL */}
      <ItemModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        currency={lang === 'en' ? 'IQD' : 'د.ع'}
        accentColor={DESIGN.primary}
        lang={lang}
        isDark={isDark}
      />
    </div>
  );
};

export default Template1Menu;