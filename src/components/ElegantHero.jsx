import React from 'react';
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const ElegantHero = ({ lang, onContact }) => {
  const content = {
    en: {
      // badge: "Luxe Menu", <--- Removed
      title1: "The Golden",
      title2: "Standard",
      desc: "Elevate your restaurant with bespoke digital menus designed for the modern era of Iraqi hospitality.",
      cta: "Experience Elegance"
    },
    ar: {
      // badge: "لوكس منيو", <--- Removed
      title1: "المعيار الذهبي",
      title2: "للضيافة",
      desc: "ارتقِ بمطعمك مع قوائم طعام رقمية مصممة خصيصاً لتناسب العصر الحديث للضيافة العراقية.",
      cta: "اختبر الفخامة"
    }
  };

  const t = content[lang];

  return (
    <div className="relative w-full overflow-x-hidden">
      <HeroGeometric 
        // badge={t.badge} <--- Removed prop
        title1={t.title1}
        title2={t.title2}
        desc={t.desc}
        cta={t.cta}
        onContact={onContact} 
      />
    </div>
  );
};

export default ElegantHero;