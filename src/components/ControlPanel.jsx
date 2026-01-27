import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ControlPanel = ({ lang, textColor }) => {
  const [price, setPrice] = useState("25,000");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation Loop for the Price Field
  useEffect(() => {
    const loop = async () => {
      await new Promise(r => setTimeout(r, 2000));
      setIsTyping(true);
      
      // Delete old price
      setPrice("25,0"); await new Promise(r => setTimeout(r, 100));
      setPrice("25,"); await new Promise(r => setTimeout(r, 100));
      setPrice("2"); await new Promise(r => setTimeout(r, 100));
      setPrice(""); await new Promise(r => setTimeout(r, 200));
      
      // Type new price
      const target = "28,000";
      for (let i = 0; i <= target.length; i++) {
        setPrice(target.substring(0, i));
        await new Promise(r => setTimeout(r, 150));
      }
      setIsTyping(false);

      await new Promise(r => setTimeout(r, 600));
      setShowSuccess(true); 

      await new Promise(r => setTimeout(r, 3000));
      setShowSuccess(false);
      setPrice("25,000"); 
    };

    loop();
  }, []);

  const content = {
    en: {
      title: "Effortless Management",
      subtitle: "Update your menu in seconds, not days.",
      features: [
        { title: "Real-time Updates", desc: "Change prices or descriptions and see them reflect instantly on all guest phones." },
        { title: "Stock Control", desc: "Sold out of the daily special? Hide it from the menu with a single tap." },
        { title: "Visual Editor", desc: "Drag and drop high-quality photos to make your menu look as good as your food tastes." }
      ],
      ui: {
        labelName: "Item Name",
        itemName: "Wagyu Truffle Burger",
        labelCategory: "Category",
        itemCategory: "Burgers & Sandwiches",
        labelDesc: "Description",
        itemDesc: "Premium Wagyu beef patty topped with black truffle oil, swiss cheese, and caramelized onions.",
        labelPrice: "Price (IQD)",
        save: "Save Changes",
        saved: "Updated Successfully!"
      }
    },
    ar: {
      title: "إدارة سهلة وفورية",
      // UPDATED: Removed trailing dot
      subtitle: "حدث المنيو الخاص بك في ثوانٍ، وليس أيام",
      features: [
        // UPDATED: Removed trailing dots from all descriptions
        { title: "تحديثات فورية", desc: "غيّر الأسعار أو التفاصيل وستظهر التعديلات فوراً على هواتف جميع الضيوف" },
        { title: "التحكم بالمخزون", desc: "نفذ الطبق اليومي؟ قم بإخفائه من القائمة بضغطة زر واحدة" },
        { title: "محرر مرئي", desc: "اسحب وأفلت صوراً عالية الدقة ليظهر المنيو بنفس روعة طعم أطباقك" },
      ],
      ui: {
        labelName: "اسم الوجبة",
        itemName: "واغيو ترافل برجر",
        labelCategory: "القسم",
        itemCategory: "برجر وساندويش",
        labelDesc: "الوصف",
        itemDesc: "شريحة لحم واغيو فاخرة مغطاة بزيت الكمأة الأسود، جبنة سويسرية، وبصل مكرمل.",
        labelPrice: "السعر (د.ع)",
        save: "حفظ التغييرات",
        saved: "تم التحديث بنجاح!"
      }
    }
  };

  const t = content[lang];
  const panelBg = "#3c3728";
  const panelText = "#ebe3c6";
  const inputBg = "rgba(0,0,0,0.2)"; 

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 overflow-hidden">
      
      <div className={`flex flex-col lg:flex-row gap-16 items-center ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
        
        {/* --- TEXT SECTION --- */}
        <div className={`w-full lg:w-1/2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl md:text-5xl font-bold italic mb-6 leading-tight" style={{ color: textColor }}>
            {t.title}
          </h2>
          <p className="text-xl opacity-70 mb-12 font-light" style={{ color: textColor }}>
            {t.subtitle}
          </p>

          <div className="space-y-8">
            {t.features.map((item, i) => (
              <div 
                key={i} 
                className={`flex gap-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                 <div className="shrink-0 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center font-bold text-lg" style={{ color: textColor }}>
                    {i + 1}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{item.title}</h3>
                   <p className="opacity-70 leading-relaxed font-light" style={{ color: textColor }}>{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- VISUAL: THE DASHBOARD SIMULATOR --- */}
        <div className="w-full lg:w-1/2 relative">
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-[#3c3728]/10 to-transparent rounded-full blur-3xl -z-10"></div>

           {/* The Glass Panel */}
           <div 
             className="relative rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
             style={{ backgroundColor: panelBg, color: panelText }}
           >
              {/* Fake Window Header */}
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="text-xs uppercase tracking-widest opacity-50 font-bold">Luxe Admin</div>
              </div>

              {/* Edit Form */}
              <div className={`space-y-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 
                 {/* Row 1: Image & Name */}
                 <div className={`flex gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="shrink-0">
                        <img 
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80" 
                        className="w-20 h-20 rounded-xl object-cover border border-white/20"
                        alt="Burger"
                        />
                    </div>
                    <div className="w-full">
                       <label className="text-xs uppercase opacity-50 font-bold block mb-1">{t.ui.labelName}</label>
                       <div className="w-full bg-black/20 rounded-lg p-3 text-sm font-medium border border-white/10">
                         {t.ui.itemName}
                       </div>
                    </div>
                 </div>

                 {/* Row 2: Category & Price */}
                 <div className={`flex gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-1/2">
                        <label className="text-xs uppercase opacity-50 font-bold block mb-1">{t.ui.labelCategory}</label>
                        <div className="w-full bg-black/20 rounded-lg p-3 text-sm font-medium border border-white/10">
                            {t.ui.itemCategory}
                        </div>
                    </div>
                    
                    {/* Animated Price Field */}
                    <div className="w-1/2">
                        <label className="text-xs uppercase opacity-50 font-bold block mb-1">{t.ui.labelPrice}</label>
                        <div 
                        className={`w-full bg-black/20 rounded-lg p-3 text-sm font-mono flex items-center border ${isTyping ? 'border-orange-500' : 'border-white/10'}`}
                        >
                            <span className="truncate">{price}</span>
                            {isTyping && <motion.div layoutId="cursor" className="w-0.5 h-4 bg-orange-500 animate-pulse ml-1" />}
                        </div>
                    </div>
                 </div>

                 {/* Row 3: Description */}
                 <div>
                    <label className="text-xs uppercase opacity-50 font-bold block mb-1">{t.ui.labelDesc}</label>
                    <div className="w-full bg-black/20 rounded-lg p-3 text-sm font-light border border-white/10 leading-relaxed h-20 overflow-hidden">
                        {t.ui.itemDesc}
                    </div>
                 </div>

                 {/* Save Button */}
                 <button 
                   className={`w-full py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden mt-2 ${showSuccess ? 'bg-green-600 text-white' : 'bg-[#ebe3c6] text-[#3c3728]'}`}
                 >
                    <AnimatePresence mode='wait'>
                        {showSuccess ? (
                            <motion.span 
                                key="saved"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                {t.ui.saved}
                            </motion.span>
                        ) : (
                            <motion.span 
                                key="save"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                            >
                                {t.ui.save}
                            </motion.span>
                        )}
                    </AnimatePresence>
                 </button>

              </div>
           </div>

           {/* Decorative Blur Element */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500 rounded-full blur-[40px] opacity-40"
           />

        </div>

      </div>
    </div>
  );
};

export default ControlPanel;