import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

// Icons
const CartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;

const Template1Menu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Get Restaurant Details
      const { data: rest } = await supabase.from('restaurants').select('*').eq('slug', 'template1').single();
      if (!rest) return;
      setRestaurant(rest);

      // 2. Get Categories
      const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id);
      setCategories(cats || []);

      // 3. Get Items
      const { data: menu } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id);
      setItems(menu || []);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  // Filter Logic
  const filteredItems = activeCat === 'ALL' 
    ? items 
    : items.filter(item => item.category_id === activeCat);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white p-8 pb-12 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{restaurant.name_en}</h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">{restaurant.name_ar}</p>
      </div>

      {/* --- STICKY CATEGORY BAR --- */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 overflow-x-auto">
        <div className="flex p-4 gap-3 max-w-md mx-auto no-scrollbar">
          <button 
            onClick={() => setActiveCat('ALL')}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCat === 'ALL' ? 'bg-gray-900 text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCat(cat.id)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCat === cat.id ? 'bg-gray-900 text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* --- MENU GRID --- */}
      <div className="max-w-md mx-auto p-6 space-y-6">
        {filteredItems.map(item => (
           <motion.div 
             layout
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }}
             key={item.id} 
             className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4 overflow-hidden relative"
           >
              {/* Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden">
                 {item.image_url ? (
                    <img src={item.image_url} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                 )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                 <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name_en}</h3>
                 <p className="text-xs text-gray-400 line-clamp-2 mt-1 mb-3">{item.description_en}</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">{item.price}</span>
                    <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition">
                       +
                    </button>
                 </div>
              </div>
           </motion.div>
        ))}

        {filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                No items in this category.
            </div>
        )}
      </div>

    </div>
  );
};

export default Template1Menu;