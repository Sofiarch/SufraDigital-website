import React from 'react';
import { motion } from 'framer-motion';

const ConceptGrid = ({ lang, textColor }) => {
  const sectionBg = "#3c3728";
  const sectionText = "#ebe3c6";

  const content = {
    en: {
      title: "What is a QR Menu?",
      desc: "It is not just a PDF. It is a fully interactive digital experience that lives on your guest's smartphone.",
      cards: [
        {
          title: "Instant Access",
          text: "No app download required. Guests simply point their camera and the menu appears instantly.",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          title: "Always Up-to-Date",
          text: "Change prices, hide sold-out items, or add specials in seconds. No re-printing needed.",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        },
        {
          title: "Rich Visuals",
          // UPDATED: Removed "and videos"
          text: "Entice guests with high-definition photos of every dish, increasing appetite and sales.",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    ar: {
      title: "ما هو المنيو الرقمي؟",
      desc: <>هو ليس مجرد ملف <span dir="ltr" className="inline-block mx-1 font-bold">PDF</span>. إنه تجربة رقمية تفاعلية بالكامل تعمل مباشرة على هاتف ضيوفك</>,
      cards: [
        {
          title: "وصول فوري",
          text: "لا حاجة لتحميل أي تطبيق. يوجه الضيف الكاميرا نحو الرمز ويظهر المنيو فوراً",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          title: "محدث دائماً",
          text: "غير الأسعار، أخفِ الوجبات النافدة، أو أضف عروضاً خاصة في ثوانٍ. وداعاً لتكاليف الطباعة",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        },
        {
          title: "تجربة بصرية غنية",
          // UPDATED: Removed "وفيديوهات"
          text: "اجذب ضيوفك بصور عالية الدقة لكل طبق، مما يزيد الشهية والمبيعات",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: sectionBg, color: sectionText }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Intro Text */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
            {t.title}
          </h2>
          <div className="w-20 h-1 bg-[#ebe3c6] mx-auto mb-6 opacity-30 rounded-full"></div>
          <p className="text-lg md:text-xl opacity-80 leading-relaxed font-light">
            {t.desc}
          </p>
        </div>

        {/* The Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
        >
          {t.cards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-[30px] border border-[#ebe3c6]/10 hover:bg-[#ebe3c6]/5 transition-colors duration-300 group"
            >
              {/* Icon Bubble */}
              <div className="w-16 h-16 rounded-2xl bg-[#ebe3c6]/10 flex items-center justify-center mb-6 text-[#ebe3c6] group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <p className="opacity-70 leading-relaxed font-light text-sm md:text-base">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ConceptGrid;