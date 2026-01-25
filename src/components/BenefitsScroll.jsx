import React from 'react';

const BenefitsScroll = ({ lang, textColor }) => {
  const cardBg = "#3c3728";
  const cardText = "#ebe3c6";

  const content = {
    en: [
      {
        title: "Designed to Increase Sales",
        desc: "Our smart menu highlights your best-sellers and tempts guests with beautiful visuals, proven to increase order value by 30%.",
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Showcase Food with Video",
        desc: "Static images are good, but video is better. Autoplay videos of your sizzling dishes make guests hungry instantly.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Unbeatable Value",
        desc: "Eliminate expensive hardware costs. Get a complete, premium digital system that works on any device for a simple monthly fee.",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" 
      },
      {
        title: "Total Design Freedom",
        desc: "Don't settle for a generic look. Change colors, fonts, and layouts to perfectly match your restaurant's unique branding and identity.",
        img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
      }
    ],
    ar: [
      {
        title: "مصمم لزيادة المبيعات",
        // FIX: Added '&rlm;' after the span to force the period (.) to stay on the left.
        desc: <>يقوم المنيو الذكي بإبراز أفضل أطباقك وإغراء الضيوف بصور لا تقاوم، مما يثبت زيادة قيمة الطلب بنسبة <span dir="ltr" className="inline-block">30%</span>&rlm;.</>,
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "اعرض طعامك بالفيديو",
        desc: "الصور الثابتة جيدة، لكن الفيديو أفضل. فيديوهات التشغيل التلقائي لأطباقك تجعل الضيوف يشعرون بالجوع فوراً.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "أفضل قيمة مقابل سعر",
        desc: "تخلص من تكاليف الأجهزة الباهظة. احصل على نظام رقمي متكامل وفاخر يعمل على أي جهاز باشتراك شهري بسيط.",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "تحكم كامل بالتصميم",
        desc: "لا ترضى بالمظهر التقليدي. غيّر الألوان، الخطوط، والتخطيطات لتتناسب تماماً مع هوية وعلامة مطعمك التجارية.",
        img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  const cards = content[lang];

  return (
    <div className="relative max-w-7xl mx-auto px-4 pb-40">
      
      {/* HEADER */}
      <div className="text-center mb-24 mt-24">
        <h2 className="text-4xl md:text-5xl font-bold italic" style={{ color: textColor }}>
          {lang === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
        </h2>
        <div className="w-24 h-px mx-auto mt-6 bg-current opacity-30" style={{ color: textColor }}></div>
      </div>

      {/* STACKING CARDS CONTAINER */}
      <div className="flex flex-col gap-12"> 
        {cards.map((card, index) => {
          const topOffset = 100 + index * 40; 

          return (
            <div 
              key={index}
              className="sticky w-full rounded-[30px] overflow-hidden flex flex-col md:flex-row shadow-2xl transition-transform duration-500 border border-white/5"
              style={{ 
                position: 'sticky', 
                top: `${topOffset}px`, 
                zIndex: index + 1,
                backgroundColor: cardBg,
                color: cardText,
                height: '70vh', 
              }}
            >
              
              {/* TEXT SIDE */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
                
                {/* Number Background */}
                <div className="absolute top-8 left-8 text-9xl font-bold opacity-[0.03] select-none pointer-events-none">
                  {index + 1}
                </div>

                {/* Content Container */}
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h3 className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${lang === 'en' ? 'italic' : ''}`}>
                    {card.title}
                  </h3>
                  
                  <p 
                    className="text-lg md:text-xl opacity-90 font-light"
                    style={{ 
                      lineHeight: lang === 'ar' ? '2' : '1.6', 
                      fontFamily: lang === 'ar' ? '"Cairo", sans-serif' : 'inherit'
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div className={`w-12 h-[2px] bg-[#ebe3c6] mt-10 opacity-50 ${lang === 'ar' ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}></div>
              </div>

              {/* IMAGE SIDE */}
              <div className="w-full md:w-1/2 relative h-full">
                <img 
                  src={card.img} 
                  alt={card.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                        background: `linear-gradient(to right, ${cardBg} 0%, transparent 40%)` 
                    }}
                ></div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitsScroll;