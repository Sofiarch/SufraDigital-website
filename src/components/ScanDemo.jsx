import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScanDemo = ({ lang, textColor }) => {
  const [phase, setPhase] = useState('scanning'); // scanning | ordering | detail

  // Animation Loop (3 Stages)
  useEffect(() => {
    let timer;
    if (phase === 'scanning') {
      timer = setTimeout(() => setPhase('ordering'), 3500); // Wait 3.5s then show menu
    } else if (phase === 'ordering') {
      timer = setTimeout(() => setPhase('detail'), 1500);   // Wait 1.5s then simulate click
    } else if (phase === 'detail') {
      timer = setTimeout(() => setPhase('scanning'), 4500); // Show details for 4.5s then restart
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const content = {
    en: {
      title: "How it works",
      step1: "1. Scan QR Code",
      desc1: "Guests simply point their camera at the table stand. No app download required.",
      step2: "2. Browse & Order",
      desc2: "The digital menu loads instantly. Guests tap an item to see photos and ingredients.",
      menuTitle: "Signature Dishes",
      // Detail View Content
      detailTitle: "Wagyu Burger",
      detailDesc: "Premium Japanese Wagyu beef patty, aged cheddar, caramelized onions, and truffle mayo on a brioche bun."
      // Removed addToCart
    },
    ar: {
      title: "كيف يعمل؟",
      step1: "١. امسح الرمز",
      desc1: "يقوم الضيوف بتوجيه الكاميرا نحو الرمز الموجود على الطاولة. لا حاجة لتحميل أي تطبيق",
      step2: "٢. تصفح واطلب",
      desc2: "يظهر المنيو الرقمي فوراً. يضغط الضيف على الوجبة لرؤية الصور والمكونات",
      menuTitle: "الأطباق المميزة",
      // Detail View Content
      detailTitle: "واغيو برجر",
      detailDesc: "شريحة لحم واغيو ياباني فاخر، جبنة شيدر معتقة، بصل مكرمل، ومايونيز بالكمأة على خبز بريوش"
      // Removed addToCart
    }
  };

  const t = content[lang] || content['ar'];

  // Animation Variants
  const scanOverlayVariants = {
    scanning: { opacity: 1, zIndex: 10 },
    ordering: { opacity: 0, zIndex: 0, transition: { duration: 0.5 } },
    detail: { opacity: 0, zIndex: 0 }
  };

  const menuVariants = {
    scanning: { y: "100%", opacity: 0 },
    ordering: { y: "0%", opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 60 } },
    detail: { y: "0%", opacity: 1, scale: 0.95, filter: "blur(2px)", transition: { duration: 0.4 } } 
  };

  const detailCardVariants = {
    scanning: { y: "120%", opacity: 0 },
    ordering: { y: "120%", opacity: 0 },
    detail: { y: "0%", opacity: 1, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  const laserVariants = {
    scanning: { 
      top: ["10%", "90%", "10%"], 
      opacity: [1, 1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "linear" } 
    },
    ordering: { opacity: 0 },
    detail: { opacity: 0 }
  };

  const foodItems = [
    { name: "Cheese Pasta", price: "10,000 IQD", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=150&q=80" },
    { name: "Wagyu Burger", price: "6,000 IQD", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80" },
    { name: "Berry Mojito", price: "4,000 IQD", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <div className="py-24 max-w-6xl mx-auto px-4">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold italic" style={{ color: textColor }}>
          {t.title}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-24">
        
        {/* --- STEP 1 Text --- */}
        <motion.div 
          className="md:w-1/3 text-center md:text-right space-y-4"
          animate={{ opacity: phase === 'scanning' ? 1 : 0.3, scale: phase === 'scanning' ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto md:ml-auto md:mr-0 mb-4">1</div>
          <h3 className="text-2xl font-bold" style={{ color: textColor }}>{t.step1}</h3>
          <p className="opacity-70 leading-relaxed" style={{ color: textColor }}>{t.desc1}</p>
        </motion.div>


        {/* --- CENTER: PHONE SIMULATOR --- */}
        <div 
          className="relative w-[280px] h-[550px] rounded-[40px] border-[8px] bg-white overflow-hidden shadow-2xl ring-1 ring-black/10 shrink-0"
          style={{ borderColor: textColor }}
        >
          {/* 1. CAMERA LAYER */}
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

          {/* 2. MENU LIST LAYER */}
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
            
            {/* Fake bottom navigation bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-full"></div>
          </motion.div>

          {/* 3. ITEM DETAIL POPUP LAYER */}
          <motion.div
            className="absolute inset-x-0 bottom-0 top-24 bg-white rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
            variants={detailCardVariants}
            animate={phase}
          >
            {/* Big Image */}
            <div className="h-56 w-full relative">
                <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" 
                    alt="Burger" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col h-full bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.detailTitle}</h3>
                <div className="w-12 h-1 bg-orange-500 rounded-full mb-4"></div>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {t.detailDesc}
                </p>
            </div>
          </motion.div>

        </div>


        {/* --- STEP 2 Text --- */}
        <motion.div 
          className="md:w-1/3 text-center md:text-left space-y-4"
          animate={{ opacity: phase !== 'scanning' ? 1 : 0.3, scale: phase !== 'scanning' ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto md:mr-auto md:ml-0 mb-4">2</div>
          <h3 className="text-2xl font-bold" style={{ color: textColor }}>{t.step2}</h3>
          <p className="opacity-70 leading-relaxed" style={{ color: textColor }}>{t.desc2}</p>
        </motion.div>

      </div>
    </div>
  );
};

export default ScanDemo;