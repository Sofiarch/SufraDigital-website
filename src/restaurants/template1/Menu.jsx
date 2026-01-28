import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import MenuCard from '../../components/ui/MenuCard';
import ItemModal from '../../components/ui/ItemModal';
import MenuNavbar from '../../components/ui/MenuNavbar';
import CategoryFilter from '../../components/ui/CategoryFilter';
import SubCategoryCard from '../../components/ui/SubCategoryCard';
import SearchInput from '../../components/ui/SearchInput';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Footer from '../../components/ui/Footer';

// --- CONFIG ---
const DESIGN = { primary: "#EAC8CA" };
const RESTAURANT_INFO = {
  logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png", 
  address_en: "Baghdad, Zayona",
  address_ar: "بغداد، زيونة"
};

const Template1Menu = () => {
  // State
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
  const [isDark, setIsDark] = useState(true); 

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      const { data: rest } = await supabase.from('restaurants').select('id, slug, name_en, name_ar').eq('slug', 'template1').single();
      if (!rest) return;
      setRestaurant(rest);

      // Order by 'sort_order' so Admin Panel changes reflect here
      const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id).order('sort_order', { ascending: true });
      setCategories(cats || []);
      
      // Auto-select first category
      if (cats && cats.length > 0) setActiveCat(cats[0].id);

      const catIds = cats?.map(c => c.id) || [];
      if (catIds.length > 0) {
        const { data: subs } = await supabase.from('subcategories').select('*').in('category_id', catIds);
        setSubcategories(subs || []);
      }

      const { data: menu } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id);
      setItems(menu || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Auto-Scroll to top when category changes
  useEffect(() => {
     const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
     return () => clearTimeout(timer);
  }, [activeCat, activeSubCat]);

  // Reset subcategory when main category changes
  useEffect(() => { setActiveSubCat('ALL'); }, [activeCat]);

  // Filter Logic
  const visibleSubcategories = searchQuery ? [] : subcategories.filter(sub => sub.category_id === activeCat);
  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const name = lang === 'en' ? item.name_en : item.name_ar;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (item.category_id !== activeCat) return false;
    return activeSubCat === 'ALL' ? item.subcategory_id === null : item.subcategory_id === activeSubCat;
  });

  if (loading) return <LoadingSkeleton isDark={isDark} />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0 }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans pb-0 flex flex-col transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-[#f4f4f4] text-[#1a1a1a]'}`}>
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

      <div className="pt-6">
        <SearchInput value={searchQuery} onChange={setSearchQuery} accentColor={DESIGN.primary} isDark={isDark} placeholder={lang === 'en' ? "Search for items..." : "ابحث عن طبق..."} />
      </div>

      {!searchQuery && (
        <CategoryFilter categories={categories} activeCat={activeCat} setActiveCat={setActiveCat} accentColor={DESIGN.primary} lang={lang} isDark={isDark} />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 w-full min-h-[50vh]">
        
        {/* Subcategories */}
        <AnimatePresence mode="wait">
          {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && (
             <motion.div key="subcategories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-12">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? 'Categories' : 'الأقسام'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {visibleSubcategories.map(sub => (
                      <SubCategoryCard key={sub.id} subcategory={sub} lang={lang} onClick={(id) => setActiveSubCat(id)} accentColor={DESIGN.primary} />
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        {!searchQuery && activeSubCat !== 'ALL' && (
           <button onClick={() => setActiveSubCat('ALL')} style={{ color: isDark ? DESIGN.primary : '#fff', backgroundColor: isDark ? '#2a2a2a' : DESIGN.primary }} className={`mb-8 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm hover:opacity-90`}>
             <ArrowLeft size={18} /> {lang === 'en' ? 'Back' : 'رجوع'}
           </button>
        )}

        {/* Menu Items */}
        <AnimatePresence mode="wait">
            <motion.div key={activeCat + activeSubCat + searchQuery} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                {searchQuery && <div className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? `Found ${filteredItems.length} results` : `نتائج البحث: ${filteredItems.length}`}</div>}
                
                {!searchQuery && activeSubCat === 'ALL' && filteredItems.length > 0 && visibleSubcategories.length > 0 && (
                   <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? 'Direct Items' : 'عناصر أخرى'}</h3>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {filteredItems.map(item => (
                     <MenuCard key={item.id} item={{ ...item, name_en: lang === 'en' ? item.name_en : item.name_ar, description_en: lang === 'en' ? item.description_en : item.description_ar }} currency={lang === 'en' ? 'IQD' : 'د.ع'} accentColor={DESIGN.primary} isDark={isDark} onClick={(clickedItem) => setSelectedItem(clickedItem)} />
                  ))}
                </div>
                
                {filteredItems.length === 0 && !visibleSubcategories.length && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-20 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{lang === 'en' ? 'No items found.' : 'لا توجد عناصر.'}</motion.div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      <Footer isDark={isDark} lang={lang} />
      <ItemModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} currency={lang === 'en' ? 'IQD' : 'د.ع'} accentColor={DESIGN.primary} lang={lang} isDark={isDark} />
    </div>
  );
};
export default Template1Menu;