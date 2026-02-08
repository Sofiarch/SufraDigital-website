import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './ui/Toast';

// --- Icons ---
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const UploadIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const LogoutIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const MoonIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SunIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const EyeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const GlobeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ImageIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const t = {
    en: { dashboard: "Dashboard", items: "Menu Items", categories: "Categories", newItem: "New Item", editItem: "Edit Item", categoryLabel: "Categorization", selectMain: "Select Main Category...", selectSub: "Select Sub (Optional)...", nameEn: "Name (English)", nameAr: "Name (Arabic)", descEn: "Description (English)", descAr: "Description (Arabic)", price: "Price", image: "Image", changeImg: "Change", upload: "Upload", available: "Available", soldOut: "Sold Out", cancel: "Cancel", update: "Update", save: "Save", search: "Search items...", loading: "Loading Menu...", noItems: "No items found.", newCat: "New Category (English)", newCatAr: "New Category (Arabic)", catOrder: "Order", confirmDelete: "Are you sure you want to delete this?", logout: "Logout" },
    ar: { dashboard: "لوحة التحكم", items: "قائمة الطعام", categories: "الأصناف", newItem: "عنصر جديد", editItem: "تعديل العنصر", categoryLabel: "التصنيف", selectMain: "اختر الصنف الرئيسي...", selectSub: "اختر صنف فرعي (اختياري)...", nameEn: "الاسم (إنجليزي)", nameAr: "الاسم (عربي)", descEn: "الوصف (إنجليزي)", descAr: "الوصف (عربي)", price: "السعر", image: "الصورة", changeImg: "تغيير", upload: "رفع", available: "متوفر", soldOut: "نفذت الكمية", cancel: "إلغاء", update: "تحديث", save: "حفظ", search: "بحث في القائمة...", loading: "جاري التحميل...", noItems: "لا توجد عناصر.", newCat: "صنف جديد (إنجليزي)", newCatAr: "صنف جديد (عربي)", catOrder: "الترتيب", confirmDelete: "هل أنت متأكد من الحذف؟", logout: "خروج" }
};

const AdminPanel = ({ restaurant, onLogout }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('adminLang') || 'en'); 
  const [activeTab, setActiveTab] = useState('items'); 
  const [toast, setToast] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name_en: '', name_ar: '', desc_en: '', desc_ar: '', price: '', image_url: '', category_id: '', subcategory_id: '', is_available: true });
  
  // Updated Category State to include image
  const [newCat, setNewCat] = useState({ en: '', ar: '', order: '', image: '' });
  const [newSub, setNewSub] = useState({ catId: '', en: '', ar: '', image: '' });
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatData, setEditCatData] = useState({ en: '', ar: '', order: '', image: '' });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => { localStorage.setItem('adminLang', lang); }, [lang]);
  useEffect(() => { if (restaurant?.id) fetchData(); }, [restaurant]);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchItems()]);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select(`*, subcategories(*)`).eq('restaurant_id', restaurant.id).order('sort_order', { ascending: true });
    setCategories(data || []);
  }

  async function fetchItems() {
    const { data } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id).order('created_at', { ascending: false });
    setMenuItems(data || []);
  }

  // Generic Image Compressor
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_SIZE = 800;
          let width = img.width, height = img.height;
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          canvas.width = width; canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // 1. Item Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await compressImage(file);
        setNewItem({ ...newItem, image_url: url });
        setToast({ message: 'Image Ready!', type: 'success' });
      } catch (err) { setToast({ message: 'Image Error', type: 'error' }); }
    }
  };

  // 2. Category Image Upload
  const handleCatImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await compressImage(file);
        if (isEdit) {
            setEditCatData(prev => ({ ...prev, image: url }));
        } else {
            setNewCat(prev => ({ ...prev, image: url }));
        }
        setToast({ message: 'Category Image Ready!', type: 'success' });
      } catch (err) { setToast({ message: 'Image Error', type: 'error' }); }
    }
  };

  // 3. Subcategory Image Upload
  const handleSubImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await compressImage(file);
        setNewSub(prev => ({ ...prev, image: url }));
        setToast({ message: 'Sub Image Ready!', type: 'success' });
      } catch (err) { setToast({ message: 'Image Error', type: 'error' }); }
    }
  };

  // --- ITEM LOGIC ---
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.category_id) { setToast({ message: t[lang].selectMain, type: 'error' }); return; }
    
    const catObj = categories.find(c => c.id === newItem.category_id);
    const subObj = catObj?.subcategories.find(s => s.id === newItem.subcategory_id);
    const payload = {
      restaurant_id: restaurant.id,
      name_en: newItem.name_en, name_ar: newItem.name_ar,
      description_en: newItem.desc_en, description_ar: newItem.desc_ar,
      price: newItem.price, image_url: newItem.image_url,
      category_id: newItem.category_id, subcategory_id: newItem.subcategory_id || null, 
      category_en: catObj?.name_en, category_ar: catObj?.name_ar,
      subcategory_en: subObj?.name_en || '', subcategory_ar: subObj?.name_ar || '',
      is_available: newItem.is_available 
    };

    let error;
    if (editingItem) { const { error: err } = await supabase.from('menu_items').update(payload).eq('id', editingItem); error = err; }
    else { const { error: err } = await supabase.from('menu_items').insert(payload); error = err; }

    if (!error) {
      setToast({ message: editingItem ? 'Item Updated' : 'Item Saved', type: 'success' });
      resetItemForm(); fetchItems();
    } else { setToast({ message: error.message, type: 'error' }); }
  };

  const toggleAvailability = async (item) => {
      const newStatus = !item.is_available;
      setMenuItems(menuItems.map(i => i.id === item.id ? {...i, is_available: newStatus} : i));
      await supabase.from('menu_items').update({ is_available: newStatus }).eq('id', item.id);
  };

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setNewItem({
        name_en: item.name_en, name_ar: item.name_ar,
        desc_en: item.description_en || '', desc_ar: item.description_ar || '',
        price: item.price, image_url: item.image_url || '',
        category_id: item.category_id, subcategory_id: item.subcategory_id || '',
        is_available: item.is_available
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setNewItem({ name_en: '', name_ar: '', desc_en: '', desc_ar: '', price: '', image_url: '', category_id: '', subcategory_id: '', is_available: true });
  };

  const handleDeleteItem = async (id) => {
    if(!confirm(t[lang].confirmDelete)) return;
    await supabase.from('menu_items').delete().eq('id', id);
    fetchItems();
    setToast({ message: 'Item Deleted', type: 'success' });
  };

  // --- CATEGORY LOGIC ---
  const handleAddCategory = async () => {
    if (!newCat.en) return;
    await supabase.from('categories').insert({ 
        restaurant_id: restaurant.id, 
        name_en: newCat.en, 
        name_ar: newCat.ar, 
        sort_order: newCat.order || 100,
        image_url: newCat.image // <--- Added Image Save
    });
    setNewCat({ en: '', ar: '', order: '', image: '' });
    fetchCategories();
    setToast({ message: 'Category Added', type: 'success' });
  };

  const handleSaveEditCat = async () => {
    if(!editCatData.en) return;
    await supabase.from('categories').update({ 
        name_en: editCatData.en, 
        name_ar: editCatData.ar, 
        sort_order: editCatData.order,
        image_url: editCatData.image // <--- Added Image Update
    }).eq('id', editingCatId);
    setEditingCatId(null);
    fetchCategories();
    setToast({ message: 'Category Updated', type: 'success' });
  };

  const handleDeleteCategory = async (id) => {
    if(!confirm(t[lang].confirmDelete)) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
    setToast({ message: 'Category Deleted', type: 'success' });
  };

  // --- SUB-CATEGORY LOGIC ---
  const handleAddSub = async (catId) => {
    if (!newSub.en || newSub.catId !== catId) return;
    await supabase.from('subcategories').insert({ category_id: catId, name_en: newSub.en, name_ar: newSub.ar, image_url: newSub.image });
    setNewSub({ catId: '', en: '', ar: '', image: '' });
    fetchCategories();
    setToast({ message: 'Subcategory Added', type: 'success' });
  };

  const handleDeleteSub = async (id) => {
    if(!confirm(t[lang].confirmDelete)) return;
    await supabase.from('subcategories').delete().eq('id', id);
    fetchCategories();
    setToast({ message: 'Subcategory Deleted', type: 'success' });
  };

  const filteredItems = menuItems.filter(item => item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || item.name_ar.includes(searchQuery));
  const bgMain = isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]';
  const bgCard = isDark ? 'bg-[#1E1E1E]' : 'bg-white';
  const bgInput = isDark ? 'bg-[#2C2C2C]' : 'bg-white';
  const textMain = isDark ? 'text-[#E0E0E0]' : 'text-[#3c3728]';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const borderMain = isDark ? 'border-[#333]' : 'border-gray-100';
  const inputClass = `w-full p-3 rounded-xl border shadow-sm outline-none transition-all ${bgInput} ${borderMain} ${textMain} focus:ring-2 focus:ring-[#3c3728]/20`;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans transition-colors duration-300 ${bgMain} ${textMain} selection:bg-[#3c3728] selection:text-[#ebe3c6]`}>
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Header */}
      <div className={`sticky top-0 z-40 px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300 backdrop-blur-md ${isDark ? 'bg-[#1E1E1E]/80 border-[#333]' : 'bg-white/80 border-[#3c3728]/5'} border-b`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-[#3c3728] rounded-2xl flex items-center justify-center text-[#ebe3c6] font-bold text-xl shadow-lg">{restaurant.name_en?.charAt(0) || 'R'}</div>
          <div><h1 className="font-bold text-xl leading-tight">{restaurant.name_en}</h1><p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>{t[lang].dashboard}</p></div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
           <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-[#333] text-gray-300' : 'bg-gray-100 text-gray-600'}`}><GlobeIcon /> {lang === 'en' ? 'العربية' : 'English'}</button>
           <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'bg-[#333] text-yellow-400' : 'bg-gray-100 text-gray-400 hover:text-orange-500'}`}>{isDark ? <SunIcon /> : <MoonIcon />}</button>
           <div className={`p-1.5 rounded-xl flex gap-1 ${isDark ? 'bg-[#2C2C2C]' : 'bg-[#ebe3c6]/30'}`}>
             {['items', 'categories'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === tab ? `${isDark ? 'bg-[#3c3728] text-white' : 'bg-white text-[#3c3728]'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-[#3c3728]/60'}`}`}>{t[lang][tab]}</button>
             ))}
           </div>
           <button onClick={onLogout} title={t[lang].logout} className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"><LogoutIcon /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'items' && (
            <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                 {/* Item Form Code (Unchanged) */}
                 <div className={`p-6 md:p-8 rounded-[2rem] shadow-xl border sticky top-28 transition-colors ${bgCard} ${editingItem ? 'border-orange-500/30 ring-4 ring-orange-500/10' : borderMain}`}>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold">{editingItem ? t[lang].editItem : t[lang].newItem}</h2></div>
                    <form onSubmit={handleSaveItem} className="space-y-4">
                       <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#252525] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                          <label className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{t[lang].categoryLabel}</label>
                          <select className={inputClass} value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value, subcategory_id: ''})} required>
                             <option value="">{t[lang].selectMain}</option>{categories.map(c => <option key={c.id} value={c.id}>{lang === 'en' ? c.name_en : c.name_ar}</option>)}
                          </select>
                          <select className={inputClass} value={newItem.subcategory_id} onChange={e => setNewItem({...newItem, subcategory_id: e.target.value})} disabled={!newItem.category_id}>
                             <option value="">{t[lang].selectSub}</option>{categories.find(c => c.id === newItem.category_id)?.subcategories.map(s => <option key={s.id} value={s.id}>{lang === 'en' ? s.name_en : s.name_ar}</option>)}
                          </select>
                       </div>
                       <input value={newItem.name_en} onChange={e => setNewItem({...newItem, name_en: e.target.value})} placeholder={t[lang].nameEn} className={inputClass} dir="ltr" required />
                       <input value={newItem.name_ar} onChange={e => setNewItem({...newItem, name_ar: e.target.value})} placeholder={t[lang].nameAr} className={inputClass} dir="rtl" required />
                       <div className="grid grid-cols-2 gap-2"><textarea value={newItem.desc_en} onChange={e => setNewItem({...newItem, desc_en: e.target.value})} placeholder={t[lang].descEn} className={`${inputClass} h-20 resize-none text-xs`} dir="ltr" /><textarea value={newItem.desc_ar} onChange={e => setNewItem({...newItem, desc_ar: e.target.value})} placeholder={t[lang].descAr} className={`${inputClass} h-20 resize-none text-xs`} dir="rtl" /></div>
                       <div className="flex gap-3"><input value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder={t[lang].price} className={`${inputClass} w-1/2 font-bold`} required /><label className={`w-1/2 flex items-center justify-center border border-dashed rounded-xl cursor-pointer hover:border-[#3c3728] gap-2 text-xs font-bold transition-all ${isDark ? 'border-[#444] hover:bg-[#333]' : 'bg-gray-50'}`}><input type="file" hidden onChange={handleImageUpload} /><UploadIcon /> {newItem.image_url ? t[lang].changeImg : t[lang].upload}</label></div>
                       <div className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${newItem.is_available ? (isDark ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100') : (isDark ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-100')}`} onClick={() => setNewItem({...newItem, is_available: !newItem.is_available})}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${newItem.is_available ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'}`}>{newItem.is_available && <CheckIcon />}</div><span className="text-xs font-bold uppercase">{newItem.is_available ? t[lang].available : t[lang].soldOut}</span>
                       </div>
                       <div className="pt-2 flex gap-3">{editingItem && <button type="button" onClick={resetItemForm} className={`px-4 py-3 font-bold rounded-xl ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`}>{t[lang].cancel}</button>}<button className={`flex-1 py-3 font-bold rounded-xl text-white shadow-lg transition-all ${editingItem ? 'bg-orange-500' : 'bg-[#3c3728]'}`}>{editingItem ? t[lang].update : t[lang].save}</button></div>
                    </form>
                 </div>
              </div>
              <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
                 <div className="relative"><div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} ${textMuted}`}><SearchIcon /></div><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t[lang].search} className={`w-full p-4 ${lang === 'ar' ? 'pl-12' : 'pr-12'} rounded-2xl border shadow-sm outline-none ${bgCard} ${borderMain} ${textMain} focus:ring-2 focus:ring-[#3c3728]/20`} /></div>
                 {loading ? <div className="text-center py-20 animate-pulse text-gray-400">{t[lang].loading}</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredItems.map(item => (
                        <motion.div layout key={item.id} className={`p-4 rounded-2xl shadow-sm border flex gap-4 items-start group hover:shadow-md transition-all ${bgCard} ${!item.is_available && 'opacity-60 grayscale'} ${editingItem === item.id ? 'border-orange-400 ring-2 ring-orange-500/20' : borderMain}`}>
                          <div className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border relative ${isDark ? 'bg-[#2C2C2C] border-[#333]' : 'bg-gray-50 border-gray-100'}`}>
                            {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><UploadIcon /></div>}
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`font-bold truncate px-1 ${textMain}`}>{lang === 'en' ? item.name_en : item.name_ar}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">{item.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <button onClick={() => toggleAvailability(item)} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${item.is_available ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>{item.is_available ? <><EyeIcon /> {t[lang].available}</> : <><EyeOffIcon /> {t[lang].soldOut}</>}</button>
                              <div className="flex-1"></div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditClick(item)} className="p-1.5 text-gray-400 hover:text-white hover:bg-orange-400 rounded-lg"><EditIcon /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg"><TrashIcon /></button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6">
               <div className={`p-6 rounded-2xl shadow-lg border flex gap-4 items-end ${bgCard} ${borderMain}`}>
                  <div className="w-16 space-y-1"><label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${textMuted}`}>{t[lang].catOrder}</label><input type="number" value={newCat.order} onChange={e => setNewCat({...newCat, order: e.target.value})} className={inputClass} placeholder="#" /></div>
                  <div className="flex-1 space-y-1"><label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${textMuted}`}>{t[lang].newCat}</label><input value={newCat.en} onChange={e => setNewCat({...newCat, en: e.target.value})} className={inputClass} placeholder="e.g. Breakfast" dir="ltr" /></div>
                  <div className="flex-1 space-y-1 text-right"><label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${textMuted}`}>{t[lang].newCatAr}</label><input value={newCat.ar} onChange={e => setNewCat({...newCat, ar: e.target.value})} className={`${inputClass}`} placeholder="مثال: فطور" dir="rtl" /></div>
                  
                  {/* Category Image Upload Button */}
                  <label className={`cursor-pointer p-3.5 rounded-xl border border-dashed transition-all hover:bg-gray-50 flex items-center justify-center ${newCat.image ? 'border-emerald-500 bg-emerald-50 text-emerald-500' : 'border-gray-300 text-gray-400'}`}>
                    <input type="file" hidden onChange={(e) => handleCatImageUpload(e, false)} />
                    <ImageIcon />
                  </label>

                  <button onClick={handleAddCategory} className="bg-[#3c3728] text-white p-3.5 rounded-xl hover:scale-105 transition-transform"><PlusIcon /></button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {categories.map(cat => (
                    <div key={cat.id} className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard} ${borderMain}`}>
                       <div className={`p-5 flex justify-between items-center border-b ${isDark ? 'border-[#333] bg-[#2C2C2C]/50' : 'border-gray-50 bg-gray-50/50'}`}>
                          {editingCatId === cat.id ? (
                            <div className="flex gap-2 flex-1 items-center">
                                <input type="number" className={`${inputClass} w-16 p-2 text-sm`} value={editCatData.order} onChange={e => setEditCatData({...editCatData, order: e.target.value})} />
                                <input className={`${inputClass} p-2 text-sm`} value={editCatData.en} onChange={e => setEditCatData({...editCatData, en: e.target.value})} dir="ltr" />
                                <input className={`${inputClass} p-2 text-sm`} value={editCatData.ar} onChange={e => setEditCatData({...editCatData, ar: e.target.value})} dir="rtl" />
                                
                                {/* Edit Category Image */}
                                <label className={`cursor-pointer p-2 rounded-lg border border-dashed ${editCatData.image ? 'text-emerald-500 border-emerald-500' : 'text-gray-400'}`}>
                                    <input type="file" hidden onChange={(e) => handleCatImageUpload(e, true)} />
                                    <ImageIcon />
                                </label>

                                <button onClick={handleSaveEditCat} className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg"><CheckIcon /></button>
                            </div>
                          ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-gray-400' : 'bg-black/5 text-gray-500'}`}>{cat.sort_order}</span>
                                    
                                    {/* Show Image if Exists */}
                                    {cat.image_url && <div className="w-8 h-8 rounded-full overflow-hidden border"><img src={cat.image_url} className="w-full h-full object-cover" /></div>}
                                    
                                    <h3 className={`font-bold ${textMain}`}>{lang === 'en' ? cat.name_en : cat.name_ar}</h3>
                                </div>
                                <div className="flex gap-1"><button onClick={() => { setEditingCatId(cat.id); setEditCatData({ en: cat.name_en, ar: cat.name_ar, order: cat.sort_order, image: cat.image_url || '' }) }} className={`p-2 rounded-lg ${textMuted} hover:bg-gray-100 hover:text-[#3c3728]`}><EditIcon /></button><button onClick={() => handleDeleteCategory(cat.id)} className={`p-2 rounded-lg ${textMuted} hover:bg-red-500/10 hover:text-red-500`}><TrashIcon /></button></div>
                            </>
                          )}
                       </div>
                       <div className="p-5 space-y-3">
                          {cat.subcategories.map(sub => (<div key={sub.id} className={`flex justify-between items-center p-3 rounded-xl border border-transparent group/sub ${isDark ? 'bg-[#252525] hover:border-[#444]' : 'bg-gray-50 hover:border-gray-200'}`}><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-[#1E1E1E]' : 'bg-gray-200'}`}>{sub.image_url ? <img src={sub.image_url} className="w-full h-full object-cover" /> : null}</div><span className={`text-sm font-medium ${textMuted}`}>{lang === 'en' ? sub.name_en : sub.name_ar}</span></div><button onClick={() => handleDeleteSub(sub.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/sub:opacity-100 transition-opacity"><XIcon /></button></div>))}
                          <div className={`flex gap-2 items-center mt-4 pt-3 border-t border-dashed ${isDark ? 'border-[#333]' : 'border-gray-100'}`}><input value={newSub.catId === cat.id ? newSub.en : ''} onChange={e => setNewSub({...newSub, catId: cat.id, en: e.target.value})} placeholder="Subcategory..." className={`w-full text-xs bg-transparent border-b p-1 outline-none ${textMuted} border-gray-300 focus:border-[#3c3728]`} dir={lang === 'ar' ? 'rtl' : 'ltr'} /><input value={newSub.catId === cat.id ? newSub.ar : ''} onChange={e => setNewSub({...newSub, catId: cat.id, ar: e.target.value})} placeholder="صنف فرعي..." className={`w-full text-xs bg-transparent border-b p-1 outline-none ${textMuted} border-gray-300 focus:border-[#3c3728]`} dir={lang === 'ar' ? 'rtl' : 'ltr'} /><label className={`cursor-pointer p-2 rounded-full transition-colors ${newSub.catId === cat.id && newSub.image ? 'bg-emerald-500/20 text-emerald-500' : 'text-gray-400 hover:text-orange-500'}`}><input type="file" hidden onChange={(e) => handleSubImageUpload(e, cat.id)} /><ImageIcon /></label><button onClick={() => handleAddSub(cat.id)} className="text-[#3c3728] hover:scale-110 transition-transform"><PlusIcon /></button></div>
                       </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default AdminPanel;