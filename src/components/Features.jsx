import React from 'react';

const Features = ({ lang, textColor }) => {
  const content = {
    en: {
      title: "All-in-one menu platform for restaurants, bars, cafes, and hotels!",
      items: [
        { title: "TABLET MENU", desc: "Our tablet menu app runs on both iOS and Android", img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=500" },
        { title: "QR MENU", desc: "No APP required. Scan QR on mobile to see menu", img: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=500" },
        { title: "QR & TABLET ORDERING", desc: "Unique QR codes identify which table or room ordered", img: "https://images.unsplash.com/photo-1526367790999-0150786486a2?auto=format&fit=crop&q=80&w=500" },
        { title: "ONLINE ORDERING", desc: "Start receiving direct online orders with 0% commission", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500" }
      ]
    },
    ar: {
      title: "منصة منيو متكاملة للمطاعم، البارات، الكافيهات، والفنادق!",
      items: [
        { title: "منيو التابلت", desc: "تطبيق المنيو الخاص بنا يعمل على أنظمة iOS و Android", img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=500" },
        { title: "منيو QR", desc: "لا حاجة لتحميل تطبيق. امسح الرمز للمشاهدة فوراً", img: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=500" },
        { title: "الطلب عبر QR", desc: "أكواد فريدة تحدد الطاولة أو الغرفة التي طلبت", img: "https://images.unsplash.com/photo-1526367790999-0150786486a2?auto=format&fit=crop&q=80&w=500" },
        { title: "الطلب أونلاين", desc: "ابدأ باستلام الطلبات المباشرة بعمولة 0%", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500" }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 italic" style={{ color: textColor }}>
        {t.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {t.items.map((item, index) => (
          <div key={index} className="relative group overflow-hidden rounded-3xl aspect-[4/5] shadow-2xl">
            {/* Image */}
            <img 
              src={item.img} 
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Dark Content Box (Bottom Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#1a1a1a]/90 text-center m-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-orange-200 font-bold tracking-widest text-sm mb-2 uppercase">
                {item.title}
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;