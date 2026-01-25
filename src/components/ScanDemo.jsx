import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScanDemo = ({ lang, textColor }) => {
  const [phase, setPhase] = useState('scanning');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 'scanning' ? 'ordering' : 'scanning'));
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  const content = {
    en: {
      title: "How it works",
      step1: "1. Scan QR Code",
      desc1: "Guests simply point their camera at the table stand. No app download required.",
      step2: "2. Browse & Order",
      desc2: "The digital menu loads instantly. Guests choose their meals and order.",
      menuTitle: "Signature Dishes"
    },
    ar: {
      title: "كيف يعمل؟",
      step1: "١. امسح الرمز",
      desc1: "يقوم الضيوف بتوجيه الكاميرا نحو الرمز الموجود على الطاولة. لا حاجة لتحميل أي تطبيق.",
      step2: "٢. تصفح واطلب",
      desc2: "يظهر المنيو الرقمي فوراً. يختار الضيوف وجباتهم ويرسلون الطلب.",
      menuTitle: "الأطباق المميزة"
    }
  };

  const t = content[lang] || content['ar'];

  const scanOverlayVariants = {
    scanning: { opacity: 1, zIndex: 10 },
    ordering: { opacity: 0, zIndex: 0, transition: { duration: 0.5 } }
  };

  const menuVariants = {
    scanning: { y: "100%", opacity: 0 },
    ordering: { 
      y: "0%", 
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 15, delay: 0.2 } 
    }
  };

  const laserVariants = {
    scanning: { 
      top: ["10%", "90%", "10%"], 
      opacity: [1, 1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "linear" } 
    },
    ordering: { opacity: 0 }
  };

  const foodItems = [
    { name: "Truffle Pasta", price: "25,000 IQD", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=150&q=80" },
    { name: "Wagyu Burger", price: "18,000 IQD", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80" },
    { name: "Berry Mojito", price: "8,000 IQD", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <div className="py-24 max-w-6xl mx-auto px-4">
      
      {/* HEADER SECTION INSIDE COMPONENT */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold italic" style={{ color: textColor }}>
          {t.title}
        </h2>
      </div>

      {/* LAYOUT CHANGE: 
        'md:flex-row-reverse' puts the first child (Step 1) on the RIGHT 
        and the last child (Step 2) on the LEFT.
      */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-24">
        
        {/* --- STEP 1 (Appears on RIGHT) --- */}
        <motion.div 
          className="md:w-1/3 text-center md:text-right space-y-4"
          animate={{ opacity: phase === 'scanning' ? 1 : 0.3, scale: phase === 'scanning' ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Number badge aligned to right */}
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto md:ml-auto md:mr-0 mb-4">1</div>
          <h3 className="text-2xl font-bold" style={{ color: textColor }}>{t.step1}</h3>
          <p className="opacity-70 leading-relaxed" style={{ color: textColor }}>{t.desc1}</p>
        </motion.div>


        {/* --- CENTER: PHONE (Shorter Height) --- */}
        {/* Changed h-[580px] to h-[500px] */}
        <div 
          className="relative w-[260px] h-[500px] rounded-[40px] border-[8px] bg-white overflow-hidden shadow-2xl ring-1 ring-black/10 shrink-0"
          style={{ borderColor: textColor }}
        >
          {/* CAMERA LAYER */}
          <motion.div 
            className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-6"
            variants={scanOverlayVariants}
            animate={phase}
          >
            <div className="relative w-48 h-48 bg-white rounded-xl p-3 shadow-lg">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExampleMenu" 
                alt="QR Code" 
                className="w-full h-full object-contain opacity-90"
              />
              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-lg"></div>
            </div>

            <motion.div 
              className="absolute left-8 right-8 h-1 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)] rounded-full z-20"
              variants={laserVariants}
              animate={phase}
            />
          </motion.div>

          {/* MENU LAYER */}
          <motion.div
            className="absolute inset-0 bg-[#f8f5ea] flex flex-col pt-10 px-4"
            variants={menuVariants}
            animate={phase}
          >
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-lg font-bold italic text-gray-800">{t.menuTitle}</h4>
               <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-[10px] font-bold">3</div>
            </div>

            <div className="space-y-3">
              {foodItems.map((item, i) => (
                <div key={i} className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 items-center">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-gray-800 text-xs">{item.name}</span>
                    <span className="text-orange-600 text-[10px] font-bold mt-0.5">{item.price}</span>
                  </div>
                  <div className="ml-auto w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs">+</div>
                </div>
              ))}
            </div>

            <div className="mt-auto mb-6 bg-gray-900 text-[#ebe3c6] py-3 rounded-xl text-center font-bold text-sm shadow-lg">
              Check Out
            </div>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-full"></div>
          </motion.div>
        </div>


        {/* --- STEP 2 (Appears on LEFT) --- */}
        <motion.div 
          className="md:w-1/3 text-center md:text-left space-y-4"
          animate={{ opacity: phase === 'ordering' ? 1 : 0.3, scale: phase === 'ordering' ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Number badge aligned to left */}
          <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto md:mr-auto md:ml-0 mb-4">2</div>
          <h3 className="text-2xl font-bold" style={{ color: textColor }}>{t.step2}</h3>
          <p className="opacity-70 leading-relaxed" style={{ color: textColor }}>{t.desc2}</p>
        </motion.div>

      </div>
    </div>
  );
};

export default ScanDemo;