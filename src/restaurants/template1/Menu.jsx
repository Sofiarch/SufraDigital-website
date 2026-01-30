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
import Cart from '../../components/ui/Cart'; 

const DESIGN = { primary: "#EAC8CA" }; // Light Pink
const RESTAURANT_INFO = { logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png", address_en: "Baghdad, Zayona", address_ar: "بغداد، زيونة" };

const Template1Menu = () => {
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
  const [cart, setCart] = useState([]); 

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  // --- UNIFIED CART HANDLER ---
  const handleItemUpdate = (item, qty) => {
    setCart(prev => {
        if (qty <= 0) return prev.filter(i => i.id !== item.id);
        const existing = prev.find(i => i.id === item.id);
        if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: qty } : i);
        return [...prev, { ...item, quantity: qty }];
    });
  };

  const clearCart = () => setCart([]);

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
      const { data: menu } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id);
      setItems(menu || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => { const timer = setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100); return () => clearTimeout(timer); }, [activeCat, activeSubCat, searchQuery]);
  useEffect(() => { setActiveSubCat('ALL'); }, [activeCat]);

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

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } }, exit: { opacity: 0 } };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans pb-24 flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#121212] text-white' : 'bg-[#f4f4f4] text-[#1a1a1a]'}`}>
      <MenuNavbar restaurant={restaurant} logo={RESTAURANT_INFO.logo} address={lang === 'en' ? RESTAURANT_INFO.address_en : RESTAURANT_INFO.address_ar} accentColor={DESIGN.primary} isDark={isDark} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />
      <div className="pt-6"><SearchInput value={searchQuery} onChange={setSearchQuery} accentColor={DESIGN.primary} isDark={isDark} placeholder={lang === 'en' ? "Search for items..." : "ابحث عن طبق..."} /></div>
      {!searchQuery && <CategoryFilter categories={categories} activeCat={activeCat} setActiveCat={setActiveCat} accentColor={DESIGN.primary} lang={lang} isDark={isDark} />}
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 w-full min-h-[60vh]">
        <AnimatePresence mode="wait">
          {!searchQuery && activeSubCat === 'ALL' && visibleSubcategories.length > 0 && (
             <motion.div key="sub-grid" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-12">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? 'Explore Sections' : 'استكشف الأقسام'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {visibleSubcategories.map(sub => <SubCategoryCard key={sub.id} subcategory={sub} lang={lang} onClick={(id) => setActiveSubCat(id)} accentColor={DESIGN.primary} />)}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
        {!searchQuery && activeSubCat !== 'ALL' && <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setActiveSubCat('ALL')} style={{ color: isDark ? DESIGN.primary : '#1f2937', backgroundColor: isDark ? '#2a2a2a' : DESIGN.primary }} className="mb-8 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"><ArrowLeft size={18} /> {lang === 'en' ? 'Back' : 'رجوع'}</motion.button>}
        
        <AnimatePresence mode="wait">
            <motion.div key={`${activeCat}-${activeSubCat}-${searchQuery}`} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                {searchQuery && <div className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? `Found ${filteredItems.length} results` : `نتائج البحث: ${filteredItems.length}`}</div>}
                {!searchQuery && activeSubCat === 'ALL' && filteredItems.length > 0 && visibleSubcategories.length > 0 && <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'en' ? 'General' : 'عام'}</h3>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {filteredItems.map(item => (
                     <MenuCard key={item.id} item={{ ...item, name_en: lang === 'en' ? item.name_en : item.name_ar, description_en: lang === 'en' ? item.description_en : item.description_ar }} currency={lang === 'en' ? 'IQD' : 'د.ع'} accentColor={DESIGN.primary} isDark={isDark} lang={lang} onClick={(clickedItem) => setSelectedItem(clickedItem)} />
                  ))}
                </div>
                {filteredItems.length === 0 && !visibleSubcategories.length && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-24 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>{lang === 'en' ? 'No items available in this section.' : 'لا توجد عناصر في هذا القسم.'}</motion.div>}
            </motion.div>
        </AnimatePresence>
      </div>

      <Footer isDark={isDark} lang={lang} />
      
      <ItemModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        cart={cart}
        onUpdateCart={handleItemUpdate}
        currency={lang === 'en' ? 'IQD' : 'د.ع'} 
        accentColor={DESIGN.primary} 
        buttonTextColor="#1f2937" 
        lang={lang} 
        isDark={isDark} 
      />
      
      {/* FIXED: Cart only shows when modal is CLOSED (!selectedItem) */}
      {!selectedItem && (
        <Cart 
            cart={cart} 
            onUpdateQty={(id, qty) => handleItemUpdate({id}, qty)} 
            onRemove={(id) => handleItemUpdate({id}, 0)} 
            onClear={clearCart} 
            currency={lang === 'en' ? 'IQD' : 'د.ع'} 
            lang={lang} 
            isDark={isDark} 
            accentColor={DESIGN.primary} 
        />
      )}
    </div>
  );
};
export default Template1Menu;